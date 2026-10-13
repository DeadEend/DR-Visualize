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

## Disclaimer

DR-Visualize is an experimental academic project. It has not been clinically validated and is not intended to diagnose, prevent, monitor, or treat any medical condition. Consult a qualified healthcare professional for clinical assessment.
