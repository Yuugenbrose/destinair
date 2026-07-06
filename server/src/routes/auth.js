import { Hono } from 'hono';
import { signJWT, hashPassword, verifyPassword, authMiddleware } from '../middleware/auth.js';
import { parseBody, INVALID_BODY_ERROR } from '../utils/http.js';

export const authRoutes = new Hono();

// POST /api/auth/register
authRoutes.post('/register', async (c) => {
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  const { name, email, password } = body;
  if (!name || !email || !password) return c.json({ error: 'Nome, email e senha são obrigatórios' }, 400);
  if (password.length < 6) return c.json({ error: 'Senha deve ter pelo menos 6 caracteres' }, 400);

  const db = c.env.DB;
  const existing = await db.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return c.json({ error: 'E-mail já cadastrado' }, 409);

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  await db.prepare('INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)')
    .bind(id, name, email, passwordHash).run();

  const token = await signJWT({ id, email, name, role: 'CONTRIBUINTE' }, c.env.JWT_SECRET);
  return c.json({ token, user: { id, name, email, role: 'CONTRIBUINTE' } }, 201);
});

// POST /api/auth/login
authRoutes.post('/login', async (c) => {
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  const { email, password } = body;
  if (!email || !password) return c.json({ error: 'Email e senha são obrigatórios' }, 400);

  const db = c.env.DB;
  const user = await db.prepare('SELECT * FROM users WHERE email = ?').bind(email).first();
  if (!user) return c.json({ error: 'Credenciais inválidas' }, 401);

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) return c.json({ error: 'Credenciais inválidas' }, 401);

  const token = await signJWT({ id: user.id, email: user.email, name: user.name, role: user.role }, c.env.JWT_SECRET);
  return c.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

// GET /api/auth/me
authRoutes.get('/me', authMiddleware(), async (c) => {
  const payload = c.get('user');
  const db = c.env.DB;
  const user = await db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').bind(payload.id).first();
  if (!user) return c.json({ error: 'Usuário não encontrado' }, 404);
  return c.json({ user });
});
