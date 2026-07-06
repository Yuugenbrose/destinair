-- ============================================================================
-- MIGRAÇÃO v6 — rode isso UMA VEZ no banco de produção já existente.
-- ============================================================================
-- funds.ibge_code — código IBGE do município (quando o fundo for municipal),
-- vindo direto dos Anexos I/II (Habilitados FDCA/FDI 2026) da Receita Federal.
-- Guardamos por ser um identificador oficial útil (ex: para cruzar com outras
-- bases públicas no futuro), mesmo não sendo usado diretamente na interface
-- por enquanto.
-- ============================================================================

ALTER TABLE funds ADD COLUMN ibge_code TEXT;
