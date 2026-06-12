# Designer InBody Standard Scan

A deterministic portfolio diagnostic for 3rd and 4th year undergraduate design students. The app collects a profile, 36 Likert responses, 12 situational judgments, a representative project, and portfolio evidence before generating a printable one-page report.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- React Hook Form + Zod
- Recharts
- Prisma + SQLite
- Browser print engine for PDF export

## Setup

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Submitted scans are listed at `/admin/scans`.

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp` when needed. A local `.env` is already included for immediate development.

## Scoring

Each indicator is scored from 0–100:

```text
indicator = self-assessment × 0.25
          + situational judgment × 0.35
          + portfolio evidence × 0.40
```

- Likert averages are linearly converted from 1–5 to 0–100.
- Situational options contain explicit 0–100 scores and optional tags in seed data.
- Evidence score is the percentage of checked items for that indicator.
- Category scores average their three indicators.
- Overall score averages all 12 indicators.

All score, type-tag, and consulting-priority logic lives in `lib/scoring.ts`. No AI-generated scoring is used.

## Database

The Prisma schema is in `prisma/schema.prisma`. Seed content is sourced from `lib/scan-data.ts` and loaded by `prisma/seed.ts`.

Useful commands:

```bash
npm run db:push
npm run db:seed
npm run db:studio
npm run build
```

## PDF export

Open a result and choose **Print / Save PDF**. Print styles replace the detailed screen report with an A4 one-page diagnostic layout.
