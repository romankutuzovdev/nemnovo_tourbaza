"""
Поддержка ngrok: добавляем origin в CSRF_TRUSTED_ORIGINS и пропускаем проверку CSRF.
"""
from django.conf import settings
from django.middleware.csrf import CsrfViewMiddleware
from urllib.parse import urlparse


def _get_ngrok_origin(request):
    for header in ('HTTP_ORIGIN', 'HTTP_REFERER'):
        val = request.META.get(header, '')
        if val and ('ngrok-free.app' in val or 'ngrok.io' in val):
            try:
                p = urlparse(val)
                if p.scheme and p.netloc:
                    return f'{p.scheme}://{p.netloc}'
            except Exception:
                pass
    host = request.META.get('HTTP_HOST', '').strip() or request.META.get('HTTP_X_FORWARDED_HOST', '').strip()
    if host and ('ngrok-free.app' in host or 'ngrok.io' in host):
        scheme = request.META.get('HTTP_X_FORWARDED_PROTO', 'https')
        if scheme not in ('http', 'https'):
            scheme = 'https'
        return f'{scheme}://{host}'
    return None


def _is_ngrok_request(request):
    return _get_ngrok_origin(request) is not None


class NgrokCsrfMiddleware(CsrfViewMiddleware):
    """
    Расширяет CsrfViewMiddleware: для ngrok добавляем origin и пропускаем проверку CSRF.
    """

    def process_view(self, request, callback, callback_args, callback_kwargs):
        if not getattr(settings, 'NGROK_CSRF_BYPASS', True):
            return super().process_view(request, callback, callback_args, callback_kwargs)
        origin = _get_ngrok_origin(request)
        forwarded = request.META.get('HTTP_X_FORWARDED_HOST', '')
        is_ngrok = origin is not None or 'ngrok' in forwarded
        if is_ngrok:
            if origin and origin not in settings.CSRF_TRUSTED_ORIGINS:
                settings.CSRF_TRUSTED_ORIGINS = list(settings.CSRF_TRUSTED_ORIGINS) + [origin]
            return None
        return super().process_view(request, callback, callback_args, callback_kwargs)
