import numpy as np
from model_loader import load_model
from gradcam import generate_gradcam
from PIL import Image
from gradcam import create_gradcam_overlay

model = load_model()

image = np.random.rand(1, 224, 224, 3).astype(np.float32) * 255.0
predictions = model.predict(image, verbose=0)
class_index = int(np.argmax(predictions[0]))

heatmap = generate_gradcam(model, image, class_index)

print("Grad-CAM test completed!")
print("Predicted class index:", class_index)
print("Heatmap shape:", heatmap.shape)
print("Heatmap range:", float(heatmap.min()), float(heatmap.max()))

test_image = Image.new("RGB", (224, 224), color="gray")
overlay = create_gradcam_overlay(test_image, heatmap)
overlay.save("gradcam_overlay_test.png")

print("Overlay saved: gradcam_overlay_test.png")