import { NextRequest, NextResponse } from "next/server";
import { analyzeResume } from "@/lib/llm";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resumeText = typeof body.resumeText === "string" ? body.resumeText : "";
    const jobDescription =
      typeof body.jobDescription === "string" ? body.jobDescription : undefined;
    const targetRole =
      typeof body.targetRole === "string" ? body.targetRole : undefined;
    const industry =
      typeof body.industry === "string" ? body.industry : undefined;

    if (!resumeText.trim() || resumeText.trim().length < 80) {
      return NextResponse.json(
        { error: "Resume text is too short (min ~80 characters)" },
        { status: 400 }
      );
    }

    const analysis = await analyzeResume({
      resumeText: resumeText.trim(),
      jobDescription: jobDescription?.trim() || undefined,
      targetRole: targetRole?.trim() || undefined,
      industry: industry?.trim() || undefined,
    });

    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("Analyze error:", err);
    const message =
      err instanceof Error ? err.message : "Analysis failed";
    const status = message.includes("API key") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
