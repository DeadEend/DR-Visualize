import base64
import requests

image_path = "000c1434d8d7.png"

with open(image_path, "rb") as image_file:
    response = requests.post(
        "http://127.0.0.1:8000/predict",
        files={"file": ("retinal_image.png", image_file, "image/png")},
        timeout=120,
    )

response.raise_for_status()
result = response.json()

image_data = base64.b64decode(result["gradcam_overlay"])

with open("gradcam_overlay_result.png", "wb") as output_file:
    output_file.write(image_data)

print("Prediction:", result["predicted_class"])
print("Confidence:", round(result["confidence"] * 100, 2), "%")
print("Grad-CAM image saved successfully!")
print("File: gradcam_overlay_result.png")
