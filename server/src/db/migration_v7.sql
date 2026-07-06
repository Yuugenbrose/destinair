-- ============================================================================
-- MIGRAÇÃO v7 — rode isso UMA VEZ no banco de produção já existente.
-- ============================================================================
-- Remove os campos que não vêm dos Anexos I/II da Receita Federal (bank_info,
-- contact_email, contact_phone, website, beneficiaries_estimate, description)
-- — eram enriquecimento manual de um punhado de fundos, o que não escala e
-- não sobrevive a uma atualização anual da base. A partir de agora, o
-- catálogo de fundos reflete SOMENTE o que a planilha oficial traz: tipo,
-- abrangência, UF, cidade, CNPJ e código IBGE — mais o nome padronizado que
-- geramos.
--
-- Adiciona funds.data_year — o ano de referência da base de habilitados
-- (ex: 2026). É esse campo que permite ao Admin trocar a base de um ano
-- para o outro de forma limpa (apaga o ano antigo, importa o novo) pela
-- tela de Importação.
-- ============================================================================

ALTER TABLE funds DROP COLUMN bank_info;
ALTER TABLE funds DROP COLUMN contact_email;
ALTER TABLE funds DROP COLUMN contact_phone;
ALTER TABLE funds DROP COLUMN website;
ALTER TABLE funds DROP COLUMN beneficiaries_estimate;
ALTER TABLE funds DROP COLUMN description;
ALTER TABLE funds ADD COLUMN data_year INTEGER;

-- Marca os fundos já existentes (do import anterior) como sendo da base 2026
UPDATE funds SET data_year = 2026 WHERE data_year IS NULL;
