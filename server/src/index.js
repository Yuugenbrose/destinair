import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth.js';
import { fundsRoutes } from './routes/funds.js';
import { donationsRoutes } from './routes/donations.js';
import { projectsRoutes } from './routes/projects.js';
import { simulatorRoutes } from './routes/simulator.js';
import { transparencyRoutes } from './routes/transparency.js';
import { faqsRoutes } from './routes/faqs.js';

const app = new Hono();

// CORS
app.use('/api/*', cors({
  origin: (origin, c) => origin || '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}));

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', service: 'DestinaIR API', timestamp: new Date().toISOString() }));

// Routes
app.route('/api/auth', authRoutes);
app.route('/api/funds', fundsRoutes);
app.route('/api/donations', donationsRoutes);
app.route('/api/projects', projectsRoutes);
app.route('/api/simulator', simulatorRoutes);
app.route('/api/transparency', transparencyRoutes);
app.route('/api/faqs', faqsRoutes);

// 404
app.notFound((c) => c.json({ error: 'Rota não encontrada' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Erro interno do servidor' }, 500);
});

export default app;
