# Бэкенд Немново (Django)

API для услуг. Язык контента передаётся параметром `?locale=ru|be|en|pl|zh`.

## Установка и запуск

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# при необходимости отредактировать .env
# Если были старые миграции — удалите db.sqlite3 и папку content/migrations/__pycache__/, затем:
python manage.py migrate
python manage.py load_sample_services        # опционально: 2 примерные услуги
python manage.py load_sample_promos_portfolio # опционально: акции и портфолио
python manage.py createsuperuser
python manage.py runserver
```

Настройки Django лежат в пакете `config` (папка `config/`).

API: <http://127.0.0.1:8000/api/>

## Эндпоинты

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/services/?locale=ru` | Список услуг (с переводом для локали) |
| GET | `/api/services/<slug>/?locale=ru` | Одна услуга |
| GET | `/api/promos/?locale=ru` | Список акций |
| GET | `/api/portfolio/?locale=ru` | Список блоков портфолио (фотоотчёты, is_pinned — закреплённые выше) |
Формат услуги: `slug`, `image` (URL пути к загруженному файлу), `image_url` (внешняя ссылка), `order`, `title`, `short_desc`, для детали ещё `long_desc`.  
Если перевода для запрошенной локали нет, возвращается русский.

## Админка

<http://127.0.0.1:8000/admin/> — услуги, акции (Promo), портфолио (PortfolioItem: фотоотчёты, закрепление — is_pinned).

## Фронтенд (Next.js)

Фронт берёт с бэкенда только контент (услуги). Строки интерфейса хранятся на фронте в `frontend/locales/{locale}/common.json` (next-intl).

- В `frontend` задайте `NEXT_PUBLIC_API_URL=http://127.0.0.1:8000` (или URL вашего API).
- Layout запрашивает `/api/services/`, `/api/promos/`, `/api/portfolio/` по локали и передаёт данные в контекст.
- Услуги и страница услуги по slug запрашивают данные из API.
