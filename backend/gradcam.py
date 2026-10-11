import tensorflow as tf
import numpy as np
import cv2
from PIL import Image

def generate_gradcam(model, image_array, class_index):
    efficientnet = model.get_layer("efficientnetb0")
    last_conv_layer = efficientnet.get_layer("top_activation")

    grad_model = tf.keras.Model(
        inputs=efficientnet.input,
        outputs=[
            last_conv_layer.output,
            efficientnet.output,
        ],
    )

    with tf.GradientTape() as tape:
        conv_outputs, features = grad_model(
            image_array, training=False
        )

        x = tf.reduce_mean(features, axis=(1, 2))
        x = model.get_layer("dropout")(x, training=False)
        predictions = model.get_layer(
            "dense"
        )(x, training=False)

        loss = predictions[:, class_index]

    grads = tape.gradient(loss, conv_outputs)
    pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

    conv_outputs = conv_outputs[0]
    heatmap = tf.reduce_sum(
        conv_outputs * pooled_grads,
        axis=-1,
    )

    heatmap = tf.maximum(heatmap, 0)
    max_value = tf.reduce_max(heatmap)

    heatmap = tf.where(
        max_value > 0,
        heatmap / (max_value + tf.keras.backend.epsilon()),
        tf.zeros_like(heatmap),
    )

    return heatmap.numpy()

def create_gradcam_overlay(image: Image.Image, heatmap: np.ndarray):
    image = image.convert("RGB").resize((224, 224))
    original = np.array(image)

    heatmap_resized = cv2.resize(
        heatmap,
        (224, 224),
        interpolation=cv2.INTER_LINEAR,
    )

    heatmap_uint8 = np.uint8(255 * heatmap_resized)
    colored_heatmap = cv2.applyColorMap(
        heatmap_uint8,
        cv2.COLORMAP_JET,
    )
    colored_heatmap = cv2.cvtColor(
        colored_heatmap,
        cv2.COLOR_BGR2RGB,
    )

    overlay = cv2.addWeighted(
        original,
        0.6,
        colored_heatmap,
        0.4,
        0,
    )

    return Image.fromarray(overlay)