# Yunus Emre Koyun — Portfolio

Next.js ve TypeScript ile geliştirilen kişisel full-stack developer portfolyosu. İçerik merkezi olarak `data/portfolio.ts` dosyasından yönetilir.

## Routes

- `/` — Ana sayfa
- `/projects` — Proje arşivi
- `/projects/[slug]` — Statik üretilen case study sayfaları

## Run

```bash
npm install
npm run dev
```

Then open `http://127.0.0.1:3000`.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
```
