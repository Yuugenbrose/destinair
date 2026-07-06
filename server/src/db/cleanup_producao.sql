-- ============================================================================
-- LIMPEZA ÚNICA DO BANCO DE PRODUÇÃO — rode isso UMA VEZ, manualmente.
-- ============================================================================
-- NÃO faz parte do seed.sql normal de propósito: isso apaga TODAS as doações
-- e TODOS os usuários (exceto o admin) que existirem no banco no momento em
-- que você rodar. Se você já tiver feito uma simulação real e salvo no seu
-- próprio usuário antes de rodar isso, ela também será apagada — rode este
-- script ANTES de gravar o vídeo/fazer a apresentação, não depois.
--
-- IMPORTANTE: depois de rodar ESTE arquivo, rode o seed.sql MAIS UMA VEZ
-- (na sequência, sem pular esse passo). Explicação: o seed original de
-- 18/06 tinha 8 fundos, 8 projetos e 9 FAQs com os MESMOS ids que os meus
-- (f1-f8, p1-p8, faq1-faq9). Meu seed.sql usa OR REPLACE, que substitui uma
-- linha existente pelo id — mas eu só tenho 6 projetos e 7 FAQs no total,
-- então os ids extras do seed antigo (p7, p8, faq8, faq9) nunca são
-- "substituídos", só ficam órfãos misturados com os meus. Por isso este
-- script apaga projects e faqs por inteiro, e o seed.sql rodado logo depois
-- os repovoa do zero, sem nenhuma sobra do seed de 18/06.
--
-- O que este script faz:
-- 1) Apaga TODAS as doações/simulações (inclusive as 3 fictícias de 18/06
--    que estavam poluindo o gráfico de "Evolução da arrecadação").
-- 2) Apaga as prestações de contas antigas (tabela "reports"), que eram
--    resíduo do seed de 18/06 e não têm nenhuma tela de admin gerenciando
--    elas hoje.
-- 3) Apaga projetos e FAQs por inteiro (serão repovoados pelo seed.sql
--    logo em seguida, sem os órfãos do seed antigo).
-- 4) Apaga TODOS os usuários, EXCETO o admin — incluindo as contas de teste
--    soltas (teste@gmail.com, teste0@gmail.com, teste30jun@gmail.com,
--    teste@teste.com, Joao@gmail.com, demo@destinair.com.br) e as antigas
--    demo1/demo2.
-- 5) Cria dois usuários novos, com nomes e e-mails fictícios "normais"
--    (não parecem dado de teste): João Pereira e Igor Santos.
--
-- Fundos (12) NÃO são apagados aqui: como meu seed.sql tem f1 até f12 (um
-- superconjunto do f1-f8 antigo), o OR REPLACE já cobre 100% dos ids
-- antigos sozinho, sem deixar órfão nenhum.
-- ============================================================================

DELETE FROM donations;
DELETE FROM reports;
DELETE FROM projects;
DELETE FROM faqs;
DELETE FROM users WHERE email != 'admin@destinair.com.br';

-- joao.pereira@gmail.com / senha: joao123
INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('u-joao', 'João Pereira', 'joao.pereira@gmail.com',
   '68bfbf4292e56b8bcbdcd8769beaf64a:c25bb7d155f7b418e3596b0c1228d03ace3ebf097f5d0b968c1f104f63435887',
   'CONTRIBUINTE');

-- igor.santos@gmail.com / senha: igor123
INSERT INTO users (id, name, email, password_hash, role) VALUES
  ('u-igor', 'Igor Santos', 'igor.santos@gmail.com',
   '0a7ac8d31da779e7ce27fee108db0ebc:2eb27b82209494ddfbdefa20636fdc4ef49c79437e84c9e4f62c02a934a3f451',
   'CONTRIBUINTE');
