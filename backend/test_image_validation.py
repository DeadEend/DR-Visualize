import io
import unittest

import numpy as np
from fastapi import HTTPException
from PIL import Image

from backend.image_validation import validate_and_decode_image


def make_png(blank=False):
    if blank:
        pixels = np.zeros((100, 100, 3), dtype=np.uint8)
    else:
        pixels = np.zeros((100, 100, 3), dtype=np.uint8)
        pixels[:, :, 0] = np.arange(100, dtype=np.uint8)[None, :] * 2
        pixels[:, :, 1] = 100

    image = Image.fromarray(pixels)
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    return buffer.getvalue()


class ImageValidationTests(unittest.TestCase):
    def assert_rejected(self, contents, content_type, expected_status=400):
        with self.assertRaises(HTTPException) as context:
            validate_and_decode_image(contents, content_type)
        self.assertEqual(context.exception.status_code, expected_status)

    def test_rejects_empty_upload(self):
        self.assert_rejected(b"", "image/png")

    def test_rejects_corrupt_image(self):
        self.assert_rejected(b"this is not an image", "image/png")

    def test_rejects_blank_image(self):
        self.assert_rejected(make_png(blank=True), "image/png")

    def test_rejects_unsupported_content_type(self):
        self.assert_rejected(make_png(), "image/gif")

    def test_accepts_valid_png(self):
        image = validate_and_decode_image(make_png(), "image/png")
        self.assertEqual(image.size, (100, 100))
        self.assertEqual(image.mode, "RGB")


if __name__ == "__main__":
    unittest.main()
