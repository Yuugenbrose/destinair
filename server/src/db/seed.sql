-- DestinaIR — Seed Data

-- Admin user (password: admin123)
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES
  ('u-admin', 'Administrador', 'admin@destinair.com.br', '$PBKDF2$100000$adminsalt$hashed', 'ADMIN');

-- Demo user (password: demo123)
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES
  ('u-demo', 'Contribuinte Demo', 'demo@destinair.com.br', '$PBKDF2$100000$demosalt$hashed', 'CONTRIBUINTE');

-- Funds
INSERT OR IGNORE INTO funds (id, name, type, level, state, city, cnpj, bank_info, description, contact_email, contact_phone) VALUES
  ('f1', 'Fundo Municipal dos Direitos da Criança e do Adolescente de Cornélio Procópio', 'FDCA', 'MUNICIPAL', 'PR', 'Cornélio Procópio', '00.000.001/0001-01', 'BB Ag.0001 CC 12345-6', 'Fundo gerido pelo CMDCA para proteção integral de crianças e adolescentes do município.', 'cmdca@cornelioprocopio.pr.gov.br', '(43) 3520-0000'),
  ('f2', 'Fundo Municipal da Pessoa Idosa de Cornélio Procópio', 'FDI', 'MUNICIPAL', 'PR', 'Cornélio Procópio', '00.000.002/0001-01', 'BB Ag.0001 CC 12346-7', 'Fundo para programas de amparo e qualidade de vida da pessoa idosa.', 'cmdi@cornelioprocopio.pr.gov.br', '(43) 3520-0001'),
  ('f3', 'Fundo Estadual dos Direitos da Criança e do Adolescente do Paraná', 'FDCA', 'ESTADUAL', 'PR', NULL, '00.000.003/0001-01', 'CEF Ag.0010 CC 98765-4', 'Fundo estadual para projetos de grande escala em todo o Paraná.', 'fdca@pr.gov.br', '(41) 3200-0000'),
  ('f4', 'Fundo Nacional dos Direitos da Criança e do Adolescente', 'FDCA', 'NACIONAL', NULL, NULL, '00.000.004/0001-01', 'BB Ag.1111 CC 00001-0', 'Fundo gerido pelo CONANDA para projetos nacionais de proteção à infância.', 'conanda@gov.br', '(61) 3200-0000'),
  ('f5', 'Fundo Municipal dos Direitos da Criança e do Adolescente de Londrina', 'FDCA', 'MUNICIPAL', 'PR', 'Londrina', '00.000.005/0001-01', 'BB Ag.0050 CC 54321-0', 'Investimentos em projetos sociais para crianças e adolescentes em Londrina.', 'cmdca@londrina.pr.gov.br', '(43) 3300-0000'),
  ('f6', 'Fundo Municipal da Pessoa Idosa de Curitiba', 'FDI', 'MUNICIPAL', 'PR', 'Curitiba', '00.000.006/0001-01', 'CEF Ag.0100 CC 11111-0', 'Fundo curitibano para proteção e amparo à pessoa idosa.', 'cmdi@curitiba.pr.gov.br', '(41) 3100-0000'),
  ('f7', 'Fundo Nacional da Pessoa Idosa', 'FDI', 'NACIONAL', NULL, NULL, '00.000.007/0001-01', 'BB Ag.1111 CC 00002-0', 'Fundo nacional para políticas públicas de proteção ao idoso.', 'fni@gov.br', '(61) 3200-0001'),
  ('f8', 'Fundo Municipal dos Direitos da Criança e do Adolescente de Maringá', 'FDCA', 'MUNICIPAL', 'PR', 'Maringá', '00.000.008/0001-01', 'BB Ag.0070 CC 77777-0', 'Projetos de educação e proteção à infância em Maringá.', 'cmdca@maringa.pr.gov.br', '(44) 3200-0000');

