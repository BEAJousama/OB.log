# OB.log — standalone blog

This app was split from the main portfolio so you can deploy it on its own domain (e.g. `blog.obeaj.com`). It includes **Sanity Studio** for editing posts.

## Routes

- `/` — article listing  
- `/[slug]` — article page  
- `/studio` — Sanity Studio (content CMS)

## Setup

```bash
cd obeaj-blog
cp .env.example .env.local
# fill Sanity + URLs
npm install
npm run dev
```

Dev server runs on **port 3001** by default (so it can run next to the portfolio on 3000). Open `http://localhost:3001/studio` to edit content.

## Sanity

Schemas and custom tools live in `sanity/`; config is `sanity.config.ts` at the app root.

- **Studio:** `/studio` in this app (not on the portfolio anymore).
- **Public site:** reads the same dataset via `next-sanity` using `NEXT_PUBLIC_SANITY_*` and optional `SANITY_API_READ_TOKEN`.
- **Deploy button in Studio:** set `VERCEL_DEPLOY_HOOK_URL` to a deploy hook for **this** blog project on Vercel.

## Deploy

Deploy this folder as its own Vercel project (root directory: `obeaj-blog`, or move this repo to a dedicated git repo).

Set `NEXT_PUBLIC_SITE_URL` to your blog URL and `NEXT_PUBLIC_PORTFOLIO_URL` to your portfolio URL.

## Main portfolio

Point the portfolio nav “Blog” link to `NEXT_PUBLIC_BLOG_URL` (see portfolio `.env.example`).
# OB.log
