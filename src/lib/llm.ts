import OpenAI from "openai";
import {
  ResumeAnalysisSchema,
  type AnalysisRequest,
  type ResumeAnalysis,
} from "@/types/analysis";

const SYSTEM_PROMPT = `You are an expert career coach, ATS specialist, and technical recruiter with 15+ years of experience reviewing resumes across industries.

Analyze resumes with rigor and kindness. Be specific—cite actual phrases or gaps from the resume. Never invent experience the candidate did not list.

Return ONLY valid JSON matching this exact schema (no markdown, no commentary):
{
  "summary": "2-3 sentence executive overview",
  "scores": {
    "overall": 0-100,
    "atsCompatibility": 0-100,
    "contentQuality": 0-100,
    "impactAndMetrics": 0-100,
    "clarityAndStructure": 0-100,
    "keywordAlignment": 0-100 or omit if no job description
  },
  "sectionFeedback": [{"section": "Experience", "score": 0-100, "strengths": [], "improvements": []}],
  "topStrengths": ["3-5 bullets"],
  "criticalIssues": ["must-fix items, max 5"],
  "actionableTips": ["prioritized improvements, 5-8 items"],
  "keywordAnalysis": {"matched": [], "missing": [], "suggested": []} or omit,
  "bulletRewrites": [{"original": "weak bullet from resume", "improved": "STAR-style rewrite", "rationale": "why"}],
  "careerLevel": "student|entry|mid|senior|executive|unknown",
  "targetRoles": ["2-4 suitable roles"],
  "estimatedReadTimeSeconds": 15-90
}

Scoring rubric:
- ATS: headings, keywords, parseability, no tables/images dependency
- Content: relevance, depth, no fluff
- Impact: metrics, outcomes, action verbs
- Clarity: scanability, consistent tense, length
- Keyword alignment: only when job description provided

Provide 2-4 bulletRewrites using REAL bullets from the resume when possible.`;

function buildUserPrompt(req: AnalysisRequest): string {
  let prompt = `## RESUME\n\n${req.resumeText}\n`;

  if (req.jobDescription?.trim()) {
    prompt += `\n## TARGET JOB DESCRIPTION\n\n${req.jobDescription.trim()}\n`;
  }
  if (req.targetRole?.trim()) {
    prompt += `\n## TARGET ROLE\n${req.targetRole.trim()}\n`;
  }
  if (req.industry?.trim()) {
    prompt += `\n## INDUSTRY\n${req.industry.trim()}\n`;
  }

  prompt +=
    "\nAnalyze thoroughly. If job description is provided, score keywordAlignment and fill keywordAnalysis.";
  return prompt;
}

export async function analyzeResume(
  req: AnalysisRequest
): Promise<ResumeAnalysis> {
  const provider = resolveProvider();

  if (provider === "groq") return analyzeWithGroq(req);
  return analyzeWithOpenAI(req);
}

function resolveProvider(): "openai" | "groq" {
  const explicit = (process.env.LLM_PROVIDER ?? "").toLowerCase().trim();
  if (explicit === "groq") return "groq";
  if (explicit === "openai") return "openai";

  // Auto-detect: prefer Groq if it's configured (common for free deploys).
  if (process.env.GROQ_API_KEY?.trim()) return "groq";
  return "openai";
}

async function analyzeWithOpenAI(req: AnalysisRequest): Promise<ResumeAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Either set OPENAI_API_KEY, or set GROQ_API_KEY (or LLM_PROVIDER=groq) to use Groq."
    );
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(req) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from AI model");

  return parseAnalysisJson(content);
}

async function analyzeWithGroq(req: AnalysisRequest): Promise<ResumeAnalysis> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not set when LLM_PROVIDER=groq");
  }

  const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
  const baseURL = "https://api.groq.com/openai/v1";

  const client = new OpenAI({ apiKey, baseURL });

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(req) },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("Empty response from Groq");

  return parseAnalysisJson(content);
}

function parseAnalysisJson(content: string): ResumeAnalysis {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("AI returned invalid JSON");
    parsed = JSON.parse(match[0]);
  }

  const result = ResumeAnalysisSchema.safeParse(parsed);
  if (!result.success) {
    console.error("Schema validation failed:", result.error.flatten());
    throw new Error("AI response did not match expected format. Try again.");
  }
  return result.data;
}
