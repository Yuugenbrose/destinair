# DestinaIR 🇧🇷💚

**Plataforma de Destinação Social do IRPF**

Oriente contribuintes sobre como realizar doações via IRPF para fundos sociais (FDCA e FDI), com transparência sobre o destino e impacto dos recursos.

## 🚀 Stack Tecnológica

| Camada | Tecnologia |
|---|---|
| Frontend | React 18 + Vite |
| Estilização | CSS Vanilla (Design System customizado) |
| Roteamento | React Router v6 |
| Gráficos | Recharts |
| Ícones | Lucide React |
| Backend | Hono (Cloudflare Workers) |
| Banco de Dados | Cloudflare D1 (SQLite) |
| Autenticação | JWT + PBKDF2 (Web Crypto API) |
| Deploy | Cloudflare Pages + Workers |

## 📁 Estrutura

```
├── client/          # Frontend React + Vite
│   ├── src/
│   │   ├── components/  # Header, Footer
│   │   ├── context/     # AuthContext
│   │   ├── pages/       # Todas as páginas
│   │   ├── services/    # API client
│   │   └── index.css    # Design System
│   └── package.json
│
├── server/          # Backend Hono + D1
│   ├── src/
│   │   ├── db/          # Schema + Seed SQL
│   │   ├── middleware/  # JWT Auth
│   │   ├── routes/      # Endpoints da API
│   │   └── index.js     # Entry point
│   ├── wrangler.toml
│   └── package.json
```

## 🛠️ Como Rodar Localmente

### Pré-requisitos
- Node.js 18+
- npm

### 1. Instalar dependências

```bash
# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Configurar banco de dados local

```bash
cd server
npm run db:migrate    # Cria as tabelas
npm run db:seed       # Insere dados iniciais
```

### 3. Rodar em desenvolvimento

```bash
# Terminal 1 — Backend (porta 8787)
cd server
npm run dev

# Terminal 2 — Frontend (porta 5173)
cd client
npm run dev
```

Acesse: **http://localhost:5173**

## 🌐 Deploy no Cloudflare

### Frontend (Cloudflare Pages)
```bash
cd client
npm run build
npx wrangler pages deploy dist --project-name=destinair
```

### Backend (Cloudflare Workers + D1)
```bash
cd server

# Criar banco D1 (só na primeira vez)
npx wrangler d1 create destinair-db
# Copie o database_id para wrangler.toml

# Migrar e popular banco remoto
npm run db:migrate:remote
npm run db:seed:remote

# Deploy
npm run deploy
```

## 👥 Equipe

| Integrante | Responsabilidade |
|---|---|
| 1 | Frontend: Landing, Como Funciona, Sobre, FAQ |
| 2 | Frontend: Simulador, Diretório de Fundos |
| 3 | Frontend: Dashboard de Transparência, Gráficos |
| 4 | Backend: Autenticação, CRUD Fundos, FAQ |
| 5 | Backend: Doações, Projetos, Simulador API, Transparência |
| 6 | Frontend: Auth Pages, Dashboard Usuário, Admin |

## 📝 Licença

Projeto acadêmico — UTFPR Campus Cornélio Procópio, 2026.
