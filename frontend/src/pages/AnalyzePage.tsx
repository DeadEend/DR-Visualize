import { useCallback, useRef, useState } from 'react';
import {
  Upload,
  X,
  ScanSearch,
  Loader2,
  AlertCircle,
  RotateCcw,
  ImageIcon,
  Eye,
  Info,
  TrendingUp,
} from 'lucide-react';
import {
  DR_CLASSES,
  DR_CLASS_COLORS,
  type PredictionResponse,
} from '@/types';
import { predictImage, buildGradCamImageUrl, isMockMode } from '@/services/api';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

type Status = 'idle' | 'analyzing' | 'success' | 'error';

interface AnalysisResult {
  response: PredictionResponse;
  imageUrl: string;
}

export default function AnalyzePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [apiError, setApiError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const mockMode = isMockMode();

  const validateFile = (file: File): string | null => {
    const isValidType = ACCEPTED_TYPES.includes(file.type);
    if (!isValidType) {
      return 'Please select a JPEG or PNG image.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'The selected image exceeds 10 MB. Please choose a smaller file.';
    }
    if (file.size === 0) {
      return 'The selected file appears to be empty. Please choose a valid image.';
    }
    return null;
  };

  const handleFileSelect = useCallback(
    (file: File) => {
      const error = validateFile(file);
      if (error) {
        setValidationError(error);
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setValidationError(null);
      setSelectedFile(file);
      setResult(null);
      setApiError(null);
      setStatus('idle');

      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    },
    [previewUrl],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect],
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setValidationError(null);
    setApiError(null);
    setResult(null);
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [previewUrl]);

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setStatus('analyzing');
    setApiError(null);
    setResult(null);

    try {
      const response = await predictImage(selectedFile);
      const gradcamUrl = buildGradCamImageUrl(
        response.gradcam_overlay,
        response.gradcam_format,
      );
      setResult({ response, imageUrl: gradcamUrl });
      setStatus('success');
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.';
      setApiError(message);
      setStatus('error');
    }
  };

  const formatPercent = (value: number) => `${(value * 100).toFixed(2)}%`;

  const sortedClasses = result
    ? [...DR_CLASSES].sort(
        (a, b) => result.response.probabilities[b] - result.response.probabilities[a],
      )
    : [...DR_CLASSES];

  return (
    <div className="min-h-screen bg-slate-50 pt-[72px]">
      {mockMode && (
        <div className="mx-auto max-w-5xl px-4 pt-5 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
            Sample data mode is enabled for development. Results are not from the live model.
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-10">
          <span className="section-label mb-3">Analyze</span>
          <h1 className="text-3xl md:text-4xl font-bold text-navy-800 mb-3 text-balance">
            Explore a retinal image
          </h1>
          <p className="text-base text-navy-600 max-w-2xl mx-auto text-pretty">
            Upload a retinal fundus image to view a severity classification, probability distribution, and Grad-CAM explanation.
          </p>
        </div>

        {status !== 'success' && (
          <div className="card p-6 md:p-10 mb-6">
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 ${
                isDragging
                  ? 'border-primary-500 bg-primary-50'
                  : previewUrl
                    ? 'border-navy-200 bg-navy-50/50'
                    : 'border-navy-200 bg-navy-50/30 hover:border-primary-300 hover:bg-primary-50/30'
              }`}
            >
              {!previewUrl ? (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-12 md:py-16 px-6 flex flex-col items-center justify-center text-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-400 rounded-2xl"
                  aria-label="Click to select an image file"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600 mb-5">
                    <Upload size={28} />
                  </div>
                  <p className="text-base font-semibold text-navy-800 mb-1.5">
                    Drag and drop an image here
                  </p>
                  <p className="text-sm text-navy-500 mb-4">
                    or click to browse your files
                  </p>
                  <p className="text-xs text-navy-400">
                    JPEG or PNG, maximum 10 MB
                  </p>
                </button>
              ) : (
                <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="shrink-0">
                    <img
                      src={previewUrl}
                      alt="Selected retinal fundus image preview"
                      className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-xl border border-navy-200"
                    />
                  </div>
                  <div className="min-w-0 flex-1 text-center sm:text-left">
                    <p className="text-sm font-semibold text-navy-800 mb-1 truncate max-w-xs">
                      {selectedFile?.name}
                    </p>
                    <p className="text-xs text-navy-500 mb-4">
                      {selectedFile && `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`}
                      {selectedFile && ` · ${selectedFile.type}`}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-ghost text-sm py-2 px-3"
                      >
                        <RotateCcw size={15} />
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="btn-ghost text-sm py-2 px-3 text-error-600 hover:bg-error-50"
                      >
                        <X size={15} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
              aria-label="Select image file"
            />

            {validationError && (
              <div className="mt-4 flex items-start gap-2.5 p-4 rounded-xl bg-error-50 border border-error-200 animate-fade-in">
                <AlertCircle size={18} className="text-error-600 shrink-0 mt-0.5" />
                <p className="text-sm text-error-700">{validationError}</p>
              </div>
            )}

            {apiError && status === 'error' && (
              <div className="mt-4 flex items-start gap-2.5 p-4 rounded-xl bg-error-50 border border-error-200 animate-fade-in">
                <AlertCircle size={18} className="text-error-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-error-700 mb-0.5">
                    Analysis Failed
                  </p>
                  <p className="text-sm text-error-600">{apiError}</p>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 justify-center">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!selectedFile || status === 'analyzing'}
                className="btn-primary w-full sm:w-auto"
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ScanSearch size={20} />
                    Analyze Image
                  </>
                )}
              </button>
              {selectedFile && status !== 'analyzing' && (
                <button type="button" onClick={handleReset} className="btn-secondary w-full sm:w-auto">
                  <X size={18} />
                  Clear
                </button>
              )}
            </div>

            {status === 'analyzing' && (
              <p className="mt-4 text-center text-sm text-navy-500 animate-fade-in">
                The first analysis may take longer while the model loads. Please wait...
              </p>
            )}
          </div>
        )}

        {status === 'success' && result && (
          <div className="animate-fade-in-up space-y-6">
            {mockMode && (
              <div className="rounded-xl bg-warning-50 border border-warning-200 px-4 py-3 flex items-center gap-2.5">
                <AlertCircle size={18} className="text-warning-600 shrink-0" />
                <p className="text-sm text-warning-700 font-medium">
                  Showing sample data — this is not a real model prediction.
                </p>
              </div>
            )}

            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                  style={{ backgroundColor: DR_CLASS_COLORS[result.response.predicted_class] }}
                >
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-sm text-navy-500 font-medium">Predicted Severity Class</p>
                  <h2 className="text-2xl font-bold text-navy-800">
                    {result.response.predicted_class}
                  </h2>
                </div>
              </div>

              <div className="grid sm:grid-cols-1 gap-4 mb-6">
                <div className="rounded-xl bg-navy-50 border border-navy-100 p-5">
                  <p className="text-xs text-navy-500 mb-1.5 font-medium uppercase tracking-wider">
                    Model Confidence
                  </p>
                  <p className="text-3xl font-bold text-primary-600">
                    {formatPercent(result.response.confidence)}
                  </p>
                  <p className="text-xs text-navy-400 mt-1.5">
                    Probability assigned to the predicted class
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-navy-800 mb-4">
                  Probability Distribution — All Five Classes
                </h3>
                <div className="space-y-3">
                  {sortedClasses.map((className) => {
                    const prob = result.response.probabilities[className];
                    const isPredicted = className === result.response.predicted_class;
                    const widthPercent = (prob * 100).toFixed(2);
                    return (
                      <div key={className}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`text-sm font-medium ${
                              isPredicted ? 'text-navy-900' : 'text-navy-600'
                            }`}
                          >
                            {className}
                            {isPredicted && (
                              <span className="ml-2 text-2xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded-sm">
                                Predicted
                              </span>
                            )}
                          </span>
                          <span
                            className={`text-sm font-semibold tabular-nums ${
                              isPredicted ? 'text-navy-900' : 'text-navy-500'
                            }`}
                          >
                            {formatPercent(prob)}
                          </span>
                        </div>
                        <div className="h-2.5 rounded-full bg-navy-100 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${widthPercent}%`,
                              backgroundColor: DR_CLASS_COLORS[className],
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="card p-6 md:p-8">
              <h3 className="text-lg font-semibold text-navy-800 mb-5">
                Original Image & Grad-CAM Overlay
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <ImageIcon size={16} className="text-navy-400" />
                    <span className="text-sm font-medium text-navy-600">Original Image</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-navy-200 bg-navy-50 aspect-square">
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Original uploaded retinal fundus image"
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Eye size={16} className="text-navy-400" />
                    <span className="text-sm font-medium text-navy-600">Grad-CAM Overlay</span>
                  </div>
                  <div className="rounded-xl overflow-hidden border border-navy-200 bg-navy-50 aspect-square">
                    <img
                      src={result.imageUrl}
                      alt="Grad-CAM visualization showing regions that influenced the model's prediction"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-start gap-2.5 p-4 rounded-xl bg-primary-50/50 border border-primary-100">
                <Info size={16} className="text-primary-600 shrink-0 mt-0.5" />
                <p className="text-sm text-navy-600 leading-relaxed">
                  Warmer colours indicate image regions that influenced the model's prediction.
                  This visualization is an explanation aid and does not confirm that the
                  prediction is correct.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-error-50/60 border border-error-200 px-5 py-4 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-error-600 shrink-0 mt-0.5" />
              <p className="text-xs text-navy-700 leading-relaxed">
                DR-Visualize is an experimental AI tool that has not been clinically validated. Its outputs are not medical diagnoses and should not be used independently for treatment decisions. Consult a qualified medical professional for clinical assessment.
              </p>
            </div>

            <div className="flex justify-center">
              <button type="button" onClick={handleReset} className="btn-primary">
                <RotateCcw size={20} />
                Analyze Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
