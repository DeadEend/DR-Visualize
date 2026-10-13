import { Link } from 'react-router-dom';
import { ArrowRight, Link as LinkIcon, ScanSearch, ShieldCheck, Sparkles } from 'lucide-react';

const PREVIEW_BARS = [
  { label: 'No DR',           width: '25%',  color: '#22c55e' },
  { label: 'Mild DR',         width: '40%',  color: '#eab308' },
  { label: 'Moderate DR',     width: '80%',  color: '#f59e0b' },
  { label: 'Severe DR',       width: '33%',  color: '#f97316' },
  { label: 'Proliferative DR',width: '20%',  color: '#ef4444' },
];

export default function Hero() {
  return (
    <section className="bg-slate-50 pt-20 pb-14 md:pt-24 md:pb-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 xl:gap-20">

        {/* ── Left: hero copy ── */}
        <div className="max-w-xl animate-fade-in-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-3.5 py-2 text-xs font-semibold tracking-wide text-primary-700 shadow-soft">
            <Sparkles size={14} />
            Explainable retinal image analysis
          </div>
          <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.04em] text-navy-800 sm:text-5xl lg:text-[3.75rem]">
            See more in every{' '}
            <span className="text-primary-600 underline decoration-primary-200 decoration-4 underline-offset-8">
              retinal image.
            </span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
            Explore AI-powered retinal image analysis with severity classification, probability scores, and visual explanations generated using Grad-CAM.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/analyze" className="btn-primary px-5 py-3.5">
              <ScanSearch size={18} />
              Analyze an Image
              <ArrowRight size={17} />
            </Link>
            <a href="#how-it-works" className="btn-secondary px-5 py-3.5">See How It Works</a>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={15} className="text-primary-600" />
            Experimental tool for research and educational use
          </div>
        </div>

        {/* ── Right: Analysis Preview card ── */}
        <div className="animate-fade-in-up w-full">
          {/* Outer chrome */}
          <div className="mx-auto w-full max-w-[480px] rounded-2xl border border-slate-200 bg-white p-2.5 shadow-card lg:max-w-full">
            {/* Inner panel */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">

              {/* Card header */}
              <div className="mb-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Analysis preview</p>
                <p className="mt-0.5 text-sm font-semibold text-navy-800">Retinal image insights</p>
              </div>

              {/* Two-column inner layout — stacks below md */}
              <div className="grid gap-3 md:grid-cols-[1fr_1.1fr]">

                {/* Retinal image mock */}
                <div className="relative min-h-0 min-w-0 w-full overflow-hidden rounded-xl border border-slate-200 bg-[#d8dde4]" style={{ aspectRatio: '1/1' }}>
                  <div className="absolute inset-[10%] rounded-full border-10 border-[#d5d9de] bg-[#b95743] shadow-inner" />
                  <div className="absolute left-[39%] top-[42%] h-16 w-16 rounded-full bg-[#d38b74] opacity-70 blur-xl" />
                  <div className="absolute left-[19%] top-[33%] h-7 w-16 rotate-28 rounded-full bg-[#8d2f2d] opacity-70 blur-md" />
                  <div className="absolute right-[16%] top-[55%] h-6 w-14 rotate-[-30deg] rounded-full bg-[#8d2f2d] opacity-60 blur-md" />
                  <span className="absolute bottom-2.5 left-2.5 rounded-md bg-white/85 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">
                    Image preview
                  </span>
                </div>

                {/* Model output panel */}
                <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5">
                  {/* Header row */}
                  <div className="mb-2.5 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-500">Output preview</span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-500">Preview</span>
                  </div>
                  <p className="text-base font-bold text-navy-800 leading-tight">Model output</p>
                  <p className="mt-0.5 mb-3 text-[10px] text-slate-500">Class and confidence appear here</p>

                  {/* Probability bars */}
                  <div className="mt-auto">
                    <p className="mb-2 text-[10px] font-semibold text-slate-600">Probability distribution</p>
                    <div className="space-y-2">
                      {PREVIEW_BARS.map(({ label, width, color }) => (
                        <div key={label}>
                          <p className="mb-0.5 text-[9px] text-slate-500 leading-none">{label}</p>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full"
                              style={{ width, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom CTA strip */}
              <Link
                to="/analyze"
                className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-primary-100 bg-primary-50/60 px-3 py-2 text-[10px] font-medium text-primary-800 transition-colors hover:border-primary-200 hover:bg-primary-50"
              >
                <span className="flex items-center gap-1.5">
                  <Sparkles size={12} className="shrink-0" />
                  Upload an image to generate a real prediction and explanation.
                </span>
                <LinkIcon size={12} className="shrink-0" />
              </Link>
            </div>
          </div>
          <p className="mt-2.5 text-center text-[11px] text-slate-400">Open Analyze to use the live workflow.</p>
        </div>

      </div>
    </section>
  );
}
