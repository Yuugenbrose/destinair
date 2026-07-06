-- ============================================================================
-- MIGRAÇÃO v5 — rode isso UMA VEZ no banco de produção já existente.
-- ============================================================================
-- national_stats.total_destinations — número de destinações/doações
-- realizadas por contribuintes num ano de referência (ex: "321.323
-- destinações em 2025"). É uma métrica sobre quem DOOU, não sobre quantas
-- pessoas foram beneficiadas pelos fundos — não usamos essa segunda métrica
-- porque não encontramos nenhuma fonte pública confiável que a divulgue a
-- nível nacional, e preferimos não estimar um número sem fonte.
-- ============================================================================

ALTER TABLE national_stats ADD COLUMN total_destinations INTEGER;
