import { Brain, BarChart3, Database, Eye, Layers, Image as ImageIcon } from 'lucide-react';
import { DATASET_INFO, MODEL_INFO, RECORDED_METRICS } from '@/types';

const sections = [
  {
    icon: Database,
    title: 'Dataset — APTOS 2019',
    body: `The model was trained on the APTOS 2019 Blindness Detection dataset, containing ${DATASET_INFO.totalImages.toLocaleString()} retinal fundus images split into ${DATASET_INFO.training} training, ${DATASET_INFO.validation} validation, and ${DATASET_INFO.testing} testing images. Images were resized to ${MODEL_INFO.inputSize} for input to the network.`,
  },
  {
    icon: Brain,
    title: 'Model architecture — EfficientNet-B0',
    body: `The classifier uses an EfficientNet-B0 backbone with ${MODEL_INFO.parameters.toLocaleString()} parameters, producing a 5-class severity prediction. The final dense layer outputs a probability distribution across all five DR severity levels.`,
  },
  {
    icon: ImageIcon,
    title: 'Image preprocessing',
    body: 'Uploaded images are resized to 224×224×3 and normalized to match the training pipeline. No additional augmentation is applied at inference time — the model receives the image as-is after resizing.',
  },
  {
    icon: BarChart3,
    title: 'Evaluation metrics',
    body: `Model performance was measured on the ${DATASET_INFO.testing}-image held-out test set using accuracy (${RECORDED_METRICS.accuracy}%), macro F1-score (${RECORDED_METRICS.macroF1}%), weighted F1-score (${RECORDED_METRICS.weightedF1}%), and macro ROC-AUC (${RECORDED_METRICS.macroRocAuc}%). These metrics provide complementary perspectives and should be interpreted together alongside class-wise results.`,
  },
  {
    icon: Eye,
    title: 'Grad-CAM explanation',
    body: `A Grad-CAM heatmap is generated from the "${MODEL_INFO.gradcamLayer}" feature map (${MODEL_INFO.featureMapSize}) to highlight image regions that most influenced the model's prediction. Warmer colours indicate higher contribution. This is an explanation aid and does not confirm the prediction is correct.`,
  },
  {
    icon: Layers,
    title: 'Five severity classes',
    body: 'The model predicts one of five diabetic retinopathy severity levels: No DR, Mild DR, Moderate DR, Severe DR, and Proliferative DR. Each prediction includes a confidence score and a full probability distribution across all five classes.',
  },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-[72px]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <span className="section-label mb-3">Methodology</span>
        <h1 className="text-3xl md:text-4xl font-bold text-navy-800 mb-4 text-balance">
          How DR-Visualize works
        </h1>
        <p className="text-base text-navy-600 max-w-2xl mb-10 text-pretty">
          An overview of the dataset, model architecture, preprocessing pipeline, evaluation metrics, and Grad-CAM explanation workflow behind DR-Visualize.
        </p>

        <div className="space-y-5">
          {sections.map(({ icon: Icon, title, body }) => (
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

        <div className="mt-8 rounded-xl bg-error-50/60 border border-error-200 px-5 py-4 flex items-start gap-2.5">
          <BarChart3 size={16} className="text-error-600 shrink-0 mt-0.5" />
          <p className="text-xs text-navy-700 leading-relaxed">
            These figures are recorded evaluation results, not clinical validation. The model has not been approved for diagnostic use.
          </p>
        </div>
      </div>
    </div>
  );
}
