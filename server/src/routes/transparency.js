import { Hono } from 'hono';

export const transparencyRoutes = new Hono();

// GET /api/transparency/overview
transparencyRoutes.get('/overview', async (c) => {
  const db = c.env.DB;

  const totalDonations = await db.prepare('SELECT COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM donations WHERE status = "PAGA"').first();
  const totalProjects = await db.prepare('SELECT COUNT(*) as count FROM projects').first();
  const totalFunds = await db.prepare('SELECT COUNT(*) as count FROM funds WHERE is_active = 1').first();

  const byState = await db.prepare(
    `SELECT f.state, f.type, COALESCE(SUM(d.amount),0) as total
     FROM funds f LEFT JOIN donations d ON d.fund_id = f.id AND d.status = 'PAGA'
     WHERE f.state IS NOT NULL GROUP BY f.state, f.type ORDER BY total DESC`
  ).all();

  const byYear = await db.prepare(
    'SELECT tax_year as year, COALESCE(SUM(amount),0) as total FROM donations WHERE status = "PAGA" GROUP BY tax_year ORDER BY tax_year'
  ).all();

  const byCategory = await db.prepare(
    'SELECT category, COUNT(*) as count, COALESCE(SUM(budget),0) as totalBudget FROM projects WHERE category IS NOT NULL GROUP BY category ORDER BY totalBudget DESC'
  ).all();

  return c.json({
    totalAmount: totalDonations?.total || 0,
    totalDonations: totalDonations?.count || 0,
    totalProjects: totalProjects?.count || 0,
    totalFunds: totalFunds?.count || 0,
    byState: byState?.results || [],
    byYear: byYear?.results || [],
    byCategory: byCategory?.results || [],
  });
});

// GET /api/transparency/by-fund/:id
transparencyRoutes.get('/by-fund/:id', async (c) => {
  const { id } = c.req.param();
  const db = c.env.DB;

  const fund = await db.prepare('SELECT * FROM funds WHERE id = ?').bind(id).first();
  if (!fund) return c.json({ error: 'Fundo não encontrado' }, 404);

  const donations = await db.prepare(
    'SELECT tax_year, COALESCE(SUM(amount),0) as total, COUNT(*) as count FROM donations WHERE fund_id = ? AND status = "PAGA" GROUP BY tax_year ORDER BY tax_year'
  ).bind(id).all();

  const projects = await db.prepare('SELECT * FROM projects WHERE fund_id = ? ORDER BY created_at DESC').bind(id).all();
  const reports = await db.prepare('SELECT * FROM reports WHERE fund_id = ? ORDER BY reference_year DESC').bind(id).all();

  return c.json({
    fund,
    donations: donations?.results || [],
    projects: projects?.results || [],
    reports: reports?.results || [],
  });
});
