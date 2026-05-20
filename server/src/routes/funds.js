import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export const fundsRoutes = new Hono();

// GET /api/funds — list with filters
fundsRoutes.get('/', async (c) => {
  const { type, level, state, city, search } = c.req.query();
  let sql = 'SELECT * FROM funds WHERE is_active = 1';
  const params = [];

  if (type) { sql += ' AND type = ?'; params.push(type); }
  if (level) { sql += ' AND level = ?'; params.push(level); }
  if (state) { sql += ' AND state = ?'; params.push(state); }
  if (city) { sql += ' AND city LIKE ?'; params.push(`%${city}%`); }
  if (search) { sql += ' AND (name LIKE ? OR city LIKE ? OR state LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  sql += ' ORDER BY name';
  const { results } = await c.env.DB.prepare(sql).bind(...params).all();

  // Attach project count and total raised
  for (const fund of results) {
    const stats = await c.env.DB.prepare(
      'SELECT COUNT(*) as projectCount, COALESCE(SUM(d.amount),0) as totalRaised FROM funds f LEFT JOIN donations d ON d.fund_id = f.id AND d.status = "PAGA" WHERE f.id = ?'
    ).bind(fund.id).first();
    const pCount = await c.env.DB.prepare('SELECT COUNT(*) as c FROM projects WHERE fund_id = ?').bind(fund.id).first();
    fund.projectCount = pCount?.c || 0;
    fund.totalRaised = stats?.totalRaised || 0;
  }

  return c.json({ funds: results });
});

// GET /api/funds/:id — detail
fundsRoutes.get('/:id', async (c) => {
  const { id } = c.req.param();
  const fund = await c.env.DB.prepare('SELECT * FROM funds WHERE id = ?').bind(id).first();
  if (!fund) return c.json({ error: 'Fundo não encontrado' }, 404);

  const { results: projects } = await c.env.DB.prepare('SELECT * FROM projects WHERE fund_id = ? ORDER BY created_at DESC').bind(id).all();
  const { results: reports } = await c.env.DB.prepare('SELECT * FROM reports WHERE fund_id = ? ORDER BY reference_year DESC').bind(id).all();
  const totalRaised = await c.env.DB.prepare('SELECT COALESCE(SUM(amount),0) as total FROM donations WHERE fund_id = ? AND status = "PAGA"').bind(id).first();
  const beneficiaries = await c.env.DB.prepare('SELECT COALESCE(SUM(beneficiaries_count),0) as total FROM projects WHERE fund_id = ?').bind(id).first();

  fund.projects = projects;
  fund.reports = reports;
  fund.totalRaised = totalRaised?.total || 0;
  fund.beneficiariesCount = beneficiaries?.total || 0;
  fund.projectCount = projects.length;

  return c.json({ fund });
});

// POST /api/funds — create (Admin)
fundsRoutes.post('/', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const body = await c.req.json();
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO funds (id, name, type, level, state, city, cnpj, bank_info, description, contact_email, contact_phone) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  ).bind(id, body.name, body.type, body.level, body.state||null, body.city||null, body.cnpj||null, body.bankInfo||null, body.description||null, body.contactEmail||null, body.contactPhone||null).run();
  return c.json({ id, message: 'Fundo criado' }, 201);
});

// PUT /api/funds/:id — update (Admin)
fundsRoutes.put('/:id', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE funds SET name=?, type=?, level=?, state=?, city=?, cnpj=?, bank_info=?, description=?, contact_email=?, contact_phone=? WHERE id=?'
  ).bind(body.name, body.type, body.level, body.state||null, body.city||null, body.cnpj||null, body.bankInfo||null, body.description||null, body.contactEmail||null, body.contactPhone||null, id).run();
  return c.json({ message: 'Fundo atualizado' });
});

// DELETE /api/funds/:id — deactivate (Admin)
fundsRoutes.delete('/:id', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare('UPDATE funds SET is_active = 0 WHERE id = ?').bind(id).run();
  return c.json({ message: 'Fundo desativado' });
});
