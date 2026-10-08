# DR-Visualize

## Project Title
An Explainable Deep Learning Framework for Early Diabetic Retinopathy Detection Using EfficientNet and Grad-CAM

## About
DR-Visualize is an academic MCA research project that classifies diabetic retinopathy severity from retinal fundus images using EfficientNet-B0 and provides visual explanations using Grad-CAM.

The project uses a five-class classification approach:
- No DR
- Mild DR
- Moderate DR
- Severe DR
- Proliferative DR

> **Research prototype — not a clinical diagnostic system.**

## Dataset
**APTOS 2019 Blindness Detection**

[Kaggle dataset](https://www.kaggle.com/competitions/aptos2019-blindness-detection/data)

The dataset contains 3,662 labeled training images.

A fixed stratified split was used:

- Training: 2,563 images
- Validation: 549 images
- Test: 550 images

The full raw dataset is not stored in this repository.

## Methodology

### Preprocessing
- Image resizing to 224 × 224
- RGB conversion
- CLAHE-based contrast enhancement
- Pixel preprocessing

### Data Augmentation
- Horizontal flipping
- Random rotation
- Random zoom
- Random translation

### Model
**EfficientNet-B0 → Global Average Pooling → Dropout → Dense Softmax**

Transfer learning was followed by fine-tuning experiments. The final model was selected using validation performance before evaluation on the untouched test set.

### Explainability
Grad-CAM is used to generate heatmaps showing the image regions contributing to the model's prediction.

## Final Test Results

| Metric | Result |
|---|---:|
| Test Accuracy | **77.82%** |
| Macro ROC-AUC | **91.46%** |
| Macro Precision | **61.72%** |
| Macro Recall | **57.35%** |
| Macro F1-score | **57.32%** |

### Per-Class F1-score

| Class | F1-score |
|---|---:|
| No DR | 96.12% |
| Mild DR | 55.65% |
| Moderate DR | 71.30% |
| Severe DR | 42.11% |
| Proliferative DR | 21.43% |

## Results

The repository contains:

- Final trained EfficientNet-B0 model
- Final test metrics
- Classification results
- Confusion matrix
- ROC-AUC curves
- Training history
- Fine-tuning history
- Five representative Grad-CAM visualizations

## Repository Structure

```text
DR-Visualize/
├── DR_Visualize_Training.ipynb
├── README.md
├── model/
│   └── dr_visualize_best.keras
└── results/
    ├── final_test_metrics.csv
    ├── final_results_summary.json
    ├── confusion_matrix.png
    ├── roc_auc_curves.png
    ├── training_history.csv
    ├── finetuning_history.csv
    └── gradcam_samples_final/

Technology Stack
- Python
- TensorFlow / Keras
- OpenCV
- Scikit-learn
- EfficientNet-B0
- Grad-CAM
- Google Colab
- Kaggle
- Git
- GitHub

Project Status
Part 1 — Model Development & Evaluation
- [x] APTOS 2019 dataset verification
- [x] Dataset preprocessing
- [x] Stratified train/validation/test split
- [x] EfficientNet-B0 training
- [x] Fine-tuning experiments
- [x] Final model selection
- [x] Test evaluation
- [x] Confusion matrix
- [x] ROC-AUC analysis
- [x] Grad-CAM explainability
- [x] GitHub backup

Upcoming
- [ ] Backend prediction API
- [ ] Frontend application
- [ ] Backend–frontend integration
- [ ] Deployment
- [ ] Final project documentation

Research Disclaimer
DR-Visualize is an academic research prototype. It has not been clinically validated and should not be used for medical diagnosis or treatment decisions.
