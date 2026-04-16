# NEWS. — kvnews

Your current briefing. Clean, fast, hourly-updated news across 7 categories.

## Stack
- **Next.js 14** (App Router)
- **Vercel** (hosting + cron jobs)
- **Vercel KV** (Redis-compatible cache)
- **OpenWeatherMap** (free tier weather)

---

## Setup in Cursor

1. **Unzip** this folder and open it in Cursor
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Then fill in `.env.local` (see below)

4. **Run locally**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

### Upstash Redis
1. Go to [vercel.com](https://vercel.com) → your project → Integrations tab
2. Search Upstash Redis in the Marketplace and add it (free tier)
3. Vercel auto-injects UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
4. Copy those two values into `.env.local`

### OpenWeatherMap
1. Sign up free at [openweathermap.org](https://openweathermap.org/api)
2. Get your API key (free tier: 1,000 calls/day — plenty)
3. Add to `.env.local` as `OPENWEATHER_API_KEY`
4. Also add as `NEXT_PUBLIC_OPENWEATHER_KEY` (needed client-side for weather widget)

### Cron Secret
- Make up any random string (e.g. `mySuperSecret123`)
- Add as `CRON_SECRET` in `.env.local`
- Add the **same value** in Vercel dashboard → Settings → Environment Variables

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
3. Add all environment variables in Vercel dashboard
4. Deploy

Vercel will auto-detect Next.js. The cron job in `vercel.json` fires every hour automatically.

### First data load
After deploying, trigger the first cache fill manually:
```
https://kvnews.vercel.app/api/cron
```
With header: `Authorization: Bearer YOUR_CRON_SECRET`

Or just wait — the cron fires on the next hour mark.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── cron/route.ts      # Hourly cron — fetches all RSS feeds
│   │   └── news/route.ts      # Frontend fetches from here
│   ├── layout.tsx
│   └── page.tsx               # Main page
├── components/
│   ├── Header.tsx             # Brand + greeting + clock + weather + theme switcher
│   ├── TabNav.tsx             # 7-tab navigation
│   ├── NewsFeed.tsx           # Fetches + renders a category
│   ├── NewsCard.tsx           # Hero and small card variants
│   ├── Modal.tsx              # Story expanded view
│   ├── BreakingBanner.tsx     # Breaking news strip
│   └── Weather.tsx            # OpenWeatherMap widget
├── lib/
│   ├── sources.ts             # RSS feed URLs per category
│   ├── fetcher.ts             # RSS fetch + parse + clean + dedup
│   ├── cache.ts               # Vercel KV helpers
│   ├── useTheme.ts            # Theme hook (morning/day/evening)
│   └── useClock.ts            # Live 24hr clock hook
└── styles/
    └── globals.css            # Theme variables + global styles
```

---

## Themes

| Theme    | Time        | Background | Surface  | Accent  |
|----------|-------------|------------|----------|---------|
| Morning  | 06:00–12:00 | #FAF7F4    | #FFFFFF  | #B34F00 |
| Day      | 12:00–19:00 | #F3F6FB    | #FFFFFF  | #1A4FCC |
| Evening  | 19:00–06:00 | #1C2333    | #253047  | #60A5FA |

Auto-switches by time. User can override via the icons in the header.

---

## Caching Logic

- Vercel cron fires at `0 * * * *` (every hour on the hour)
- Fetches all 7 categories in parallel
- Stores each as a JSON blob in Vercel KV (90 min TTL)
- All users read from the same cached snapshot
- If cache is empty (first load / KV miss), falls back to live fetch

## Breaking News

- Any story published within the last 30 minutes is flagged `breaking: true`
- If a breaking story exists in the current category, a banner appears at the top
- User can dismiss it; it won't re-appear until they switch tabs

---

## Adding / Changing RSS Sources

Edit `src/lib/sources.ts` — each category has:
- `feeds[]` — primary feeds (fetched in parallel) + one fallback
- `keywords[]` (optional) — filter stories to only those containing these words

---

*Built with Next.js + Vercel. Free to host, free to run.*
