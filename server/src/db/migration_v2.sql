-- ============================================================================
-- MIGRAÇÃO v2 — rode isso UMA VEZ no banco de produção já existente.
-- ============================================================================
-- Adiciona 3 coisas novas ao schema, sem apagar nada:
-- 1) funds.beneficiaries_estimate — número estimado de pessoas beneficiadas,
--    editável pelo admin direto no formulário de fundos (substitui a soma
--    de projects.beneficiaries_count, que só funcionava para fundos com
--    projeto cadastrado).
-- 2) donations.receipt_link — link (Google Drive, e-mail etc.) onde o
--    usuário guarda o comprovante de pagamento do DARF, se ele realmente
--    pagou. É só um link de referência pessoal, não um upload de arquivo.
-- 3) national_stats — tabela nova para o admin publicar estatísticas reais
--    e verificáveis (com fonte) sobre destinação do IR em nível nacional/
--    estadual, atualizada manualmente uma vez por ano.
-- ============================================================================

ALTER TABLE funds ADD COLUMN beneficiaries_estimate INTEGER;
ALTER TABLE donations ADD COLUMN receipt_link TEXT;

CREATE TABLE IF NOT EXISTS national_stats (
  id TEXT PRIMARY KEY,
  reference_year INTEGER NOT NULL,
  scope TEXT NOT NULL DEFAULT 'NACIONAL' CHECK(scope IN ('NACIONAL','ESTADUAL')),
  state TEXT,
  fdca_total REAL,
  fdi_total REAL,
  pct_contribuintes REAL,
  note TEXT,
  source_label TEXT,
  source_url TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