-- Projects
INSERT OR IGNORE INTO projects (id, fund_id, title, description, budget, spent, status, category, beneficiaries_count, start_date, end_date) VALUES
  ('p1', 'f1', 'Escola de Esportes Comunitária', 'Programa de esportes para crianças em situação de vulnerabilidade social.', 45000, 32000, 'EM_ANDAMENTO', 'Esporte', 150, '2024-03-01', '2024-12-31'),
  ('p2', 'f1', 'Reforço Escolar para Adolescentes', 'Aulas de reforço em matemática e português para adolescentes.', 30000, 18000, 'EM_ANDAMENTO', 'Educação', 80, '2024-02-15', '2024-11-30'),
  ('p3', 'f1', 'Campanha de Vacinação Infantil', 'Campanha municipal de vacinação para crianças de 0-5 anos.', 25000, 25000, 'CONCLUIDO', 'Saúde', 500, '2024-01-10', '2024-03-31'),
  ('p4', 'f1', 'Oficinas Culturais nas Comunidades', 'Oficinas de música, teatro e artes visuais em bairros periféricos.', 20000, 0, 'PLANEJADO', 'Cultura', 100, '2025-01-01', '2025-06-30'),
  ('p5', 'f2', 'Centro de Convivência do Idoso', 'Atividades de socialização e saúde para idosos.', 35000, 28000, 'EM_ANDAMENTO', 'Assistência Social', 120, '2024-01-01', '2024-12-31'),
  ('p6', 'f2', 'Programa Saúde na Terceira Idade', 'Acompanhamento médico preventivo para idosos.', 40000, 35000, 'EM_ANDAMENTO', 'Saúde', 200, '2024-02-01', '2024-12-31'),
  ('p7', 'f5', 'Londrina Educa +', 'Programa de educação complementar em escolas municipais.', 80000, 45000, 'EM_ANDAMENTO', 'Educação', 350, '2024-03-01', '2024-12-31'),
  ('p8', 'f6', 'Curitiba Idoso Ativo', 'Programa de atividades físicas e culturais para idosos.', 60000, 50000, 'EM_ANDAMENTO', 'Esporte', 400, '2024-01-15', '2024-12-31');

-- Reports
INSERT OR IGNORE INTO reports (id, fund_id, title, content, reference_year) VALUES
  ('r1', 'f1', 'Prestação de Contas 2024', 'Relatório completo da execução orçamentária do FDCA-CP em 2024.', 2024),
  ('r2', 'f1', 'Prestação de Contas 2023', 'Relatório da execução orçamentária do FDCA-CP em 2023.', 2023),
  ('r3', 'f2', 'Prestação de Contas 2024', 'Relatório do Fundo da Pessoa Idosa de CP em 2024.', 2024);

-- Donations
INSERT OR IGNORE INTO donations (id, user_id, fund_id, amount, tax_year, status) VALUES
  ('d1', 'u-demo', 'f1', 320.00, 2024, 'PAGA'),
  ('d2', 'u-demo', 'f2', 280.00, 2024, 'CONFIRMADA'),
  ('d3', 'u-demo', 'f5', 450.00, 2023, 'PAGA');

-- FAQs
INSERT OR IGNORE INTO faqs (id, question, answer, category, order_index) VALUES
  ('faq1', 'O que é a destinação do Imposto de Renda?', 'É um mecanismo legal que permite ao contribuinte direcionar até 6% do imposto devido para fundos sociais de proteção à criança/adolescente (FDCA) e pessoa idosa (FDI), sem custo adicional.', 'Geral', 1),
  ('faq2', 'Eu pago algo a mais ao destinar?', 'Não! O valor destinado é abatido do imposto que você já pagaria ou somado à sua restituição.', 'Geral', 2),
  ('faq3', 'Quem pode fazer a destinação?', 'Qualquer contribuinte que declare pelo modelo completo (deduções legais).', 'Geral', 3),
  ('faq4', 'Posso destinar pelo modelo simplificado?', 'Não. A destinação só é possível pelo modelo de declaração por deduções legais (completa).', 'Como Fazer', 4),
  ('faq5', 'Qual o limite de destinação?', 'Até 3% do imposto devido para o FDCA e mais 3% para o FDI, totalizando 6%.', 'Como Fazer', 5),
  ('faq6', 'O que é o DARF?', 'É o Documento de Arrecadação de Receitas Federais — um boleto gerado pelo programa do IRPF.', 'Como Fazer', 6),
  ('faq7', 'Posso escolher para qual fundo destinar?', 'Sim. Você pode escolher fundos no nível nacional, estadual ou municipal.', 'Fundos', 7),
  ('faq8', 'Para onde vai o dinheiro?', 'Os recursos são geridos por Conselhos de Direitos que aprovam e fiscalizam projetos sociais.', 'Fundos', 8),
  ('faq9', 'Como sei se o fundo é confiável?', 'Todos os fundos são regulamentados por lei. Na nossa plataforma você consulta prestações de contas.', 'Fundos', 9);
