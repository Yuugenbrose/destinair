import { Hono } from 'hono';
import { authMiddleware, requireRole } from '../middleware/auth.js';
import { parseBody, INVALID_BODY_ERROR } from '../utils/http.js';

export const projectsRoutes = new Hono();

// GET /api/projects
projectsRoutes.get('/', async (c) => {
  const { fundId, status, category } = c.req.query();
  let sql = 'SELECT p.*, f.name as fund_name FROM projects p JOIN funds f ON f.id = p.fund_id WHERE 1=1';
  const params = [];
  if (fundId) { sql += ' AND p.fund_id = ?'; params.push(fundId); }
  if (status) { sql += ' AND p.status = ?'; params.push(status); }
  if (category) { sql += ' AND p.category = ?'; params.push(category); }
  sql += ' ORDER BY p.created_at DESC';
  const { results } = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json({ projects: results });
});

// GET /api/projects/:id
projectsRoutes.get('/:id', async (c) => {
  const { id } = c.req.param();
  const project = await c.env.DB.prepare(
    'SELECT p.*, f.name as fund_name FROM projects p JOIN funds f ON f.id = p.fund_id WHERE p.id = ?'
  ).bind(id).first();
  if (!project) return c.json({ error: 'Projeto não encontrado' }, 404);
  return c.json({ project });
});

// POST /api/projects — create (Gestor/Admin)
projectsRoutes.post('/', authMiddleware(), requireRole('GESTOR_FUNDO', 'ADMIN'), async (c) => {
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  const id = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO projects (id, fund_id, title, description, budget, spent, status, category, beneficiaries_count, start_date, end_date) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
  ).bind(id, body.fundId, body.title, body.description||null, body.budget||0, body.spent||0, body.status||'PLANEJADO', body.category||null, body.beneficiariesCount||0, body.startDate||null, body.endDate||null).run();
  return c.json({ id, message: 'Projeto criado' }, 201);
});

// PUT /api/projects/:id — update (Gestor/Admin)
projectsRoutes.put('/:id', authMiddleware(), requireRole('GESTOR_FUNDO', 'ADMIN'), async (c) => {
  const { id } = c.req.param();
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  await c.env.DB.prepare(
    'UPDATE projects SET title=?, description=?, budget=?, spent=?, status=?, category=?, beneficiaries_count=?, start_date=?, end_date=? WHERE id=?'
  ).bind(body.title, body.description||null, body.budget||0, body.spent||0, body.status||'PLANEJADO', body.category||null, body.beneficiariesCount||0, body.startDate||null, body.endDate||null, id).run();
  return c.json({ message: 'Projeto atualizado' });
});

// DELETE /api/projects/:id — delete (Gestor/Admin)
projectsRoutes.delete("/:id", authMiddleware(), requireRole("GESTOR_FUNDO", "ADMIN"), async (c) => {
  const { id } = c.req.param();
  await c.env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
  return c.json({ message: "Projeto deletado com sucesso" });
});
