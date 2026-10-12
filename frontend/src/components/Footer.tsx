import { Link } from 'react-router-dom';
import { AlertCircle, Eye } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center gap-3 text-navy-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-800 text-white">
                <Eye size={17} />
              </span>
              <span className="font-bold">DR<span className="text-primary-600">-</span>Visualize</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Explore retinal image analysis with severity classification, probability scores, and visual explanations.
            </p>
          </div>
          <nav aria-label="Footer navigation" className="flex gap-6 text-sm font-medium text-slate-600">
            <Link to="/methodology" className="transition-colors hover:text-primary-600">Methodology</Link>
            <Link to="/about" className="transition-colors hover:text-primary-600">About</Link>
          </nav>
        </div>

        <div className="mt-8 flex items-start gap-2 border-t border-slate-200 pt-6 text-xs leading-relaxed text-slate-500">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0 text-amber-600" />
          <p>
            DR-Visualize is an experimental AI tool that has not been clinically validated. Its outputs are not medical diagnoses and should not be used independently for treatment decisions. Consult a qualified medical professional for clinical assessment.
          </p>
        </div>
      </div>
    </footer>
  );
}
