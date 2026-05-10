# 📰 TV Live UK — Hindi News Portal

A modern, production-ready Hindi news portal built with React, Express, and PostgreSQL.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v4 + shadcn/ui |
| Backend | Express 5 (Node.js) |
| Database | PostgreSQL + Drizzle ORM |
| Package Manager | pnpm workspaces (monorepo) |
| Fonts | Noto Sans Devanagari, Inter |
| State | Zustand |
| Routing | Wouter |

## 📦 Project Structure

```
Content-Hub/                  # Monorepo root
├── artifacts/
│   ├── api-server/          # Express 5 backend API
│   └── news-portal/         # React + Vite frontend
├── lib/
│   ├── db/                  # Drizzle ORM + PostgreSQL schema
│   ├── api-spec/            # OpenAPI spec
│   ├── api-zod/             # Zod validation schemas
│   └── api-client-react/    # React Query API hooks
├── api/
│   └── index.ts             # Vercel serverless function entry
├── vercel.json              # Vercel deployment config
└── .env.example             # Environment variables template
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 20+
- pnpm (`npm install -g pnpm`)
- PostgreSQL (or Neon free tier account)

### 1. Clone & Install
```bash
git clone https://github.com/asifkhansilawat/tvlive-news-portal.git
cd tvlive-news-portal
pnpm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add your DATABASE_URL from Neon
```

### 3. Setup Database
```bash
# Push schema to your PostgreSQL database
pnpm --filter @workspace/db run push
```

### 4. Run Development Servers
```bash
# Terminal 1: Start API server (port 3001)
pnpm --filter @workspace/api-server run dev

# Terminal 2: Start frontend (port 5173)
cd artifacts/news-portal && pnpm run dev
```

### 5. Access
- **Website**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin
  - Username: `admin` | Password: `admin123`
- **API**: http://localhost:3001/api

## 🌐 Deployment

### Vercel (Frontend + API)
1. Connect GitHub repo to Vercel
2. Set root directory to `Content-Hub`
3. Add environment variables in Vercel Dashboard
4. Deploy!

### Database (Neon PostgreSQL)
1. Go to [neon.tech](https://neon.tech) → Create free project
2. Copy connection string
3. Add as `DATABASE_URL` in Vercel env vars
4. Run: `pnpm --filter @workspace/db run push`

### Cloudflare (DNS + CDN)
1. Add your domain in Cloudflare
2. Add CNAME record pointing to Vercel deployment URL
3. Enable Proxy (orange cloud) for CDN + DDoS protection
4. SSL/TLS → Full (Strict) mode

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | List published articles |
| GET | `/api/articles/featured` | Featured/breaking news |
| GET | `/api/articles/latest` | Latest articles |
| GET | `/api/articles/:id` | Article detail |
| POST | `/api/articles` | Create article (admin) |
| PUT | `/api/articles/:id` | Update article (admin) |
| DELETE | `/api/articles/:id` | Delete article (admin) |
| POST | `/api/articles/:id/publish` | Publish/unpublish |
| GET | `/api/categories` | All categories |
| POST | `/api/categories` | Create category (admin) |
| GET | `/api/admin/stats` | Dashboard statistics |
| POST | `/api/admin/login` | Admin login |

## 🔐 Environment Variables

See `.env.example` for all required variables.

**Required for production:**
- `DATABASE_URL` — Neon PostgreSQL connection string
- `NODE_ENV=production`
- `JWT_SECRET` — Random secret for auth tokens

## 📄 License

MIT
