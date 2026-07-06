-- ============================================================================
-- MIGRAÇÃO v3 — rode isso UMA VEZ no banco de produção já existente.
-- ============================================================================
-- Adiciona national_stats.total_amount: usado quando só temos o valor total
-- combinado (FDCA + FDI juntos) para um recorte, sem o split entre os dois
-- tipos de fundo — como é o caso do ranking por estado (a fonte usada não
-- discrimina FDCA/FDI por estado, só o total). Sem esse campo, teríamos que
-- guardar esse total em fdca_total, o que passaria a impressão errada de
-- que é só a parte FDCA daquele estado.
-- ============================================================================

ALTER TABLE national_stats ADD COLUMN total_amount REAL;
