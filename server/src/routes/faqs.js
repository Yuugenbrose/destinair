import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.js';

export const faqsRoutes = new Hono();

// GET /api/faqs
faqsRoutes.get('/', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM faqs WHERE is_active = 1 ORDER BY order_index'
  ).all();
  return c.json({ faqs: results });
});

// POST /api/faqs — create (Admin)
faqsRoutes.post('/', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { question, answer, category, orderIndex } = await c.req.json();
  if (!question || !answer) return c.json({ error: 'Pergunta e resposta são obrigatórias' }, 400);
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO faqs (id, question, answer, category, order_index) VALUES (?,?,?,?,?)'
  ).bind(id, question, answer, category || null, orderIndex || 0).run();
  return c.json({ id, message: 'FAQ criada' }, 201);
});

// PUT /api/faqs/:id — update (Admin)
faqsRoutes.put('/:id', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { id } = c.req.param();
  const { question, answer, category, orderIndex, isActive } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE faqs SET question=?, answer=?, category=?, order_index=?, is_active=? WHERE id=?'
  ).bind(question, answer, category||null, orderIndex||0, isActive !== undefined ? (isActive?1:0) : 1, id).run();
  return c.json({ message: 'FAQ atualizada' });
});

// DELETE /api/faqs/:id — deactivate (Admin)
faqsRoutes.delete('/:id', authMiddleware(), requireRole('ADMIN'), async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare('UPDATE faqs SET is_active = 0 WHERE id = ?').bind(id).run();
  return c.json({ message: 'FAQ desativada' });
});
