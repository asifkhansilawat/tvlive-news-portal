# Workspace

## Overview

pnpm workspace monorepo using TypeScript. A Dainik Bhaskar-style Hindi news portal with admin panel.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + Wouter routing
- **State**: Zustand (admin auth)
- **Fonts**: Noto Sans Devanagari (Hindi support), Inter

## Features

### News Portal Website (/)
- Homepage with breaking news ticker, featured hero articles, category sections
- Article detail page with views counter, share buttons, related articles
- Category listing pages with pagination
- Search articles by keyword
- Navigation with all categories dynamically loaded from DB

### Admin Panel (/admin)
- Login: admin / admin123
- Dashboard with stats: total articles, published, drafts, categories, total views
- Article management: create, edit, publish/unpublish, toggle featured, delete
- Category management: create categories with custom colors
- When admin publishes article -> shows on website immediately

### API (/api)
- GET /articles - list published articles (with category/search filter)
- GET /articles/featured - featured/breaking news
- GET /articles/latest - latest published
- GET /articles/:id - article detail (increments view count)
- POST /articles - create article
- PUT /articles/:id - update article
- DELETE /articles/:id - delete
- POST /articles/:id/publish - publish/unpublish
- GET /categories - all categories with article counts
- POST /categories - create category
- GET /admin/stats - dashboard stats
- GET /admin/articles - all articles including drafts
- POST /admin/login - admin authentication

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Database Schema

- `categories` — id, name, slug, color, created_at
- `articles` — id, title, slug, summary, content, image_url, category_id, author, is_published, is_featured, view_count, published_at, created_at, updated_at
