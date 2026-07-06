import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { parseBody, INVALID_BODY_ERROR } from '../utils/http.js';

export const fundsRoutes = new Hono();

// ---------------------------------------------------------------------------
// Utilitários de importação — mesma lógica do script server/src/db/etl_fundos.py,
// só que em JavaScript porque esta parte roda dentro do Worker (o Python é só
// para gerar o seed inicial offline).
// ---------------------------------------------------------------------------
const LEVEL_MAP = { M: 'MUNICIPAL', E: 'ESTADUAL', N: 'NACIONAL' };

const UF_NOME = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia',
  CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás',
  MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul', MG: 'Minas Gerais',
  PA: 'Pará', PB: 'Paraíba', PR: 'Paraná', PE: 'Pernambuco', PI: 'Piauí',
  RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte', RS: 'Rio Grande do Sul',
  RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina', SP: 'São Paulo',
  SE: 'Sergipe', TO: 'Tocantins',
};

const LOWER_WORDS = new Set(['de', 'da', 'do', 'das', 'dos', 'e']);

function titleCasePt(s) {
  return s.trim().toLowerCase().split(/\s+/).map((w, i) => {
    if (i > 0 && LOWER_WORDS.has(w)) return w;
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

function formatCnpj(raw) {
  const d = raw.trim();
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12, 14)}`;
}

function buildName(tipo, level, uf, place) {
  const tipoLabel = tipo === 'FDCA' ? 'Criança e do Adolescente' : 'Pessoa Idosa';
  if (level === 'NACIONAL') return `Fundo Nacional dos Direitos da ${tipoLabel}`;
  if (level === 'ESTADUAL') {
    const estado = UF_NOME[uf] || titleCasePt(place.replace(/^ESTADO D[OA] /, ''));
    return `Fundo Estadual dos Direitos da ${tipoLabel} — ${estado} (${uf})`;
  }
  const cidade = titleCasePt(place);
  return `Fundo Municipal dos Direitos da ${tipoLabel} de ${cidade} (${uf})`;
}

// Parseia um CSV no formato exato dos Anexos I/II da Receita Federal:
// TIPO_DE_FUNDO;ABRANGENCIA;UF;MUNICIPIO/ESTADO/BR;CNPJ;IBGE (separado por ; , com BOM UTF-8)
function parseOfficialCsv(text, tipo) {
  const clean = text.replace(/^\uFEFF/, '');
  const lines = clean.split(/\r?\n/).filter(l => l.trim().length > 0);
  const rows = [];
  for (let i = 1; i < lines.length; i++) { // pula o cabeçalho
    const cols = lines[i].split(';');
    if (cols.length < 6) continue;
    const [, abrangencia, uf, place, cnpjRaw, ibge] = cols.map(c => c.trim());
    const level = LEVEL_MAP[abrangencia];
    if (!level || !/^\d{14}$/.test(cnpjRaw)) continue; // linha malformada — ignora em vez de quebrar a importação inteira
    rows.push({ tipo, level, uf, place, cnpjRaw, ibge });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Rotas
// ---------------------------------------------------------------------------

// GET /api/funds — list with filters + paginação (o catálogo tem milhares de
// fundos reais — sem paginação, uma busca sem filtro devolveria tudo de uma vez)
fundsRoutes.get('/', async (c) => {
  const { type, level, state, city, search, page = '1', pageSize = '20' } = c.req.query();
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const size = Math.min(100, Math.max(1, parseInt(pageSize, 10) || 20));
  const offset = (pageNum - 1) * size;

  let where = ' WHERE is_active = 1';
  const params = [];
  if (type) { where += ' AND type = ?'; params.push(type); }
  if (level) { where += ' AND level = ?'; params.push(level); }
  if (state) { where += ' AND state = ?'; params.push(state); }
  if (city) { where += ' AND city LIKE ?'; params.push(`%${city}%`); }
  if (search) { where += ' AND (name LIKE ? OR city LIKE ? OR state LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  const countRow = await c.env.DB.prepare(`SELECT COUNT(*) as total FROM funds${where}`).bind(...params).first();
  const total = countRow?.total || 0;

  const { results } = await c.env.DB.prepare(
    `SELECT * FROM funds${where} ORDER BY name LIMIT ? OFFSET ?`
  ).bind(...params, size, offset).all();

  return c.json({ funds: results, total, page: pageNum, pageSize: size, totalPages: Math.max(1, Math.ceil(total / size)) });
});

// GET /api/funds/:id — detail
fundsRoutes.get('/:id', async (c) => {
  const { id } = c.req.param();
  const fund = await c.env.DB.prepare('SELECT * FROM funds WHERE id = ?').bind(id).first();
  if (!fund) return c.json({ error: 'Fundo não encontrado' }, 404);

  const { results: projects } = await c.env.DB.prepare('SELECT * FROM projects WHERE fund_id = ? ORDER BY created_at DESC').bind(id).all();
  const { results: reports } = await c.env.DB.prepare('SELECT * FROM reports WHERE fund_id = ? ORDER BY reference_year DESC').bind(id).all();

  fund.projects = projects;
  fund.reports = reports;

  return c.json({ fund });
});

// POST /api/funds — create (Admin) — fundo cadastrado manualmente, sem data_year
// (fica de fora quando um import por CSV substitui a base oficial)
fundsRoutes.post('/', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO funds (id, name, type, level, state, city, cnpj) VALUES (?,?,?,?,?,?,?)'
  ).bind(id, body.name, body.type, body.level, body.state || null, body.city || null, body.cnpj || null).run();
  return c.json({ id, message: 'Fundo criado' }, 201);
});

// PUT /api/funds/:id — update (Admin)
fundsRoutes.put('/:id', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { id } = c.req.param();
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  await c.env.DB.prepare(
    'UPDATE funds SET name=?, type=?, level=?, state=?, city=?, cnpj=? WHERE id=?'
  ).bind(body.name, body.type, body.level, body.state || null, body.city || null, body.cnpj || null, id).run();
  return c.json({ message: 'Fundo atualizado' });
});

// DELETE /api/funds/:id — deactivate (Admin)
fundsRoutes.delete('/:id', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare('UPDATE funds SET is_active = 0 WHERE id = ?').bind(id).run();
  return c.json({ message: 'Fundo desativado' });
});

// GET /api/funds/import/status — resumo do estado atual da base oficial (Admin),
// para a tela de importação mostrar "você tem X fundos da base de tal ano" antes
// de qualquer ação destrutiva
fundsRoutes.get('/import/status', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT data_year, COUNT(*) as total FROM funds WHERE data_year IS NOT NULL GROUP BY data_year ORDER BY data_year DESC'
  ).all();
  const manualCount = await c.env.DB.prepare('SELECT COUNT(*) as total FROM funds WHERE data_year IS NULL').first();
  return c.json({ years: results, manualCount: manualCount?.total || 0 });
});

// POST /api/funds/import — substitui a base oficial de fundos pelos CSVs enviados (Admin)
// Body: { year: 2027, fdcaCsv: "conteudo do arquivo...", fdiCsv: "conteudo do arquivo..." }
fundsRoutes.post('/import', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const body = await parseBody(c);
  if (!body || !body.year || !body.fdcaCsv || !body.fdiCsv) {
    return c.json({ error: 'Envie year, fdcaCsv e fdiCsv no corpo da requisição' }, 400);
  }

  const rows = [
    ...parseOfficialCsv(body.fdcaCsv, 'FDCA'),
    ...parseOfficialCsv(body.fdiCsv, 'FDI'),
  ];
  if (rows.length === 0) {
    return c.json({ error: 'Nenhuma linha válida encontrada nos arquivos enviados. Confira se são os Anexos I/II no formato oficial da Receita Federal.' }, 400);
  }

  const db = c.env.DB;
  const insertSql = 'INSERT OR REPLACE INTO funds (id, name, type, level, state, city, cnpj, ibge_code, data_year, is_active) VALUES (?,?,?,?,?,?,?,?,?,1)';
  const stmts = rows.map(r => {
    const id = `f-${r.cnpjRaw}`;
    const name = buildName(r.tipo, r.level, r.uf, r.place);
    const state = r.level === 'NACIONAL' ? null : r.uf;
    const city = r.level === 'MUNICIPAL' ? titleCasePt(r.place) : null;
    const cnpj = formatCnpj(r.cnpjRaw);
    return db.prepare(insertSql).bind(id, name, r.tipo, r.level, state, city, cnpj, r.ibge, body.year);
  });

  // Lotes menores (50, não 100) — mais chamadas, mas cada uma mais rápida e
  // com menos chance de esbarrar em limite de tempo/tamanho da Cloudflare em
  // produção (no ambiente local de teste, lotes de 100 pareciam OK, mas a
  // infraestrutura remota real tem latência de rede que o teste local não
  // reproduz fielmente).
  const BATCH_SIZE = 50;
  let inserted = 0;
  try {
    // Insere o novo catálogo PRIMEIRO — se algo falhar no meio do caminho,
    // o catálogo antigo continua intacto (o site não fica com uma base pela
    // metade). Só remove o ano antigo depois que TODO o novo lote entrar.
    for (let i = 0; i < stmts.length; i += BATCH_SIZE) {
      await db.batch(stmts.slice(i, i + BATCH_SIZE));
      inserted += stmts.slice(i, i + BATCH_SIZE).length;
    }
  } catch (err) {
    return c.json({
      error: `Falha ao importar: ${err.message || 'erro desconhecido'}. ${inserted} de ${stmts.length} fundos novos foram gravados antes da falha — a base antiga NÃO foi apagada, então o site continua funcionando com os dados anteriores.`,
    }, 500);
  }

  try {
    // Remove do catálogo qualquer fundo de um ANO ANTERIOR ao que acabou de
    // entrar (não afeta o que acabamos de inserir, nem fundos manuais com
    // data_year NULL).
    await db.prepare('DELETE FROM projects WHERE fund_id IN (SELECT id FROM funds WHERE data_year IS NOT NULL AND data_year != ?)').bind(body.year).run();
    await db.prepare('DELETE FROM reports WHERE fund_id IN (SELECT id FROM funds WHERE data_year IS NOT NULL AND data_year != ?)').bind(body.year).run();
    await db.prepare('DELETE FROM funds WHERE data_year IS NOT NULL AND data_year != ?').bind(body.year).run();
  } catch (err) {
    return c.json({
      error: `${stmts.length} fundos novos (ano ${body.year}) foram importados com sucesso, mas houve falha ao limpar a base do ano anterior: ${err.message}. Os dois anos podem estar coexistindo agora — rode a importação de novo ou entre em contato para ajuda.`,
    }, 500);
  }

  return c.json({ message: 'Importação concluída', total: stmts.length, year: body.year });
});
