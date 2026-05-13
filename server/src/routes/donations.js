import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';

export const donationsRoutes = new Hono();

// POST /api/donations — create donation/simulation
donationsRoutes.post('/', authMiddleware(), async (c) => {
  const user = c.get('user');
  const { fundId, amount, taxYear, status } = await c.req.json();
  if (!fundId || !amount || !taxYear) return c.json({ error: 'fundId, amount e taxYear são obrigatórios' }, 400);

  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO donations (id, user_id, fund_id, amount, tax_year, status) VALUES (?,?,?,?,?,?)'
  ).bind(id, user.id, fundId, amount, taxYear, status || 'SIMULADA').run();

  return c.json({ id, message: 'Doação registrada' }, 201);
});

// GET /api/donations — user's donations
donationsRoutes.get('/', authMiddleware(), async (c) => {
  const user = c.get('user');
  const { results } = await c.env.DB.prepare(
    'SELECT d.*, f.name as fund_name, f.type as fund_type FROM donations d JOIN funds f ON f.id = d.fund_id WHERE d.user_id = ? ORDER BY d.created_at DESC'
  ).bind(user.id).all();
  return c.json({ donations: results });
});

// GET /api/donations/stats — public stats
donationsRoutes.get('/stats', async (c) => {
  const total = await c.env.DB.prepare('SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM donations WHERE status = "PAGA"').first();
  const byType = await c.env.DB.prepare(
    'SELECT f.type, COALESCE(SUM(d.amount),0) as total, COUNT(*) as count FROM donations d JOIN funds f ON f.id = d.fund_id WHERE d.status = "PAGA" GROUP BY f.type'
  ).all();
  const byYear = await c.env.DB.prepare(
    'SELECT tax_year, COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM donations WHERE status = "PAGA" GROUP BY tax_year ORDER BY tax_year'
  ).all();

  return c.json({
    totalAmount: total?.total || 0,
    totalCount: total?.count || 0,
    byType: byType?.results || [],
    byYear: byYear?.results || [],
  });
});
