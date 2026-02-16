from urllib.parse import unquote
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve as static_serve

def serve_media(request, path):
    """Раздача медиа с декодированием URL (кириллица в имени файла)."""
    path_decoded = unquote(path)
    return static_serve(request, path_decoded, document_root=settings.MEDIA_ROOT)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('content.urls')),
]

# Медиафайлы: свой view с unquote, чтобы /media/events/%D0%A1%D0%BD... находил файл Снимок_экрана_....
media_prefix = settings.MEDIA_URL.lstrip('/')
urlpatterns += [re_path(r'^%s(?P<path>.*)$' % media_prefix, serve_media)]
