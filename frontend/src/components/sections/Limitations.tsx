import { AlertCircle, Eye, ShieldAlert } from 'lucide-react';

export default function Limitations() {
  return (
    <section id="limitations" className="scroll-mt-20 bg-white py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-8">
          <div className="flex items-start gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-primary-600 shadow-soft"><ShieldAlert size={20} /></div><div><h2 className="text-lg font-semibold text-navy-800">Use with care</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">DR-Visualize is an experimental AI tool that has not been clinically validated. Its outputs are not medical diagnoses and should not be used independently for treatment decisions. Consult a qualified medical professional for clinical assessment.</p></div></div>
          <div className="mt-6 grid gap-4 border-t border-slate-200 pt-6 sm:grid-cols-2"><div className="flex items-start gap-2 text-sm text-slate-500"><AlertCircle size={16} className="mt-0.5 shrink-0 text-amber-600" /><span>Model confidence is not clinical certainty.</span></div><div className="flex items-start gap-2 text-sm text-slate-500"><Eye size={16} className="mt-0.5 shrink-0 text-primary-600" /><span>Grad-CAM does not prove a prediction is correct.</span></div></div>
        </div>
      </div>
    </section>
  );
}
