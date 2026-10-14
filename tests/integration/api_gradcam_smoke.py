import base64
from pathlib import Path

import requests

ROOT_DIR = Path(__file__).resolve().parents[2]
IMAGE_PATH = ROOT_DIR / "backend" / "000c1434d8d7.png"
ARTIFACTS_DIR = ROOT_DIR / "tests" / "artifacts"

if not IMAGE_PATH.is_file():
    raise FileNotFoundError(f"Test image not found: {IMAGE_PATH}")

response = requests.post(
    "http://127.0.0.1:8000/predict",
    files={
        "file": (
            IMAGE_PATH.name,
            IMAGE_PATH.open("rb"),
            "image/png",
        )
    },
    timeout=120,
)

response.raise_for_status()
result = response.json()

ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
image_data = base64.b64decode(result["gradcam_overlay"])
output_path = ARTIFACTS_DIR / "gradcam_overlay_result.png"
output_path.write_bytes(image_data)

print("Prediction:", result["predicted_class"])
print("Confidence:", round(result["confidence"] * 100, 2), "%")
print("Grad-CAM saved:", output_path)