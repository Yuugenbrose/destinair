import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.js';
import { parseBody, INVALID_BODY_ERROR } from '../utils/http.js';

export const donationsRoutes = new Hono();

// PUT /api/donations/:id — update status/amount (User/Admin)
donationsRoutes.put("/:id", authMiddleware(), async (c) => {
  const { id } = c.req.param();
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  const { status, amount, receiptLink } = body;
  const user = c.get("user");
  const db = c.env.DB;

  const donation = await db.prepare("SELECT user_id FROM donations WHERE id = ?").bind(id).first();
  if (!donation) return c.json({ error: "Doação/Simulação não encontrada" }, 404);

  // Only owner or ADMIN can update
  if (donation.user_id !== user.id && user.role !== "ADMIN") {
    return c.json({ error: "Não autorizado a atualizar esta doação/simulação" }, 403);
  }

  let updateFields = [];
  let params = [];

  if (status) { updateFields.push("status = ?"); params.push(status); }
  if (amount) { updateFields.push("amount = ?"); params.push(amount); }
  if (receiptLink !== undefined) { updateFields.push("receipt_link = ?"); params.push(receiptLink || null); }

  if (updateFields.length === 0) {
    return c.json({ error: "Nenhum campo para atualizar" }, 400);
  }

  params.push(id);
  await db.prepare(`UPDATE donations SET ${updateFields.join(", ")} WHERE id = ?`).bind(...params).run();

  return c.json({ message: "Doação/Simulação atualizada com sucesso" });
});

// DELETE /api/donations/:id — delete (User/Admin)
donationsRoutes.delete("/:id", authMiddleware(), async (c) => {
  const { id } = c.req.param();
  const user = c.get("user");
  const db = c.env.DB;

  const donation = await db.prepare("SELECT user_id FROM donations WHERE id = ?").bind(id).first();
  if (!donation) return c.json({ error: "Doação/Simulação não encontrada" }, 404);

  // Only owner or ADMIN can delete
  if (donation.user_id !== user.id && user.role !== "ADMIN") {
    return c.json({ error: "Não autorizado a deletar esta doação/simulação" }, 403);
  }

  await db.prepare("DELETE FROM donations WHERE id = ?").bind(id).run();

  return c.json({ message: "Doação/Simulação deletada com sucesso" });
});

// POST /api/donations — create donation/simulation
donationsRoutes.post('/', authMiddleware(), async (c) => {
  const user = c.get('user');
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  const { fundId, amount, taxYear, status } = body;
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
