import io

import numpy as np
from fastapi import HTTPException
from PIL import Image, UnidentifiedImageError

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}


def validate_and_decode_image(contents: bytes, content_type: str | None) -> Image.Image:
    if not contents:
        raise HTTPException(status_code=400, detail="The uploaded file is empty.")

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image exceeds the 10 MB upload limit.",
        )

    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPEG or PNG retinal image.",
        )

    try:
        with Image.open(io.BytesIO(contents)) as image:
            if image.format not in {"JPEG", "PNG"}:
                raise HTTPException(
                    status_code=400,
                    detail="Please upload a valid JPEG or PNG image.",
                )
            image.verify()

        with Image.open(io.BytesIO(contents)) as image:
            image = image.convert("RGB")
            image.load()
            pixels = np.asarray(image, dtype=np.uint8)

    except HTTPException:
        raise
    except (UnidentifiedImageError, OSError, ValueError, SyntaxError):
        raise HTTPException(
            status_code=400,
            detail="The image is corrupted or cannot be opened. Please upload another image.",
        )

    grayscale = np.asarray(image.convert("L"), dtype=np.uint8)

    if grayscale.std() < 2.0:
        raise HTTPException(
            status_code=400,
            detail="The image appears blank or has too little visual information.",
        )

    return Image.fromarray(pixels)
