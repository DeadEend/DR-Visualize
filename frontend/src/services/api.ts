
import type { PredictionResponse } from '@/types';
import { DR_CLASSES } from '@/types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const MOCK_DELAY_MS = 1800;

function generateMockGradCAM(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <defs>
      <radialGradient id="heatmap" cx="45%" cy="50%" r="60%">
        <stop offset="0%" stop-color="#ef4444" stop-opacity="0.85"/>
        <stop offset="25%" stop-color="#f97316" stop-opacity="0.65"/>
        <stop offset="50%" stop-color="#eab308" stop-opacity="0.45"/>
        <stop offset="75%" stop-color="#22c55e" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="#3b82f6" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="hotspot2" cx="70%" cy="35%" r="30%">
        <stop offset="0%" stop-color="#f97316" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#f97316" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="512" height="512" fill="#1a1a2e" opacity="0.3"/>
    <rect width="512" height="512" fill="url(#heatmap)"/>
    <rect width="512" height="512" fill="url(#hotspot2)"/>
  </svg>`;

  return btoa(svg);
}

function getMockResponse(): PredictionResponse {
  const probabilities: Record<string, number> = {
    'No DR': 0.0085,
    'Mild DR': 0.0237,
    'Moderate DR': 0.7392,
    'Severe DR': 0.0404,
    'Proliferative DR': 0.1882,
  };

  return {
    predicted_class: 'Moderate DR',
    class_index: 2,
    confidence: 0.7392,
    probabilities,
    gradcam_overlay: generateMockGradCAM(),
    gradcam_format: 'image/svg+xml',
  };
}

function validateResponse(data: unknown): PredictionResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid response: expected an object');
  }

  const obj = data as Record<string, unknown>;

  if (typeof obj.predicted_class !== 'string') {
    throw new Error('Invalid response: missing or invalid predicted_class');
  }

  if (typeof obj.class_index !== 'number') {
    throw new Error('Invalid response: missing or invalid class_index');
  }

  if (typeof obj.confidence !== 'number') {
    throw new Error('Invalid response: missing or invalid confidence');
  }

  if (!obj.probabilities || typeof obj.probabilities !== 'object') {
    throw new Error('Invalid response: missing or invalid probabilities');
  }

  if (typeof obj.gradcam_overlay !== 'string') {
    throw new Error('Invalid response: missing or invalid gradcam_overlay');
  }

  if (typeof obj.gradcam_format !== 'string') {
    throw new Error('Invalid response: missing or invalid gradcam_format');
  }

  const probs = obj.probabilities as Record<string, unknown>;

  for (const cls of DR_CLASSES) {
    if (typeof probs[cls] !== 'number') {
      throw new Error(
        `Invalid response: missing probability for class "${cls}"`
      );
    }
  }

  return obj as unknown as PredictionResponse;
}

async function getErrorDetail(response: Response): Promise<string | undefined> {
  try {
    const errorData: unknown = await response.json();

    if (
      typeof errorData === 'object' &&
      errorData !== null &&
      'detail' in errorData &&
      typeof errorData.detail === 'string'
    ) {
      return errorData.detail;
    }
  } catch {
    // The response may not contain valid JSON.
  }

  return undefined;
}

export async function predictImage(
  file: File
): Promise<PredictionResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
    return getMockResponse();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await getErrorDetail(response);

      switch (response.status) {
        case 400:
          throw new Error(
            detail ||
              'The image could not be processed. Please upload a valid JPEG or PNG image.'
          );

        case 413:
          throw new Error(
            detail || 'The image exceeds the 10 MB upload limit.'
          );

        case 415:
        case 422:
          throw new Error(
            detail ||
              'The uploaded file format was not accepted. Please use JPEG or PNG.'
          );

        case 503:
          throw new Error(
            detail ||
              'The analysis service is temporarily unavailable. Please try again shortly.'
          );

        default:
          throw new Error(
            detail ||
              'An unexpected error occurred during analysis. Please try again.'
          );
      }
    }

    const data: unknown = await response.json();
    return validateResponse(data);
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error(
        'The analysis timed out. The model may still be loading — please try again.'
      );
    }

    if (err instanceof TypeError) {
      throw new Error(
        'Could not connect to the analysis service. Please verify the backend is running.'
      );
    }

    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function buildGradCamImageUrl(
  overlay: string,
  format: string
): string {
  return `data:${format};base64,${overlay}`;
}

export function isMockMode(): boolean {
  return USE_MOCK;
}
