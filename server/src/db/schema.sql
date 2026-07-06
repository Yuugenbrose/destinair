-- DestinaIR — Database Schema (D1 / SQLite)

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  cpf TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'CONTRIBUINTE' CHECK(role IN ('CONTRIBUINTE','GESTOR_FUNDO','ADMIN')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS funds (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('FDCA','FDI')),
  level TEXT NOT NULL CHECK(level IN ('NACIONAL','ESTADUAL','MUNICIPAL')),
  state TEXT,
  city TEXT,
  cnpj TEXT UNIQUE,
  ibge_code TEXT,
  data_year INTEGER,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  fund_id TEXT NOT NULL REFERENCES funds(id),
  amount REAL NOT NULL,
  tax_year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'SIMULADA' CHECK(status IN ('SIMULADA','CONFIRMADA','PAGA')),
  darf_code TEXT,
  receipt_link TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  fund_id TEXT NOT NULL REFERENCES funds(id),
  title TEXT NOT NULL,
  description TEXT,
  budget REAL NOT NULL DEFAULT 0,
  spent REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'PLANEJADO' CHECK(status IN ('PLANEJADO','EM_ANDAMENTO','CONCLUIDO')),
  category TEXT,
  beneficiaries_count INTEGER DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  fund_id TEXT NOT NULL REFERENCES funds(id),
  title TEXT NOT NULL,
  content TEXT,
  document_url TEXT,
  reference_year INTEGER NOT NULL,
  published_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  is_approved INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Estatísticas nacionais/estaduais reais de destinação do IR, curadas manualmente
-- pelo admin (ex: uma vez por ano, quando a Receita Federal/MDH publica os números
-- do ano anterior). NÃO é uma alegação sobre o que os fundos específicos da nossa
-- plataforma arrecadaram — é contexto real sobre o mecanismo de destinação como um
-- todo, sempre com a fonte citada.
CREATE TABLE IF NOT EXISTS national_stats (
  id TEXT PRIMARY KEY,
  reference_year INTEGER NOT NULL,
  scope TEXT NOT NULL DEFAULT 'NACIONAL' CHECK(scope IN ('NACIONAL','ESTADUAL')),
  state TEXT,
  total_amount REAL,
  total_destinations INTEGER,
  fdca_total REAL,
  fdi_total REAL,
  fdca_pct REAL,
  fdi_pct REAL,
  pct_contribuintes REAL,
  note TEXT,
  source_label TEXT,
  source_url TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_donations_user ON donations(user_id);
CREATE INDEX IF NOT EXISTS idx_donations_fund ON donations(fund_id);
CREATE INDEX IF NOT EXISTS idx_projects_fund ON projects(fund_id);
CREATE INDEX IF NOT EXISTS idx_reports_fund ON reports(fund_id);
CREATE INDEX IF NOT EXISTS idx_funds_type ON funds(type);
CREATE INDEX IF NOT EXISTS idx_funds_level ON funds(level);
CREATE INDEX IF NOT EXISTS idx_funds_state ON funds(state);
