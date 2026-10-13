# DR-Visualize

**An Explainable Deep Learning Framework for Early Diabetic Retinopathy Detection Using EfficientNet and Grad-CAM**

DR-Visualize is an academic MCA research project that classifies diabetic retinopathy (DR) severity from retinal fundus photographs using EfficientNet-B0 and provides visual explanations using Grad-CAM.

> **Research prototype only. This project has not been clinically validated and must not be used to diagnose disease or make treatment decisions.**

## Features

- Five-class diabetic retinopathy severity classification.
- EfficientNet-B0 deep learning model.
- Grad-CAM heatmap and overlay generation.
- FastAPI backend for image prediction.
- React, TypeScript, and Vite frontend.
- Probability distribution across all five classes.
- Research metrics, training results, and visualizations.

## DR Severity Classes

| Class index | Class |
|---:|---|
| 0 | No DR |
| 1 | Mild DR |
| 2 | Moderate DR |
| 3 | Severe DR |
| 4 | Proliferative DR |

## Dataset

**APTOS 2019 Blindness Detection**

Dataset: [APTOS 2019 on Kaggle](https://www.kaggle.com/competitions/aptos2019-blindness-detection/data)

The project uses the APTOS 2019 dataset with a fixed stratified split:

- Training: 2,563 images
- Validation: 549 images
- Test: 550 images
- Total: 3,662 labeled images

The raw dataset is not stored in this repository. Users who need the dataset must obtain it through Kaggle and follow its access requirements and terms.

## Methodology

### Image preprocessing

- Resize images to 224 × 224 pixels.
- Convert images to RGB.
- Apply CLAHE-based contrast enhancement.
- Apply the preprocessing implemented in the training pipeline.

### Data augmentation

The training workflow included:

- Horizontal flipping.
- Random rotation.
- Random zoom.
- Random translation.

### Model architecture

**EfficientNet-B0 → Global Average Pooling → Dropout → Dense Softmax**

Transfer learning and fine-tuning experiments were conducted. The final model was selected using validation performance before evaluation on the held-out test split.

### Explainability

Grad-CAM generates a heatmap over the input image to visualize regions influencing the model's prediction. These visualizations are explanation aids and do not establish that the highlighted regions are medically meaningful or that a prediction is correct.

## Final Test Results

Reported results from the project's held-out test evaluation:

| Metric | Result |
|---|---:|
| Test accuracy | **77.82%** |
| Macro ROC-AUC | **91.46%** |
| Macro precision | **61.72%** |
| Macro recall | **57.35%** |
| Macro F1-score | **57.32%** |
| Weighted F1-score | **76.41%** |

### Per-class F1-score

| DR class | F1-score |
|---|---:|
| No DR | 96.12% |
| Mild DR | 55.65% |
| Moderate DR | 71.30% |
| Severe DR | 42.11% |
| Proliferative DR | 21.43% |

Performance varies across severity classes, with weaker F1-score performance for severe and proliferative DR. Overall accuracy alone does not establish reliable performance for every class or on images from other datasets.

## Technology Stack

### Machine learning

- Python
- TensorFlow / Keras
- EfficientNet-B0
- OpenCV
- NumPy
- Grad-CAM

### Backend

- FastAPI
- Uvicorn
- Pillow
- Requests

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS 4

### Tools

- Google Colab
- Kaggle
- Git
- GitHub

## Repository Structure

```text
DR-Visualize/
├── backend/
│   ├── main.py
│   ├── model_loader.py
│   ├── gradcam.py
│   ├── requirements.txt
│   └── test_*.py
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   └── .env.example
├── model/
│   └── dr_visualize_best.keras
├── results/
│   ├── final_results_summary.json
│   ├── final_test_metrics.csv
│   ├── confusion_matrix.png
│   ├── roc_auc_curves.png
│   ├── training_history.csv
│   ├── finetuning_history.csv
│   └── gradcam_samples_final/
├── DR_Visualize_Training.ipynb
├── README.md
└── .gitignore
```

## Run Locally

### Prerequisites

Install the following:

- Python.
- Node.js and npm.
- Git.
- An internet connection for the initial model download if the model is not already available locally.

The trained model is tracked in the repository at `model/dr_visualize_best.keras`. The backend's model loader uses a configured GitHub URL and downloads the model to `backend/dr_visualize_best.keras` if that local file does not already exist.

Run the backend and frontend in **separate terminals**.

### 1. Start the backend

From the repository root, create and activate a Python virtual environment if you do not already have one.

For Windows PowerShell:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

If PowerShell blocks virtual-environment activation, follow the appropriate Python environment activation guidance for your system rather than changing system security settings unnecessarily.

Start the backend:

```powershell
python -m uvicorn main:app --reload
```

The API should be available at:

- API root: `http://127.0.0.1:8000/`
- Health check: `http://127.0.0.1:8000/health`
- Interactive API documentation: `http://127.0.0.1:8000/docs`
- Prediction endpoint: `POST /predict`

The prediction endpoint accepts a JPEG or PNG image. The backend returns the predicted class, class probabilities, confidence, and a Base64-encoded Grad-CAM overlay.

On first startup, the backend may need internet access to download the model if the local backend model file is absent.

### 2. Configure and start the frontend

Open a second terminal at the repository root and run:

```powershell
cd frontend
npm install
```

Create a local `.env` file in `frontend/` using `.env.example` as a reference.

For the local development setup, use:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK=false
```

Start the frontend:

```powershell
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

Both the frontend and backend must be running for real predictions. The frontend uses the configured API base URL to send uploaded images to FastAPI.

### 3. Verify the frontend

From the `frontend/` directory, run:

```powershell
npm run build
npm run lint
npx tsc -b
```

These commands check the production build, lint rules, and TypeScript compilation.

### 4. Test the backend API

With the backend running, open:

`http://127.0.0.1:8000/docs`

Use the interactive documentation to inspect the available endpoints. The repository also contains standalone test scripts in `backend/` for API prediction, Grad-CAM generation, and model loading. Some scripts require local test files and a working model download.

## Results and Artifacts

The `results/` directory contains the project's evaluation artifacts, including:

- Final test metrics.
- Confusion matrix.
- ROC-AUC curves.
- Training history.
- Fine-tuning history.
- Representative Grad-CAM visualizations.

The trained model is stored in `model/dr_visualize_best.keras`.

## Limitations

- This is an academic research prototype, not a clinically validated medical device.
- Model performance differs across severity classes.
- Predictions may be affected by image quality, camera characteristics, preprocessing, and differences between datasets.
- Grad-CAM visualizations do not guarantee that the model relies on disease-specific features.
- Evaluation on the APTOS 2019 test split does not establish generalization to other datasets, populations, or clinical environments.
- The displayed confidence is a model output and should not be interpreted as a medically calibrated probability.
- Predictions must not be used independently for diagnosis or treatment decisions.

## Project Status

- [x] Dataset preparation and stratified split
- [x] EfficientNet-B0 training and fine-tuning
- [x] Held-out test evaluation
- [x] Grad-CAM explainability
- [x] FastAPI prediction backend
- [x] React frontend
- [x] Frontend-backend integration
- [x] Local production build
- [x] Frontend lint and TypeScript checks
- [x] Backend API prediction test
- [x] Local dependency checks
- [ ] Final repository professionalization and documentation review
- [ ] Final decision on publishing or deploying the application

## External Evaluation: EyePACS

### Overview

The existing DR-Visualize EfficientNet-B0 model was evaluated on a reproducibly selected sample of 5,000 images from the EyePACS diabetic retinopathy dataset. The model was evaluated without retraining.

This experiment provides an initial assessment of how the model performs on an external dataset rather than only on the APTOS 2019 dataset used during development.

### Evaluation Methodology

- **Dataset:** EyePACS diabetic retinopathy dataset.
- **Sample size:** 5,000 images.
- **Sampling:** Reproducible sampling using random seed 42, preserving the dataset's approximate natural class distribution.
- **Model:** Existing DR-Visualize EfficientNet-B0 model.
- **Retraining:** None.
- **Preprocessing:** TensorFlow image decoding and resizing, followed by CLAHE contrast enhancement on the luminance channel.
- **Input size:** 224 × 224 pixels.
- **Classes:** No DR, Mild DR, Moderate DR, Severe DR, and Proliferative DR.

### Aggregate Results

| Metric | Result |
|---|---:|
| Accuracy | 65.48% |
| Macro Precision | 29.85% |
| Macro Recall | 25.78% |
| Macro F1-score | 26.88% |
| Weighted F1-score | 62.40% |
| Macro ROC-AUC (One-vs-Rest) | 67.59% |

### Per-Class Performance

| DR Grade | Precision | Recall | F1-score | Support |
|---|---:|---:|---:|---:|
| No DR | 75.48% | 85.27% | 80.08% | 3,674 |
| Mild DR | 6.17% | 5.75% | 5.95% | 348 |
| Moderate DR | 23.31% | 12.35% | 16.15% | 753 |
| Severe DR | 19.67% | 9.68% | 12.97% | 124 |
| Proliferative DR | 24.62% | 15.84% | 19.28% | 101 |

### Interpretation and Limitations

The model achieved 65.48% accuracy on this EyePACS sample, but its performance was substantially weaker for the four diabetic retinopathy grades than for the No DR class. In particular, recall was low for Mild, Moderate, Severe, and Proliferative DR.

The difference between accuracy and macro F1-score highlights why accuracy alone is insufficient for evaluating a class-imbalanced medical image classification task. The results indicate limited external generalization under the evaluated conditions and should not be interpreted as evidence of clinical readiness.

This was a preliminary external evaluation on a 5,000-image sample, not a complete evaluation of the EyePACS dataset, a clinical validation study, or a comparison against ophthalmologist diagnoses. Preprocessing differences and dataset characteristics may also influence the results. Further investigation is required before drawing conclusions about clinical use.

### Reproducibility and Result Files

The following aggregate evaluation files are included in this repository:

- `results/eyepacs_5000/eyepacs_5000_metrics_summary.csv` — aggregate metrics.
- `results/eyepacs_5000/eyepacs_5000_classification_report.csv` — per-class precision, recall, F1-score, and support.
- `results/eyepacs_5000/eyepacs_5000_confusion_matrix.csv` — confusion matrix.

The per-image prediction file and sampling manifest are retained locally and are not included in the published aggregate results.

**Important:** DR-Visualize is a research prototype for diabetic retinopathy classification and visualization. It is not a substitute for professional eye examination, diagnosis, or medical advice.


## Disclaimer

DR-Visualize is an experimental academic project. It has not been clinically validated and is not intended to diagnose, prevent, monitor, or treat any medical condition. Consult a qualified healthcare professional for clinical assessment.
