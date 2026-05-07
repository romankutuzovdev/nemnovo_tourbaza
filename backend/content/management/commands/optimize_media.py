import os
from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand

from content.image_optimization import OptimizeOptions, SUPPORTED_EXTS, optimize_image_bytes, should_optimize


class Command(BaseCommand):
    help = 'Resize/compress all images in MEDIA_ROOT (in place).'

    def add_arguments(self, parser):
        parser.add_argument('--max-dim', type=int, default=1920)
        parser.add_argument('--jpeg-quality', type=int, default=82)
        parser.add_argument('--webp-quality', type=int, default=80)
        parser.add_argument('--png-compress-level', type=int, default=9)
        parser.add_argument('--dry-run', action='store_true')

    def handle(self, *args, **options):
        media_root = Path(settings.MEDIA_ROOT)
        if not media_root.exists():
            self.stdout.write(self.style.WARNING(f'MEDIA_ROOT not found: {media_root}'))
            return

        opt = OptimizeOptions(
            max_dim=options['max_dim'],
            jpeg_quality=options['jpeg_quality'],
            webp_quality=options['webp_quality'],
            png_compress_level=options['png_compress_level'],
        )
        dry_run = bool(options['dry_run'])

        total = 0
        changed = 0
        saved = 0

        for path in media_root.rglob('*'):
            if not path.is_file() or path.suffix.lower() not in SUPPORTED_EXTS:
                continue
            total += 1
            try:
                raw = path.read_bytes()
                optimized, _ = optimize_image_bytes(filename=path.name, data=raw, options=opt)
                if not should_optimize(original_size=len(raw), optimized_size=len(optimized)):
                    continue
                changed += 1
                saved += (len(raw) - len(optimized))
                if not dry_run:
                    tmp = str(path) + '.opt_tmp'
                    Path(tmp).write_bytes(optimized)
                    os.replace(tmp, path)
            except Exception:
                continue

        self.stdout.write(f'Total images: {total}')
        self.stdout.write(f'Optimized: {changed}')
        self.stdout.write(f'Saved bytes: {saved}')
        if dry_run:
            self.stdout.write(self.style.WARNING('Dry-run: no files changed.'))

