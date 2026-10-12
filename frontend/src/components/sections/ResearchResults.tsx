import { AlertTriangle, Info } from 'lucide-react';
import { RECORDED_METRICS } from '@/types';

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-3 text-3xl font-bold tracking-[-0.03em] text-navy-800">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></div>;
}

export default function ResearchResults() {
  const { accuracy, macroF1, weightedF1, macroRocAuc, proliferativeF1, proliferativeRecall } = RECORDED_METRICS;
  return (
    <section id="performance" className="scroll-mt-20 bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><p className="section-label mb-3">Model performance</p><h2 className="text-3xl font-bold tracking-[-0.03em] text-navy-800 md:text-4xl">Recorded evaluation results.</h2></div><p className="max-w-sm text-sm leading-relaxed text-slate-500">Held-out evaluation on 550 test images. These figures are not clinical validation.</p></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4"><Metric label="Test accuracy" value={`${accuracy}%`} detail="Overall classification" /><Metric label="Macro F1-score" value={`${macroF1}%`} detail="Mean across classes" /><Metric label="Weighted F1-score" value={`${weightedF1}%`} detail="Support-weighted" /><Metric label="Macro ROC-AUC" value={`${macroRocAuc}%`} detail="One-vs-rest average" /></div>
        <div className="mt-5 flex flex-col gap-5 rounded-2xl border border-amber-200 bg-amber-50/70 p-6 md:flex-row md:items-center md:justify-between"><div className="flex items-start gap-3"><AlertTriangle size={19} className="mt-0.5 shrink-0 text-amber-700" /><div><h3 className="font-semibold text-navy-800">Known limitation: Proliferative DR</h3><p className="mt-1 text-sm leading-relaxed text-slate-600">The recorded results are weaker for the most severe class and should be interpreted carefully.</p></div></div><div className="flex gap-6 pl-8 md:pl-0"><div><p className="text-xs text-slate-500">F1-score</p><p className="mt-1 text-xl font-bold text-amber-700">{proliferativeF1}%</p></div><div><p className="text-xs text-slate-500">Recall</p><p className="mt-1 text-xl font-bold text-amber-700">{proliferativeRecall}%</p></div></div></div>
        <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-slate-400"><Info size={14} className="mt-0.5 shrink-0" />Accuracy, F1-score, and ROC-AUC provide complementary perspectives on model performance. These metrics should be interpreted together, alongside class-wise results and the model's limitations.</p>
      </div>
    </section>
  );
}
