import { BarChart3, Brain, Eye } from 'lucide-react';

const capabilities = [
  { icon: Brain, title: 'AI Classification', description: 'Explore the model’s predicted diabetic retinopathy severity category from a retinal fundus image.' },
  { icon: Eye, title: 'Visual Explanations', description: 'View a Grad-CAM overlay showing the image regions that influenced the model’s output.' },
  { icon: BarChart3, title: 'Probability Insights', description: 'Inspect the model’s probability distribution across all five severity classes.' },
];

export default function Overview() {
  return (
    <section id="capabilities" className="scroll-mt-20 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl"><p className="section-label mb-3">One clear view</p><h2 className="text-3xl font-bold tracking-[-0.03em] text-navy-800 md:text-4xl">Understand what the model sees.</h2></div>
          <p className="max-w-md text-sm leading-relaxed text-slate-500">DR-Visualize brings prediction, confidence, and visual context together in one focused analysis experience.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {capabilities.map(({ icon: Icon, title, description }) => (
            <article key={title} className="card card-hover p-7">
              <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600"><Icon size={21} /></div>
              <h3 className="mb-2 text-lg font-semibold text-navy-800">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-500">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
