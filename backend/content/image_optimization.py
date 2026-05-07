import io
import os
from dataclasses import dataclass
from typing import Tuple

from PIL import Image, ImageOps


SUPPORTED_EXTS = {'.jpg', '.jpeg', '.png', '.webp'}


@dataclass(frozen=True)
class OptimizeOptions:
    max_dim: int = 1920
    jpeg_quality: int = 82
    webp_quality: int = 80
    png_compress_level: int = 9


def _infer_ext(name: str) -> str:
    return os.path.splitext(name.lower())[1]


def optimize_image_bytes(*, filename: str, data: bytes, options: OptimizeOptions = OptimizeOptions()) -> Tuple[bytes, str]:
    ext = _infer_ext(filename)
    if ext not in SUPPORTED_EXTS:
        return data, ''

    with Image.open(io.BytesIO(data)) as im:
        im = ImageOps.exif_transpose(im)

        if options.max_dim and (im.width > options.max_dim or im.height > options.max_dim):
            im.thumbnail((options.max_dim, options.max_dim), Image.Resampling.LANCZOS)

        out = io.BytesIO()
        if ext in ('.jpg', '.jpeg'):
            if im.mode not in ('RGB',):
                im = im.convert('RGB')
            im.save(out, format='JPEG', quality=options.jpeg_quality, optimize=True, progressive=True)
            return out.getvalue(), 'JPEG'

        if ext == '.png':
            im.save(out, format='PNG', optimize=True, compress_level=options.png_compress_level)
            return out.getvalue(), 'PNG'

        if ext == '.webp':
            im.save(out, format='WEBP', quality=options.webp_quality, method=6)
            return out.getvalue(), 'WEBP'

    return data, ''


def should_optimize(*, original_size: int, optimized_size: int) -> bool:
    return optimized_size > 0 and optimized_size < original_size

