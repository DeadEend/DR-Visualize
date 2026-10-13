
import os
import tempfile
from pathlib import Path

import requests
import tensorflow as tf

BASE_DIR = Path(__file__).resolve().parent

MODEL_COMMIT = "d7ad9879e7e37dcc1a8b735d2828e5bb516139a6"

MODEL_URL = (
    "https://raw.githubusercontent.com/"
    f"DeadEend/DR-Visualize/{MODEL_COMMIT}/model/dr_visualize_best.keras"
)

MODEL_PATH = BASE_DIR / "dr_visualize_best.keras"


def load_model():
    if not MODEL_PATH.is_file():
        response = requests.get(MODEL_URL, timeout=120)
        response.raise_for_status()

        # Download to a temporary file first so a failed download
        # cannot leave a partial model at the final path.
        fd, temporary_path = tempfile.mkstemp(
            prefix="dr_visualize_",
            suffix=".keras",
            dir=BASE_DIR,
        )

        try:
            with os.fdopen(fd, "wb") as file:
                file.write(response.content)

            # Verify that the downloaded file is a loadable Keras model
            # before moving it into the final model location.
            tf.keras.models.load_model(temporary_path, compile=False)
            os.replace(temporary_path, MODEL_PATH)
        finally:
            if os.path.exists(temporary_path):
                os.remove(temporary_path)

    return tf.keras.models.load_model(MODEL_PATH, compile=False)
