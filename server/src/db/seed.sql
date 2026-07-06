-- ============================================================================
-- DestinaIR — Seed de dados (ÚNICA fonte de verdade)
-- ============================================================================
-- IMPORTANTE: propositalmente NÃO inserimos nenhuma linha em "donations".
-- O objetivo é que qualquer usuário (inclusive os 3 abaixo) comece com o
-- Dashboard vazio, e só passe a ver dados ali depois de usar o Simulador e
-- clicar em "Salvar no meu Perfil". Isso é o que prova que nada está mockado.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- USUÁRIOS
-- Os password_hash abaixo são hashes PBKDF2 REAIS (100.000 iterações,
-- SHA-256, salt de 16 bytes), gerados com o mesmo algoritmo exato usado por
-- server/src/middleware/auth.js (formato salt_hex:hash_hex).
-- ---------------------------------------------------------------------------

-- admin@destinair.com.br / senha: admin123
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES
  ('u-admin', 'Administrador DestinaIR', 'admin@destinair.com.br',
   'a7f127906af53a8d1598c4e367703534:a10f2d0d4f83026a8025a898c81b32bdadeaa9af4f5d472d3ade5fb42c778523',
   'ADMIN');

-- joao.pereira@gmail.com / senha: joao123
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES
  ('u-joao', 'João Pereira', 'joao.pereira@gmail.com',
   '68bfbf4292e56b8bcbdcd8769beaf64a:c25bb7d155f7b418e3596b0c1228d03ace3ebf097f5d0b968c1f104f63435887',
   'CONTRIBUINTE');

-- igor.santos@gmail.com / senha: igor123
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES
  ('u-igor', 'Igor Santos', 'igor.santos@gmail.com',
   '0a7ac8d31da779e7ce27fee108db0ebc:2eb27b82209494ddfbdefa20636fdc4ef49c79437e84c9e4f62c02a934a3f451',
   'CONTRIBUINTE');

