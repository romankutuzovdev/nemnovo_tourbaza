import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'dev-secret-change-in-production')

DEBUG = os.environ.get('DJANGO_DEBUG', '1') == '1'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost,127.0.0.1,87.229.34.70,.trycloudflare.com,.ngrok-free.app,.ngrok.io').split(',')

# CSRF: доверенные origins. Для ngrok добавьте в backend/.env: CSRF_TRUSTED_ORIGINS=https://ваш-хост.ngrok-free.app
_default_origins = 'http://localhost:8000,http://127.0.0.1:8000,https://*.trycloudflare.com,https://c400-2a0f-cdc6-500-21c1-00-2.ngrok-free.app'
_origins_env = os.environ.get('CSRF_TRUSTED_ORIGINS', _default_origins)
CSRF_TRUSTED_ORIGINS = [o.strip() for o in _origins_env.split(',') if o.strip()]

# Отключить проверку CSRF при доступе через ngrok (для разработки)
NGROK_CSRF_BYPASS = os.environ.get('NGROK_CSRF_BYPASS', '1') == '1'

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'django_filters',
    'django_ckeditor_5',
    'content',
    'accounts',
]

# CKEditor 5 — для описания услуг
CKEDITOR_5_CONFIGS = {
    'default': {
        'toolbar': [
            'heading', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'bulletedList', 'numberedList', '|',
            'outdent', 'indent', '|',
            'blockQuote', 'link', 'insertImage', '|',
            'sourceEditing',
        ],
        'heading': {
            'options': [
                {'model': 'paragraph', 'title': 'Абзац', 'class': 'ck-heading_paragraph'},
                {'model': 'heading2', 'view': 'h2', 'title': 'Заголовок 2', 'class': 'ck-heading_heading2'},
                {'model': 'heading3', 'view': 'h3', 'title': 'Заголовок 3', 'class': 'ck-heading_heading3'},
            ]
        },
    },
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'config.ngrok_csrf.NgrokCsrfMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

ROOT_URLCONF = 'config.urls'

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Minsk'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Пусто — в JSON API пути вида /media/... (nginx отдаёт файлы с диска). Пример: https://nemnovo.by
PUBLIC_MEDIA_BASE_URL = os.environ.get('PUBLIC_MEDIA_BASE_URL', '').strip().rstrip('/')

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS: разрешить запросы с любых доменов
CORS_ALLOW_ALL_ORIGINS = True

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': ['rest_framework.renderers.JSONRenderer'],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}

# Ссылка на фронтенд для писем (сброс пароля)
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Письма: тестово все на один ящик. Для реальной отправки задайте EMAIL_HOST и т.д. в .env
CONTACT_TEST_EMAIL = os.environ.get('CONTACT_TEST_EMAIL', 'roman.kutuzov.dev@gmail.com')
if os.environ.get('EMAIL_HOST'):
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = os.environ.get('EMAIL_HOST')
    EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
    EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', '1') == '1'
    EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
    EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
    DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER or 'noreply@nemnovotour.by')
else:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
    DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'noreply@nemnovotour.by')
