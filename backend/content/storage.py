from django.core.files.base import ContentFile
from django.core.files.storage import FileSystemStorage

from .image_optimization import OptimizeOptions, optimize_image_bytes, should_optimize


class OptimizingMediaStorage(FileSystemStorage):
    def _save(self, name, content):
        try:
            raw = content.read()
            optimized, _ = optimize_image_bytes(filename=name, data=raw, options=OptimizeOptions())
            if should_optimize(original_size=len(raw), optimized_size=len(optimized)):
                content = ContentFile(optimized)
        except Exception:
            try:
                content.seek(0)
            except Exception:
                pass
        return super()._save(name, content)

