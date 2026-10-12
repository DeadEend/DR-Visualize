import { Brain, Eye, Layers } from 'lucide-react';

export default function DatasetSummary() {
  return (
    <section className="bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-xl text-center"><p className="section-label mb-3">Built with explainable AI</p><h2 className="text-3xl font-bold tracking-[-0.03em] text-navy-800 md:text-4xl">A focused model output, made easier to explore.</h2></div>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-7"><Brain className="mb-6 text-primary-600" size={22} /><h3 className="text-lg font-semibold text-navy-800">EfficientNet-B0</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">Generates a five-class diabetic retinopathy severity prediction from the uploaded image.</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7"><Eye className="mb-6 text-primary-600" size={22} /><h3 className="text-lg font-semibold text-navy-800">Grad-CAM overlay</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">Creates a visual explanation of image regions that influenced the model’s output.</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-7"><Layers className="mb-6 text-primary-600" size={22} /><h3 className="text-lg font-semibold text-navy-800">Five severity classes</h3><p className="mt-2 text-sm leading-relaxed text-slate-500">Results include No DR, Mild, Moderate, Severe, and Proliferative DR probabilities.</p></div>
        </div>
      </div>
    </section>
  );
}
