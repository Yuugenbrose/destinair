import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { parseBody, INVALID_BODY_ERROR } from '../utils/http.js';

export const statsRoutes = new Hono();

// GET /api/stats/national — público, para a página de Transparência
statsRoutes.get('/national', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM national_stats ORDER BY reference_year DESC, scope ASC'
  ).all();
  return c.json({ stats: results });
});

// POST /api/stats/national — criar (Admin)
statsRoutes.post('/national', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  const id = crypto.randomUUID();
  try {
    await c.env.DB.prepare(
      `INSERT INTO national_stats (id, reference_year, scope, state, total_amount, total_destinations, fdca_total, fdi_total, fdca_pct, fdi_pct, pct_contribuintes, note, source_label, source_url)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
    ).bind(
      id, body.referenceYear, body.scope || 'NACIONAL', body.state || null,
      body.totalAmount ?? null, body.totalDestinations ?? null, body.fdcaTotal ?? null, body.fdiTotal ?? null,
      body.fdcaPct ?? null, body.fdiPct ?? null, body.pctContribuintes ?? null,
      body.note || null, body.sourceLabel || null, body.sourceUrl || null
    ).run();
  } catch (err) {
    return c.json({ error: `Erro ao criar estatística: ${err.message}` }, 500);
  }
  return c.json({ id, message: 'Estatística criada' }, 201);
});

// PUT /api/stats/national/:id — editar (Admin)
statsRoutes.put('/national/:id', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { id } = c.req.param();
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  try {
    await c.env.DB.prepare(
      `UPDATE national_stats SET reference_year=?, scope=?, state=?, total_amount=?, total_destinations=?, fdca_total=?, fdi_total=?, fdca_pct=?, fdi_pct=?, pct_contribuintes=?, note=?, source_label=?, source_url=?, updated_at=datetime('now')
       WHERE id=?`
    ).bind(
      body.referenceYear, body.scope || 'NACIONAL', body.state || null,
      body.totalAmount ?? null, body.totalDestinations ?? null, body.fdcaTotal ?? null, body.fdiTotal ?? null,
      body.fdcaPct ?? null, body.fdiPct ?? null, body.pctContribuintes ?? null,
      body.note || null, body.sourceLabel || null, body.sourceUrl || null, id
    ).run();
  } catch (err) {
    return c.json({ error: `Erro ao atualizar estatística: ${err.message}` }, 500);
  }
  return c.json({ message: 'Estatística atualizada' });
});

// DELETE /api/stats/national/:id — remover (Admin)
statsRoutes.delete('/national/:id', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare('DELETE FROM national_stats WHERE id = ?').bind(id).run();
  return c.json({ message: 'Estatística removida' });
});
