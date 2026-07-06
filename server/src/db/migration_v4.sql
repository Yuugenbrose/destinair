-- ============================================================================
-- MIGRAÇÃO v4 — rode isso UMA VEZ no banco de produção já existente.
-- ============================================================================
-- 1) funds.website — link para o site oficial do fundo/prefeitura/secretaria,
--    quando encontrado (nem todo fundo tem uma página dedicada).
-- 2) national_stats.fdca_pct / fdi_pct — permite cadastrar o split FDCA/FDI
--    como PORCENTAGEM (do jeito que a fonte normalmente divulga, ex: "58%
--    FDCA / 42% FDI"), em vez de exigir que o Admin calcule o valor exato em
--    reais na mão. Quando presentes, a Transparência calcula o valor exato
--    (total_amount × percentual) na hora de exibir — não precisa mais
--    pré-calcular e guardar dois números que podem ficar inconsistentes
--    entre si se o total mudar.
-- ============================================================================

ALTER TABLE funds ADD COLUMN website TEXT;
ALTER TABLE national_stats ADD COLUMN fdca_pct REAL;
ALTER TABLE national_stats ADD COLUMN fdi_pct REAL;
