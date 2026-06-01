"use client";

import { useCallback, useState } from "react";
import type { ResumeAnalysis } from "@/types/analysis";
import { AnalysisResults } from "./AnalysisResults";

type Step = "input" | "analyzing" | "results";

export function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/parse", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setResumeText(data.text);
      setFileName(data.fileName ?? file.name);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) void handleFile(file);
    },
    [handleFile]
  );

  const runAnalysis = async () => {
    setError(null);
    setStep("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription: jobDescription || undefined,
          targetRole: targetRole || undefined,
          industry: industry || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Analysis failed");
      setAnalysis(data.analysis);
      setStep("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed");
      setStep("input");
    }
  };

  const reset = () => {
    setStep("input");
    setAnalysis(null);
    setError(null);
  };

  if (step === "results" && analysis) {
    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={reset}
          className="text-sm text-accent-glow hover:underline"
        >
          ← Analyze another resume
        </button>
        <AnalysisResults analysis={analysis} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      )}

      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-1">Your Resume</h2>
        <p className="text-sm text-slate-500 mb-4">
          Upload PDF/DOCX/TXT or paste text below
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition mb-4 ${
            dragOver
              ? "border-accent bg-accent/10"
              : "border-surface-border hover:border-slate-500"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            className="hidden"
            id="resume-file"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void handleFile(f);
            }}
          />
          <label htmlFor="resume-file" className="cursor-pointer block">
            {uploading ? (
              <span className="text-slate-400">Extracting text…</span>
            ) : (
              <>
                <span className="text-3xl block mb-2">📄</span>
                <span className="text-accent-glow font-medium">
                  Click or drag file here
                </span>
                <span className="block text-xs text-slate-500 mt-1">
                  PDF, DOCX, TXT — max 5 MB
                </span>
              </>
            )}
          </label>
          {fileName && (
            <p className="mt-3 text-xs text-green-400">Loaded: {fileName}</p>
          )}
        </div>

        <textarea
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Or paste your resume text here…"
          rows={12}
          className="w-full rounded-xl bg-surface border border-surface-border px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 font-mono"
        />
        <p className="text-xs text-slate-600 mt-2">
          {resumeText.length.toLocaleString()} characters
          {resumeText.length < 80 && resumeText.length > 0 && " (need more for analysis)"}
        </p>
      </section>

      <section className="glass rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-1">Job Match (optional)</h2>
        <p className="text-sm text-slate-500 mb-4">
          Paste a job description for ATS keyword scoring and gap analysis
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description…"
          rows={6}
          className="w-full rounded-xl bg-surface border border-surface-border px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-accent/50 mb-4"
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target role (e.g. Software Engineer)"
            className="rounded-xl bg-surface border border-surface-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            placeholder="Industry (e.g. FinTech)"
            className="rounded-xl bg-surface border border-surface-border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
          />
        </div>
      </section>

      <button
        type="button"
        disabled={resumeText.trim().length < 80 || step === "analyzing"}
        onClick={() => void runAnalysis()}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-accent to-blue-600 text-white font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition shadow-lg shadow-accent/20"
      >
        {step === "analyzing" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Analyzing with AI… (15–45 sec)
          </span>
        ) : (
          "Run AI Analysis"
        )}
      </button>

      <p className="text-center text-xs text-slate-600">
        Your resume is sent to the AI provider only for analysis — not stored on our servers.
      </p>
    </div>
  );
}
