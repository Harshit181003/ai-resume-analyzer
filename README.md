# AI Resume Analyzer

Advanced AI-powered resume analysis: ATS compatibility scoring, job-description keyword matching, section-by-section feedback, and STAR-style bullet rewrites — built with **Next.js 14** and **OpenAI** (or free **Groq**).

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Multi-dimensional scoring** — Overall, ATS, content quality, impact/metrics, clarity, and optional keyword alignment
- **File upload** — PDF, DOCX, or TXT (up to 5 MB)
- **Job description match** — Paste a JD for keyword gap analysis
- **Section breakdown** — Per-section strengths and improvements
- **Bullet rewrites** — AI-improved bullets with rationale
- **Export** — Download full analysis as JSON
- **Dual LLM support** — OpenAI (default) or Groq (generous free tier)

## Quick Start (Local)

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- An API key from [OpenAI](https://platform.openai.com/api-keys) **or** [Groq](https://console.groq.com/)

### Setup

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
```

**Optional — use Groq (free tier):**

```env
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your-groq-key
GROQ_MODEL=llama-3.3-70b-versatile
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Publish on GitHub

1. Create a new repository on [GitHub](https://github.com/new) (e.g. `ai-resume-analyzer`).
2. From your project folder:

```bash
git init
git add .
git commit -m "Initial commit: AI resume analyzer with ATS scoring and job match"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
git push -u origin main
```

3. Update the GitHub link in `src/app/page.tsx` (header) with your repo URL.

> **Never commit** `.env.local` or API keys. They are listed in `.gitignore`.

## Deploy Free on Vercel

[Vercel](https://vercel.com) offers a free tier ideal for Next.js apps.

### Option A: Deploy from GitHub (recommended)

1. Push your repo to GitHub (steps above).
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Framework preset: **Next.js** (auto-detected).
4. Add **Environment Variables**:
   - `OPENAI_API_KEY` = your key
   - Optional: `OPENAI_MODEL` = `gpt-4o-mini`
   - Or for Groq: `LLM_PROVIDER` = `groq`, `GROQ_API_KEY` = your key
5. Click **Deploy**.

Your live URL will look like `https://ai-resume-analyzer.vercel.app`.

### Option B: Deploy with Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

Follow prompts and add env vars when asked (or in the Vercel dashboard → Project → Settings → Environment Variables).

## Other Free Hosting Options

| Platform | Notes |
|----------|--------|
| [Netlify](https://www.netlify.com/) | Connect GitHub repo; set build `npm run build`, publish `.next` via Next plugin |
| [Railway](https://railway.app/) | Free trial credits; add env vars in dashboard |
| [Render](https://render.com/) | Free web service; set start command `npm start` after build |

Vercel is recommended for the simplest Next.js experience.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes* | OpenAI API key |
| `OPENAI_MODEL` | No | Default `gpt-4o-mini` |
| `LLM_PROVIDER` | No | `openai` (default) or `groq` |
| `GROQ_API_KEY` | If Groq | Groq API key |
| `GROQ_MODEL` | No | Default `llama-3.3-70b-versatile` |

\* Required unless using Groq with `LLM_PROVIDER=groq`.

## Project Structure

```
src/
  app/
    api/parse/     # Resume file → text
    api/analyze/   # LLM analysis
    page.tsx       # Main UI
  components/      # Analyzer UI & results
  lib/             # Parsing & LLM client
  types/           # Zod schemas
```

## Privacy

Resume text is sent to your configured LLM provider for analysis only. This app does not persist uploads or results on the server by default.

## License

MIT — use freely for personal and commercial projects.
