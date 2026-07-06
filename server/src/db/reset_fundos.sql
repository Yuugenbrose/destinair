-- ============================================================================
-- RESET DO CATÁLOGO DE FUNDOS — rode isso UMA VEZ, depois do migration_v2.sql
-- e ANTES de rodar o seed.sql novamente.
-- ============================================================================
-- Motivo: os 6 fundos novos (reais, verificados) usam um esquema de id
-- totalmente diferente do antigo (ex: "f-cp-fdca" em vez de "f1"). Isso é
-- proposital — de uma vez por todas, elimina a possibilidade de qualquer id
-- novo colidir com lixo de seeds antigos (o mesmo tipo de bug que já
-- resolvemos antes com o OR REPLACE, mas agora resolvido na raiz).
--
-- Como o esquema de id muda por completo, o OR REPLACE não serve aqui —
-- ele só substitui uma linha se o id bater exatamente. Por isso apagamos a
-- tabela de fundos (e o que depende dela: projetos e relatórios) por
-- inteiro, e o seed.sql, rodado logo em seguida, recria os 6 fundos novos.
--
-- Doações (donations) NÃO são apagadas aqui — mas se você já tiver algum
-- registro de doação real referenciando um fundo antigo (f1, f2 etc.), ele
-- ficará "órfão" depois desse reset (apontando para um fundo que não existe
-- mais). Se for esse o caso, apague essa doação antes, ou me avise que eu
-- ajudo a migrar ela para o fundo novo equivalente.
-- ============================================================================

DELETE FROM projects;
DELETE FROM reports;
DELETE FROM funds;
