export interface PredictionResponse {
  predicted_class: string;
  class_index: number;
  confidence: number;
  probabilities: Record<string, number>;
  gradcam_overlay: string;
  gradcam_format: string;
}

export const DR_CLASSES = [
  'No DR',
  'Mild DR',
  'Moderate DR',
  'Severe DR',
  'Proliferative DR',
] as const;

export const DR_CLASS_COLORS: Record<string, string> = {
  'No DR': '#22c55e',
  'Mild DR': '#eab308',
  'Moderate DR': '#f59e0b',
  'Severe DR': '#f97316',
  'Proliferative DR': '#ef4444',
};

export const RECORDED_METRICS = {
  accuracy: 77.82,
  macroF1: 57.32,
  weightedF1: 76.41,
  macroRocAuc: 91.465,
  proliferativeF1: 21.43,
  proliferativeRecall: 13.64,
} as const;

export const DATASET_INFO = {
  name: 'APTOS 2019',
  totalImages: 3662,
  training: 2563,
  validation: 549,
  testing: 550,
} as const;

export const MODEL_INFO = {
  architecture: 'EfficientNet-B0',
  inputSize: '224 × 224 × 3',
  numClasses: 5,
  parameters: 4055976,
  gradcamLayer: 'top_activation',
  featureMapSize: '7 × 7 × 1280',
} as const;
