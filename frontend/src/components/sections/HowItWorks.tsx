import { Fragment } from 'react';
import { ArrowDown, ArrowRight, Brain, Eye, Upload } from 'lucide-react';

const steps = [
  { icon: Upload, title: 'Upload an image', description: 'Choose a JPEG or PNG retinal fundus image.' },
  { icon: Brain, title: 'Generate a prediction', description: 'The model returns a severity class and confidence.' },
  { icon: Eye, title: 'Explore the output', description: 'Review probabilities and the Grad-CAM overlay.' },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-slate-50 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <p className="section-label mb-3">How it works</p>
          <h2 className="text-3xl font-bold tracking-[-0.03em] text-navy-800 md:text-4xl">
            From image to insight in three steps.
          </h2>
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <Fragment key={title}>
              <div className="rounded-2xl border border-slate-200 bg-white p-7">
                <div className="mb-7 flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-800 text-white">
                    <Icon size={20} />
                  </div>
                  <span className="text-sm font-semibold text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-navy-800">{title}</h3>
                <p className="text-sm leading-relaxed text-slate-500">{description}</p>
              </div>

              {index < steps.length - 1 && (
                <>
                  <div className="hidden items-center justify-center px-1 lg:flex" aria-hidden="true">
                    <ArrowRight size={20} className="text-primary-300" />
                  </div>
                  <div className="flex items-center justify-center py-1 lg:hidden" aria-hidden="true">
                    <ArrowDown size={20} className="text-primary-300" />
                  </div>
                </>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
