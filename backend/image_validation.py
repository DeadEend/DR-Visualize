
import io

import numpy as np
from fastapi import HTTPException
from PIL import Image, UnidentifiedImageError

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png"}
ALLOWED_IMAGE_FORMATS = {"JPEG", "PNG"}


def validate_and_decode_image(
    contents: bytes,
    content_type: str | None,
) -> Image.Image:
    # 1. Reject empty uploads.
    if not contents:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    # 2. Reject files larger than 10 MB.
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Image exceeds the 10 MB upload limit.",
        )

    # 3. Check the declared content type.
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Please upload a JPEG or PNG retinal image.",
        )

    try:
        # 4. Verify the actual image format and file integrity.
        with Image.open(io.BytesIO(contents)) as image:
            if image.format not in ALLOWED_IMAGE_FORMATS:
                raise HTTPException(
                    status_code=400,
                    detail="Please upload a valid JPEG or PNG image.",
                )

            image.verify()

        # 5. Reopen the verified image and decode its pixels.
        with Image.open(io.BytesIO(contents)) as image:
            rgb_image = image.convert("RGB")
            rgb_image.load()
            pixels = np.asarray(rgb_image, dtype=np.uint8)

    except HTTPException:
        raise
    except (
        UnidentifiedImageError,
        OSError,
        ValueError,
        SyntaxError,
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "The image is corrupted or cannot be opened. "
                "Please upload another image."
            ),
        )

    # 6. Reject blank or nearly uniform images.
    grayscale = np.asarray(
        Image.fromarray(pixels).convert("L"),
        dtype=np.uint8,
    )

    if grayscale.std() < 2.0:
        raise HTTPException(
            status_code=400,
            detail=(
                "The image appears blank or has too little visual information."
            ),
        )

    # 7. Return a decoded RGB image for the existing prediction pipeline.
    return Image.fromarray(pixels)
