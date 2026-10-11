import os
import requests
import tensorflow as tf

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_URL = (
    "https://raw.githubusercontent.com/"
    "DeadEend/DR-Visualize/main/model/dr_visualize_best.keras"
)

MODEL_PATH = os.path.join(BASE_DIR, "dr_visualize_best.keras")


def load_model():
    if not os.path.exists(MODEL_PATH):
        response = requests.get(MODEL_URL, timeout=120)
        response.raise_for_status()

        with open(MODEL_PATH, "wb") as file:
            file.write(response.content)

    return tf.keras.models.load_model(MODEL_PATH)