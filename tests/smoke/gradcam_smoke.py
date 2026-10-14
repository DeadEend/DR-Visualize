from pathlib import Path
import sys

import numpy as np
from PIL import Image

ROOT_DIR = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT_DIR))

from backend.model_loader import load_model
from backend.gradcam import generate_gradcam, create_gradcam_overlay

model = load_model()

image = np.random.rand(1, 224, 224, 3).astype(np.float32) * 255.0
predictions = model.predict(image, verbose=0)
class_index = int(np.argmax(predictions[0]))

heatmap = generate_gradcam(model, image, class_index)

print("Grad-CAM smoke test completed.")
print("Predicted class index:", class_index)
print("Heatmap shape:", heatmap.shape)
print("Heatmap range:", float(heatmap.min()), float(heatmap.max()))

artifacts_dir = ROOT_DIR / "tests" / "artifacts"
artifacts_dir.mkdir(parents=True, exist_ok=True)

test_image = Image.new("RGB", (224, 224), color="gray")
overlay = create_gradcam_overlay(test_image, heatmap)
output_path = artifacts_dir / "gradcam_overlay_test.png"
overlay.save(output_path)

print("Overlay saved:", output_path)