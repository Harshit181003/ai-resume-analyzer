import { z } from "zod";

export const ScoreBreakdownSchema = z.object({
  overall: z.number().min(0).max(100),
  atsCompatibility: z.number().min(0).max(100),
  contentQuality: z.number().min(0).max(100),
  impactAndMetrics: z.number().min(0).max(100),
  clarityAndStructure: z.number().min(0).max(100),
  keywordAlignment: z.number().min(0).max(100).optional(),
});

export const SectionFeedbackSchema = z.object({
  section: z.string(),
  score: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});

export const KeywordAnalysisSchema = z.object({
  matched: z.array(z.string()),
  missing: z.array(z.string()),
  suggested: z.array(z.string()),
});

export const BulletRewriteSchema = z.object({
  original: z.string(),
  improved: z.string(),
  rationale: z.string(),
});

export const ResumeAnalysisSchema = z.object({
  summary: z.string(),
  scores: ScoreBreakdownSchema,
  sectionFeedback: z.array(SectionFeedbackSchema),
  topStrengths: z.array(z.string()),
  criticalIssues: z.array(z.string()),
  actionableTips: z.array(z.string()),
  keywordAnalysis: KeywordAnalysisSchema.optional(),
  bulletRewrites: z.array(BulletRewriteSchema),
  careerLevel: z.enum([
    "student",
    "entry",
    "mid",
    "senior",
    "executive",
    "unknown",
  ]),
  targetRoles: z.array(z.string()),
  estimatedReadTimeSeconds: z.number(),
});

export type ResumeAnalysis = z.infer<typeof ResumeAnalysisSchema>;
export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;

export type AnalysisRequest = {
  resumeText: string;
  jobDescription?: string;
  targetRole?: string;
  industry?: string;
};
