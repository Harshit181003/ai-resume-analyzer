import { ResumeAnalyzer } from "@/components/ResumeAnalyzer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full" />
      </div>

      <header className="border-b border-surface-border/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              AI Resume Analyzer
            </h1>
            <p className="text-xs text-slate-500">
              ATS scoring · job match · bullet rewrites
            </p>
          </div>
          <a
            href="https://github.com/Harshit181003/ai-resume-analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-accent-glow transition"
          >
            GitHub →
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <section className="mb-10 text-center">
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            Upload your resume and optionally a job description. Get multi-dimensional
            scores, keyword gaps, section feedback, and AI-rewritten bullet points
            powered by GPT.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["ATS Score", "Job Match", "Bullet Rewrites", "Export Report"].map(
              (f) => (
                <span
                  key={f}
                  className="text-xs px-3 py-1.5 rounded-full border border-surface-border text-slate-400"
                >
                  {f}
                </span>
              )
            )}
          </div>
        </section>

        <ResumeAnalyzer />
      </div>

      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-xs text-slate-600 border-t border-surface-border/30 mt-16">
        Built with Next.js & OpenAI · Deploy free on Vercel
      </footer>
    </main>
  );
}
