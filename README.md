# WerkWijzer

WerkWijzer is a bilingual (Dutch/English) career discovery web app. Answer ~20 adaptive questions about who you are, what you value, and what you enjoy — and receive 7 personalised job title matches with explanations plus live vacancy search results from the Netherlands, Belgium, and internationally.

Built with Next.js 14, Tailwind CSS, Claude AI (Anthropic), and Adzuna.

---

## Local setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/werkwijzer.git
cd werkwijzer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env.local`

Create a file named `.env.local` in the root of the project:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ADZUNA_APP_ID=your_adzuna_app_id_here
ADZUNA_APP_KEY=your_adzuna_app_key_here
```

**Where to get each key:**

| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys → Create key |
| `ADZUNA_APP_ID` | [developer.adzuna.com](https://developer.adzuna.com) → Register → Create app → App ID |
| `ADZUNA_APP_KEY` | Same page as App ID → App Key |

Adzuna free tier: 100 API calls/day. Each vacancy search uses ~3 calls (NL + BE + GB per job title).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/werkwijzer.git
git push -u origin main
```

### 2. Import in Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your GitHub repo
3. Leave all build settings as default (Next.js is auto-detected)

### 3. Add environment variables

In your Vercel project: **Settings → Environment Variables**, add:

- `ANTHROPIC_API_KEY`
- `ADZUNA_APP_ID`
- `ADZUNA_APP_KEY`

### 4. Deploy

Click **Deploy**. Vercel builds and deploys automatically. Future pushes to `main` redeploy automatically.

---

## Cost estimate

| Service | Cost |
|---|---|
| Anthropic Claude API | ~€0.02 per complete analysis (Sonnet 4) |
| Adzuna | Free tier: 100 calls/day; paid plans from $89/month |

For a personal or low-traffic site, costs are negligible. At 50 analyses/day the Anthropic cost is ~€1/day.

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS + CSS custom properties |
| AI | Anthropic Claude claude-sonnet-4-20250514 |
| Vacancy data | Adzuna Jobs API |
| PDF export | jsPDF + html2canvas |
| State | localStorage (no database, no auth) |
| Deploy | Vercel |
| Fonts | Bricolage Grotesque + Mulish (Google Fonts) |

---

## Project structure

```
/app
  page.tsx               Welcome / landing
  /wizard/page.tsx       Adaptive question wizard
  /loading/page.tsx      Analysis loading screen
  /results/page.tsx      Job match results + PDF export
  /vacancies/page.tsx    Live vacancy results
  /api/analyse/          Claude analysis endpoint
  /api/next-questions/   Adaptive question generation
  /api/vacancies/        Adzuna vacancy search

/components              All UI components
/lib                     Types, translations, storage, PDF
/contexts                Language context (NL/EN)
```
