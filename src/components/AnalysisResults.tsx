"use client";

import type { ResumeAnalysis } from "@/types/analysis";
import { ScoreGauge } from "./ScoreGauge";

export function AnalysisResults({ analysis }: { analysis: ResumeAnalysis }) {
  const { scores } = analysis;

  const scoreItems = [
    { label: "ATS Fit", score: scores.atsCompatibility },
    { label: "Content", score: scores.contentQuality },
    { label: "Impact", score: scores.impactAndMetrics },
    { label: "Clarity", score: scores.clarityAndStructure },
    ...(scores.keywordAlignment != null
      ? [{ label: "Keywords", score: scores.keywordAlignment }]
      : []),
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="glass rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <ScoreGauge label="Overall Score" score={scores.overall} size="lg" />
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs bg-accent-muted text-accent-glow border border-accent/30 capitalize">
                {analysis.careerLevel} level
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-surface-border text-slate-300">
                ~{analysis.estimatedReadTimeSeconds}s read time
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
            <div className="flex flex-wrap gap-2">
              {analysis.targetRoles.map((role) => (
                <span
                  key={role}
                  className="text-xs px-2 py-1 rounded bg-surface border border-surface-border text-slate-400"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-6 border-t border-surface-border pt-8">
          {scoreItems.map((item) => (
            <ScoreGauge key={item.label} label={item.label} score={item.score} />
          ))}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-6">
        <InsightCard title="Top Strengths" items={analysis.topStrengths} variant="positive" />
        <InsightCard title="Critical Issues" items={analysis.criticalIssues} variant="critical" />
      </div>

      <section className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Action Plan</h3>
        <ol className="space-y-3">
          {analysis.actionableTips.map((tip, i) => (
            <li key={i} className="flex gap-3 text-slate-300 text-sm">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent-glow flex items-center justify-center text-xs font-mono">
                {i + 1}
              </span>
              {tip}
            </li>
          ))}
        </ol>
      </section>

      {analysis.keywordAnalysis && (
        <section className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Keyword Analysis</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <KeywordGroup title="Matched" words={analysis.keywordAnalysis.matched} color="green" />
            <KeywordGroup title="Missing" words={analysis.keywordAnalysis.missing} color="red" />
            <KeywordGroup title="Suggested" words={analysis.keywordAnalysis.suggested} color="blue" />
          </div>
        </section>
      )}

      <section className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4">Section Breakdown</h3>
        <div className="space-y-4">
          {analysis.sectionFeedback.map((section) => (
            <div
              key={section.section}
              className="border border-surface-border rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">{section.section}</h4>
                <span className="text-sm font-mono text-accent-glow">{section.score}/100</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-green-400/80 text-xs uppercase mb-2">Strengths</p>
                  <ul className="space-y-1 text-slate-400">
                    {section.strengths.map((s, i) => (
                      <li key={i}>+ {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-amber-400/80 text-xs uppercase mb-2">Improve</p>
                  <ul className="space-y-1 text-slate-400">
                    {section.improvements.map((s, i) => (
                      <li key={i}>→ {s}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {analysis.bulletRewrites.length > 0 && (
        <section className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4">Bullet Rewrites</h3>
          <div className="space-y-6">
            {analysis.bulletRewrites.map((bullet, i) => (
              <div key={i} className="border-l-2 border-accent pl-4 space-y-2">
                <p className="text-sm text-slate-500 line-through">{bullet.original}</p>
                <p className="text-slate-200">{bullet.improved}</p>
                <p className="text-xs text-slate-500 italic">{bullet.rationale}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => downloadReport(analysis)}
          className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-glow text-white text-sm font-medium transition"
        >
          Download Report (JSON)
        </button>
      </div>
    </div>
  );
}

function InsightCard({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "positive" | "critical";
}) {
  const border =
    variant === "positive" ? "border-green-500/30" : "border-red-500/30";
  return (
    <section className={`glass rounded-2xl p-6 border ${border}`}>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-slate-300">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span>{variant === "positive" ? "✓" : "!"}</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function KeywordGroup({
  title,
  words,
  color,
}: {
  title: string;
  words: string[];
  color: "green" | "red" | "blue";
}) {
  const colors = {
    green: "bg-green-500/10 text-green-300 border-green-500/20",
    red: "bg-red-500/10 text-red-300 border-red-500/20",
    blue: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  };
  return (
    <div>
      <p className="text-xs uppercase text-slate-500 mb-2">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {words.length === 0 ? (
          <span className="text-slate-600 text-sm">None</span>
        ) : (
          words.map((w) => (
            <span
              key={w}
              className={`text-xs px-2 py-0.5 rounded border ${colors[color]}`}
            >
              {w}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

function downloadReport(analysis: ResumeAnalysis) {
  const blob = new Blob([JSON.stringify(analysis, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `resume-analysis-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
