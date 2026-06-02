# AI Resume Analyzer

AI-powered resume analyzer (ATS score + job match + bullet rewrites) built with **Next.js**.

**Live demo**: `https://ai-resume-analyzer-jet-psi.vercel.app/`

## Run locally

Prereqs: Node.js 18+

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

### Groq (recommended)

```env
LLM_PROVIDER=groq
GROQ_API_KEY=gsk_your-groq-key
GROQ_MODEL=llama-3.3-70b-versatile
```

### OpenAI (optional)

```env
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4o-mini
```
