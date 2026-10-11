import base64
import io

import cv2
import numpy as np
from fastapi import FastAPI, UploadFile, File, HTTPException
from PIL import Image

from model_loader import load_model
from gradcam import generate_gradcam, create_gradcam_overlay


app = FastAPI(title="DR-Visualize API")

model = None

CLASS_NAMES = [
    "No DR",
    "Mild DR",
    "Moderate DR",
    "Severe DR",
    "Proliferative DR",
]


@app.on_event("startup")
def startup_event():
    global model
    model = load_model()


@app.get("/")
def home():
    return {"message": "DR-Visualize backend is running"}


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
    }


def preprocess_image(image: Image.Image) -> np.ndarray:
    image = image.convert("RGB")
    image = image.resize((224, 224))

    image_array = np.asarray(image)

    lab = cv2.cvtColor(image_array, cv2.COLOR_RGB2LAB)
    l_channel, a_channel, b_channel = cv2.split(lab)

    clahe = cv2.createCLAHE(
        clipLimit=2.0,
        tileGridSize=(8, 8),
    )
    l_channel = clahe.apply(l_channel)

    lab = cv2.merge((l_channel, a_channel, b_channel))
    image_array = cv2.cvtColor(lab, cv2.COLOR_LAB2RGB)

    image_array = image_array.astype(np.float32) / 255.0
    image_array = image_array * 255.0

    return np.expand_dims(image_array, axis=0)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model is not loaded",
        )

    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPEG or PNG image",
        )

    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        image_array = preprocess_image(image)

        probabilities = model.predict(
            image_array,
            verbose=0,
        )[0]

        predicted_index = int(np.argmax(probabilities))

        # Generate the Grad-CAM heatmap.
        heatmap = generate_gradcam(
            model,
            image_array,
            predicted_index,
        )

        # Overlay the heatmap on the uploaded retinal image.
        overlay = create_gradcam_overlay(image, heatmap)

        # Convert the overlay image into Base64 for the frontend.
        buffer = io.BytesIO()
        overlay.save(buffer, format="PNG")

        overlay_base64 = base64.b64encode(
            buffer.getvalue()
        ).decode("utf-8")

        return {
            "predicted_class": CLASS_NAMES[predicted_index],
            "class_index": predicted_index,
            "confidence": float(probabilities[predicted_index]),
            "probabilities": {
                CLASS_NAMES[i]: float(probabilities[i])
                for i in range(len(CLASS_NAMES))
            },
            "gradcam_overlay": overlay_base64,
            "gradcam_format": "image/png",
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not process image or generate Grad-CAM",
        )

    finally:
        await file.close()
