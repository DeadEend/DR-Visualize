import { AlertCircle, FlaskConical, ScanSearch, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const cards = [
  {
    icon: FlaskConical,
    title: 'Research project',
    body: 'DR-Visualize is an experimental AI research project that applies deep learning to diabetic retinopathy detection. It explores how explainable AI techniques can make model predictions more transparent and accessible for educational purposes.',
  },
  {
    icon: ScanSearch,
    title: 'Scope',
    body: 'The tool accepts a single retinal fundus image and returns a five-class severity prediction, a confidence score, a full probability distribution, and a Grad-CAM visual explanation. It is designed for individual image exploration, not batch or clinical workflow use.',
  },
  {
    icon: ShieldAlert,
    title: 'Limitations',
    body: 'The model has not been clinically validated. Its predictions are not medical diagnoses and should not be used to make treatment decisions. Performance is weaker for the most severe class (Proliferative DR), and Grad-CAM highlights do not prove a prediction is correct.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-[72px]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <span className="section-label mb-3">About</span>
        <h1 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4 text-balance">
          About DR-Visualize
        </h1>
        <p className="text-base text-navy-600 max-w-2xl mb-10 text-pretty">
          An experimental AI tool for explainable diabetic retinopathy detection, built for research and educational exploration.
        </p>

        <div className="space-y-5">
          {cards.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                  <Icon size={21} />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-navy-800 mb-2">{title}</h2>
                  <p className="text-sm leading-relaxed text-slate-600">{body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <div className="rounded-xl bg-error-50/60 border border-error-200 px-5 py-4 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-error-600 shrink-0 mt-0.5" />
            <p className="text-xs text-navy-700 leading-relaxed">
              DR-Visualize is an experimental AI tool that has not been clinically validated. Its outputs are not medical diagnoses and should not be used independently for treatment decisions. Consult a qualified medical professional for clinical assessment.
            </p>
          </div>

          <div className="flex justify-center">
            <Link to="/analyze" className="btn-primary">
              <ScanSearch size={20} />
              Try the Analysis Tool
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
