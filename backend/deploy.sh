#!/bin/bash
# Деплой Django-бэкенда: установка, миграции, статика.
# НЕ запускает сервер — он работает через systemd (gunicorn) + nginx.
# Запуск: ./deploy.sh

set -e

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BACKEND_DIR"

if ! command -v python3 &> /dev/null; then
    echo "Ошибка: python3 не найден. Установите Python 3.10+"
    exit 1
fi

if [ ! -d ".venv" ]; then
    echo "Создаём виртуальное окружение..."
    python3 -m venv .venv
fi

source .venv/bin/activate

echo "Устанавливаем зависимости..."
pip install -r requirements.txt gunicorn -q

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Создан .env — отредактируйте перед продакшеном"
fi

echo "Применяем миграции..."
python manage.py migrate --noinput

# Сессии админки и SQLite WAL: www-data должен писать в каталог БД, не только в db.sqlite3
if id www-data &>/dev/null; then
  chown www-data:www-data "$BACKEND_DIR/db.sqlite3" 2>/dev/null || true
  chown www-data:www-data "$BACKEND_DIR/db.sqlite3-wal" "$BACKEND_DIR/db.sqlite3-shm" 2>/dev/null || true
  chgrp www-data "$BACKEND_DIR" 2>/dev/null || true
  chmod g+rwx "$BACKEND_DIR" 2>/dev/null || true
fi

echo "Собираем статику..."
python manage.py collectstatic --noinput --clear

echo ""
echo "✓ Деплой готов. Перезапустите сервис:"
echo "  sudo systemctl restart nemnovo-backend"
echo ""
