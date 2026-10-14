# DR-Visualize

**An Explainable Deep Learning Framework for Early Diabetic Retinopathy
Detection Using EfficientNet and Grad-CAM**

DR-Visualize is an academic MCA research project that classifies
diabetic retinopathy (DR) severity from retinal fundus photographs using
EfficientNet-B0 and provides visual explanations using Grad-CAM.

> **Research prototype only. This project has not been clinically
> validated and must not be used to diagnose disease or make treatment
> decisions.**

## Features

-   Five-class diabetic retinopathy severity classification.
-   EfficientNet-B0 deep learning model.
-   Grad-CAM heatmap and overlay generation.
-   FastAPI backend for image prediction.
-   React, TypeScript, and Vite frontend.
-   Probability distribution across all five classes.
-   Research metrics, training results, and visualizations.

## DR Severity Classes

    Class index Class
  ------------- ------------------
              0 No DR
              1 Mild DR
              2 Moderate DR
              3 Severe DR
              4 Proliferative DR

## Dataset

**APTOS 2019 Blindness Detection**

Dataset: [APTOS 2019 on
Kaggle](https://www.kaggle.com/competitions/aptos2019-blindness-detection/data)

The project uses the APTOS 2019 dataset with a fixed stratified split:

-   Training: 2,563 images
-   Validation: 549 images
-   Test: 550 images
-   Total: 3,662 labeled images

The raw dataset is not stored in this repository. Users who need the
dataset must obtain it through Kaggle and follow its access requirements
and terms.

## Methodology

### Image preprocessing

-   Resize images to 224 × 224 pixels.
-   Convert images to RGB.
-   Apply CLAHE-based contrast enhancement.
-   Apply the preprocessing implemented in the training pipeline.

### Data augmentation

The training workflow included horizontal flipping, random rotation,
random zoom, and random translation.

### Model architecture

**EfficientNet-B0 → Global Average Pooling → Dropout → Dense Softmax**

Transfer learning and fine-tuning experiments were conducted. The final
model was selected using validation performance before evaluation on the
held-out test split.

### Explainability

Grad-CAM generates a heatmap over the input image to visualize regions
influencing the model's prediction. These visualizations are explanation
aids and do not establish that the highlighted regions are medically
meaningful or that a prediction is correct.

## Final Test Results

Reported results from the project's held-out test evaluation:

  Metric                    Result
  ------------------- ------------
  Test accuracy         **77.82%**
  Macro ROC-AUC         **91.46%**
  Macro precision       **61.72%**
  Macro recall          **57.35%**
  Macro F1-score        **57.32%**
  Weighted F1-score     **76.41%**

### Per-class F1-score

  DR class             F1-score
  ------------------ ----------
  No DR                  96.12%
  Mild DR                55.65%
  Moderate DR            71.30%
  Severe DR              42.11%
  Proliferative DR       21.43%

Performance varies across severity classes, with weaker F1-score
performance for severe and proliferative DR. Overall accuracy alone does
not establish reliable performance for every class or on images from
other datasets.

## Technology Stack

### Machine learning

-   Python
-   TensorFlow / Keras
-   EfficientNet-B0
-   OpenCV
-   NumPy
-   Grad-CAM

### Backend

-   FastAPI
-   Uvicorn
-   Pillow
-   Requests

### Frontend

-   React
-   TypeScript
-   Vite
-   Tailwind CSS 4

### Tools

-   Google Colab
-   Kaggle
-   Git
-   GitHub

## Repository Structure

``` text
DR-Visualize/
├── backend/
│   ├── main.py
│   ├── model_loader.py
│   ├── gradcam.py
│   ├── image_validation.py
│   └── requirements.txt
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
│   ├── gradcam_samples_final/
│   └── eyepacs_5000/
├── tests/
│   ├── test_image_validation.py
│   ├── smoke/
│   │   ├── gradcam_smoke.py
│   │   └── model_load_smoke.py
│   ├── integration/
│   │   └── api_gradcam_smoke.py
│   └── artifacts/              # Generated locally; ignored by Git
├── DR_Visualize_Training.ipynb
├── README.md
└── .gitignore
```

## Run Locally

### Prerequisites

Install Python (a version compatible with `backend/requirements.txt`),
Node.js and npm, and Git. Internet access may be needed for the initial
model download if the backend-local model is absent.

The trained model is tracked at `model/dr_visualize_best.keras`. If
`backend/dr_visualize_best.keras` is absent, the backend model loader
downloads the model using a pinned GitHub URL. The backend-local copy is
ignored by Git.

Run the backend and frontend in **separate terminals**. The following
commands assume Windows PowerShell and that you start at the repository
root.

### 1. Set up and start the backend

``` powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
python -m pip install -r backend\requirements.txt
```

If the virtual environment already exists, activate it rather than
creating another one.

Start the backend from the repository root:

``` powershell
python -m uvicorn main:app --app-dir backend --reload
```

Endpoints: - API root: `http://127.0.0.1:8000/` - Health check:
`http://127.0.0.1:8000/health` - Interactive API docs:
`http://127.0.0.1:8000/docs` - Prediction endpoint: `POST /predict`

The prediction endpoint accepts a JPEG or PNG image and returns the
predicted class, class probabilities, confidence, and a Base64-encoded
Grad-CAM overlay.

### 2. Configure and start the frontend

In a second terminal at the repository root:

``` powershell
cd frontend
npm install
```

Create `frontend/.env` using `.env.example` as a reference:

``` env
VITE_API_BASE_URL=http://localhost:8000
VITE_USE_MOCK=false
```

Then start the frontend:

``` powershell
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.
Both frontend and backend must be running for real predictions.

### 3. Verify the frontend

From `frontend/`:

``` powershell
npm run build
npm run lint
npm run typecheck
```

These commands check the production build, lint rules, and TypeScript
compilation.

## Running Backend Tests

Run these commands from the **repository root** with the Python virtual
environment activated.

### 1. Image-validation unit tests

``` powershell
python -m unittest discover -s tests -p "test_*.py" -v
```

These tests cover valid image decoding and rejection of empty, corrupt,
blank, and unsupported-content-type inputs.

### 2. Model-loading smoke test

``` powershell
python tests\smoke\model_load_smoke.py
```

This checks model loading and reports its input shape, output shape, and
parameter count.

### 3. Grad-CAM generation smoke test

``` powershell
python tests\smoke\gradcam_smoke.py
```

This checks that predictions and a Grad-CAM heatmap can be generated. It
writes an overlay to `tests/artifacts/`.

### 4. API integration smoke test

Start the backend in another terminal from the repository root:

``` powershell
python -m uvicorn main:app --app-dir backend --reload
```

Keep it running, then run this from a second terminal at the repository
root:

``` powershell
python tests\integration\api_gradcam_smoke.py
```

This sends `backend/000c1434d8d7.png` to `POST /predict` and saves the
returned overlay to `tests/artifacts/`. The sample image is a local test
asset and must be present for this test to run.

Generated test artifacts are excluded from Git. Passing smoke tests
verifies technical functionality, not clinical validity.

## Results and Artifacts

The `results/` directory contains evaluation artifacts, including final
test metrics, confusion matrix, ROC-AUC curves, training history,
fine-tuning history, representative Grad-CAM visualizations, and
aggregate EyePACS evaluation results.

The trained model is stored at `model/dr_visualize_best.keras`.

## Limitations

-   This is an academic research prototype, not a clinically validated
    medical device.
-   Model performance differs across severity classes.
-   Predictions may be affected by image quality, camera
    characteristics, preprocessing, and dataset differences.
-   Grad-CAM does not guarantee that the model relies on
    disease-specific features.
-   APTOS test performance does not establish generalization to other
    datasets, populations, or clinical environments.
-   Confidence is a model output, not a medically calibrated
    probability.
-   Predictions must not be used independently for diagnosis or
    treatment decisions.

## Project Status

-   [x] Dataset preparation and stratified split
-   [x] EfficientNet-B0 training and fine-tuning
-   [x] Held-out test evaluation
-   [x] Grad-CAM explainability
-   [x] FastAPI prediction backend
-   [x] React frontend
-   [x] Frontend-backend integration
-   [x] Local production build
-   [x] Frontend lint and TypeScript checks
-   [x] Backend image-validation tests
-   [x] Model-loading smoke test
-   [x] Grad-CAM generation smoke test
-   [x] API integration smoke test
-   [x] Local dependency checks
-   [ ] Final repository professionalization and documentation review
-   [ ] Final decision on publishing or deploying the application

## External Evaluation: EyePACS

### Overview

The existing DR-Visualize EfficientNet-B0 model was evaluated without
retraining on a reproducibly selected sample of 5,000 images from the
EyePACS diabetic retinopathy dataset.

### Evaluation Methodology

-   **Dataset:** EyePACS diabetic retinopathy dataset.
-   **Sample size:** 5,000 images.
-   **Sampling:** Reproducible sampling with random seed 42, preserving
    the approximate natural class distribution.
-   **Model:** Existing DR-Visualize EfficientNet-B0 model.
-   **Retraining:** None.
-   **Preprocessing:** TensorFlow image decoding and resizing, followed
    by CLAHE contrast enhancement on the luminance channel.
-   **Input size:** 224 × 224 pixels.
-   **Classes:** No DR, Mild DR, Moderate DR, Severe DR, and
    Proliferative DR.

### Aggregate Results

  Metric                          Result
  ----------------------------- --------
  Accuracy                        65.48%
  Macro Precision                 29.85%
  Macro Recall                    25.78%
  Macro F1-score                  26.88%
  Weighted F1-score               62.40%
  Macro ROC-AUC (One-vs-Rest)     67.59%

### Per-Class Performance

  DR Grade             Precision   Recall   F1-score   Support
  ------------------ ----------- -------- ---------- ---------
  No DR                   75.48%   85.27%     80.08%     3,674
  Mild DR                  6.17%    5.75%      5.95%       348
  Moderate DR             23.31%   12.35%     16.15%       753
  Severe DR               19.67%    9.68%     12.97%       124
  Proliferative DR        24.62%   15.84%     19.28%       101

### Interpretation and Limitations

The model achieved 65.48% accuracy on this EyePACS sample, but
performance was substantially weaker for the four DR grades than for No
DR. Recall was low for Mild, Moderate, Severe, and Proliferative DR.

The difference between accuracy and macro F1-score highlights why
accuracy alone is insufficient for an imbalanced medical image
classification task. These results indicate limited external
generalization under the evaluated conditions and do not establish
clinical readiness.

This was a preliminary evaluation on a 5,000-image sample, not a
complete EyePACS evaluation, clinical validation study, or comparison
against ophthalmologist diagnoses. Preprocessing and dataset
characteristics may also affect results.

### Reproducibility and Result Files

Aggregate evaluation files included in the repository:

-   `results/eyepacs_5000/eyepacs_5000_metrics_summary.csv` ---
    aggregate metrics.
-   `results/eyepacs_5000/eyepacs_5000_classification_report.csv` ---
    per-class precision, recall, F1-score, and support.
-   `results/eyepacs_5000/eyepacs_5000_confusion_matrix.csv` ---
    confusion matrix.

The per-image prediction file and sampling manifest are retained locally
and are not included in the published aggregate results.

## Future Scope

Potential future work includes improving minority-class performance,
evaluating additional external datasets, and conducting more rigorous
calibration and robustness analyses. Retrieval-augmented generation
(RAG) may also be investigated to provide supplementary educational
context from carefully curated sources. **RAG is future scope only and
is not implemented in the current project.**

## Disclaimer

DR-Visualize is an experimental academic project. It has not been
clinically validated and is not intended to diagnose, prevent, monitor,
or treat any medical condition. Consult a qualified healthcare
professional for clinical assessment.
