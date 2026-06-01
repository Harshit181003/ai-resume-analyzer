"use client";

function scoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#eab308";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

export function ScoreGauge({
  label,
  score,
  size = "md",
}: {
  label: string;
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "lg" ? 120 : size === "md" ? 88 : 64;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative rounded-full score-ring flex items-center justify-center"
        style={
          {
            width: dim,
            height: dim,
            "--score": score,
            "--score-color": color,
          } as React.CSSProperties
        }
      >
        <div
          className="absolute rounded-full bg-surface flex items-center justify-center font-semibold"
          style={{
            width: dim - 14,
            height: dim - 14,
            fontSize: size === "lg" ? "1.75rem" : size === "md" ? "1.25rem" : "0.875rem",
          }}
        >
          {score}
        </div>
      </div>
      <span className="text-xs text-slate-400 text-center max-w-[100px]">
        {label}
      </span>
    </div>
  );
}