-- ---------------------------------------------------------------------------
-- FUNDOS — a partir desta versão, o catálogo de fundos vem de uma fonte
-- MUITO melhor: os Anexos I e II ("HABILITADOS FDCA 2026" e "HABILITADOS
-- FDI 2026"), publicados pela própria Receita Federal — a lista oficial de
-- todos os fundos aptos a receber destinação do IRPF em 2026. São 7.076
-- fundos reais, cobrindo as 26 UFs + DF + o nível nacional.
--
-- Esse catálogo NÃO é populado por este arquivo — está em
-- server/src/db/seed_fundos_completo.sql, gerado automaticamente pelo
-- script server/src/db/etl_fundos.py a partir dos CSVs oficiais. Rode os
-- dois arquivos nesta ordem: primeiro este seed.sql (usuários, FAQs,
-- estatísticas), depois seed_fundos_completo.sql (fundos).
--
-- Igual antes: campos que não temos como verificar (contato, site,
-- estimativa de beneficiados) ficam em branco para a esmagadora maioria dos
-- fundos — só preenchemos manualmente para os poucos que pesquisamos
-- individualmente (Cornélio Procópio, Londrina, Curitiba e o FIA/PR),
-- preservados durante a geração do arquivo completo.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- PROJETOS — propositalmente vazio.
-- Nem todos os fundos reais publicam projeto a projeto com orçamento/gasto
-- detalhado, então preferimos não fingir esse nível de detalhe. A tabela e
-- a API (/api/projects) continuam existindo e funcionando (CRUD completo
-- para ADMIN/GESTOR_FUNDO) caso queiram cadastrar algum projeto real no
-- futuro — só não populamos nenhum de exemplo.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- ESTATÍSTICAS NACIONAIS/ESTADUAIS — números reais e verificáveis sobre o
-- mecanismo de destinação do IR como um todo (não uma alegação sobre os 6
-- fundos acima). Usamos UMA fonte só para o valor total + split FDCA/FDI e
-- o ranking por estado (2025), para não misturar metodologias de relatórios
-- diferentes nesses números específicos. A exceção é "total_destinations"
-- (número de destinações realizadas por contribuintes, não de pessoas
-- beneficiadas — não achamos fonte confiável pra essa segunda métrica a
-- nível nacional): vem de uma fonte diferente (Mundo Corporativo/UAI), mas
-- é uma métrica complementar e claramente distinta, não um total concorrente
-- com o valor principal — por isso citamos a fonte dela separadamente no
-- próprio texto da nota. Atualizar manualmente uma vez por ano, quando a
-- Receita Federal/imprensa publicam os dados do ano anterior.
-- ---------------------------------------------------------------------------
INSERT OR REPLACE INTO national_stats (id, reference_year, scope, state, total_amount, total_destinations, fdca_total, fdi_total, fdca_pct, fdi_pct, pct_contribuintes, note, source_label, source_url) VALUES
  ('ns-2025-nacional', 2025, 'NACIONAL', NULL, 394500000, 321323, NULL, NULL, 58, 42, NULL,
   'Na última campanha do Imposto de Renda, a destinação aos Fundos dos Direitos da Criança e do Adolescente (FDCA) e aos Fundos dos Direitos da Pessoa Idosa (FDI) arrecadou um total de R$ 394,5 milhões (fonte: MDH). Desse montante, 58% foram direcionados para o FDCA e 42% para o FDI. Um levantamento à parte, feito pelo Mundo Corporativo/UAI com dados da Receita Federal, contou 321.323 destinações de pessoas físicas em 2025 — um número sobre quem destinou, não sobre quantas pessoas foram atendidas pelos fundos (não encontramos uma fonte pública confiável para essa segunda métrica).',
   'Ministério dos Direitos Humanos e da Cidadania (MDH)',
   'https://www.gov.br/mdh/pt-br/assuntos/noticias/2026/abril/destinacao-do-imposto-de-renda-pode-fortalecer-politicas-para-criancas-adolescentes-e-pessoas-idosas'),

  ('ns-2025-sp', 2025, 'ESTADUAL', 'SP', 99600000, NULL, NULL, NULL, NULL, NULL, NULL,
   'São Paulo foi o estado que mais destinou em 2025, somando FDCA e FDI.',
   'Mundo Corporativo (UAI), com dados da Receita Federal',
   'https://www.uai.com.br/app/noticia/mundo-corporativo/2025/07/11/noticia-mundo-corporativo,365183/doacoes-via-irpf-chegam-a-r-8239-414-milhoes-em-2025.shtml'),

  ('ns-2025-mg', 2025, 'ESTADUAL', 'MG', 56700000, NULL, NULL, NULL, NULL, NULL, NULL,
   'Minas Gerais ficou em 2º lugar no ranking nacional de destinação em 2025.',
   'Mundo Corporativo (UAI), com dados da Receita Federal',
   'https://www.uai.com.br/app/noticia/mundo-corporativo/2025/07/11/noticia-mundo-corporativo,365183/doacoes-via-irpf-chegam-a-r-8239-414-milhoes-em-2025.shtml'),

  ('ns-2025-rs', 2025, 'ESTADUAL', 'RS', 52200000, NULL, NULL, NULL, NULL, NULL, NULL,
   'Rio Grande do Sul ficou em 3º lugar no ranking nacional de destinação em 2025.',
   'Mundo Corporativo (UAI), com dados da Receita Federal',
   'https://www.uai.com.br/app/noticia/mundo-corporativo/2025/07/11/noticia-mundo-corporativo,365183/doacoes-via-irpf-chegam-a-r-8239-414-milhoes-em-2025.shtml'),

  ('ns-2025-pr', 2025, 'ESTADUAL', 'PR', 47200000, NULL, NULL, NULL, NULL, NULL, NULL,
   'O Paraná, nosso estado, ficou em 4º lugar no ranking nacional de destinação em 2025. Somado a isso, o FIA/PR (fundo estadual) repassou R$ 159 milhões aos 399 municípios paranaenses em 2025, com adesão de 100% dos municípios.',
   'Mundo Corporativo (UAI), com dados da Receita Federal',
   'https://www.uai.com.br/app/noticia/mundo-corporativo/2025/07/11/noticia-mundo-corporativo,365183/doacoes-via-irpf-chegam-a-r-8239-414-milhoes-em-2025.shtml'),

  ('ns-2025-sc', 2025, 'ESTADUAL', 'SC', 26200000, NULL, NULL, NULL, NULL, NULL, NULL,
   'Santa Catarina fechou o top 5 do ranking nacional de destinação em 2025.',
   'Mundo Corporativo (UAI), com dados da Receita Federal',
   'https://www.uai.com.br/app/noticia/mundo-corporativo/2025/07/11/noticia-mundo-corporativo,365183/doacoes-via-irpf-chegam-a-r-8239-414-milhoes-em-2025.shtml');

-- ---------------------------------------------------------------------------
-- FAQs
-- ---------------------------------------------------------------------------
INSERT OR REPLACE INTO faqs (id, question, answer, category, order_index) VALUES
  ('faq1', 'O que é a destinação do Imposto de Renda?', 'É um mecanismo legal que permite ao contribuinte direcionar até 6% do imposto devido para fundos sociais de proteção à criança/adolescente (FDCA) e pessoa idosa (FDI), sem custo adicional.', 'Geral', 1),
  ('faq2', 'Eu pago algo a mais ao destinar?', 'Não. O valor destinado é abatido do imposto que você já pagaria (ou somado à sua restituição), via DARF específico gerado após a entrega da declaração.', 'Geral', 2),
  ('faq3', 'Quem pode fazer a destinação?', 'Qualquer contribuinte que declare pelo modelo completo (deduções legais). Não é possível destinar pelo modelo simplificado.', 'Geral', 3),
  ('faq4', 'Qual o limite de destinação em 2026?', 'Até 3% do imposto devido para fundos do tipo FDCA e mais 3% para fundos do tipo FDI, totalizando no máximo 6% do imposto devido apurado na declaração.', 'Como Fazer', 4),
  ('faq5', 'O que é o DARF da destinação?', 'É o Documento de Arrecadação de Receitas Federais emitido para cada fundo escolhido (código 3351 para FDCA e 9090 para FDI), que deve ser pago até o fim do prazo de entrega da declaração.', 'Como Fazer', 5),
  ('faq6', 'Posso escolher para qual fundo destinar?', 'Sim. Você pode escolher fundos no nível nacional, estadual ou municipal, e acompanhar cada um deles na aba Fundos.', 'Fundos', 6),
  ('faq7', 'Como sei se o fundo é confiável?', 'Todos os fundos cadastrados na plataforma são regulamentados por lei e geridos por Conselhos de Direitos. Sempre que possível, indicamos o CNPJ oficial de cada um para você conferir diretamente na Receita Federal.', 'Fundos', 7),
  ('faq8', 'O status "Paga" das minhas simulações significa que a Receita Federal confirmou o pagamento?', 'Não. O status é um controle pessoal seu, que você mesmo marca na plataforma — não é uma confirmação oficial de que o DARF foi pago. Guarde o comprovante bancário do pagamento em um local seguro (você pode anexar um link de referência em Minhas Doações).', 'Segurança', 8),
  ('faq9', 'Por que a Transparência não mostra minhas próprias destinações?', 'A página Transparência mostra só dados nacionais reais e verificáveis, com fonte sempre citada — não dados de usuários da plataforma (que não temos como confirmar oficialmente). Suas simulações e destinações pessoais ficam no seu Dashboard, como controle privado seu.', 'Segurança', 9);
