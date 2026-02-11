#!/bin/bash
# Обновление и перезапуск бэкенда (после git pull или копирования файлов)
# Запуск: ./update.sh   или   bash update.sh

set -e

BACKEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BACKEND_DIR"

source .venv/bin/activate

echo "Применяем миграции..."
python manage.py migrate --noinput

echo "Собираем статику..."
python manage.py collectstatic --noinput --clear

echo "Перезапуск nemnovo-backend..."
sudo systemctl restart nemnovo-backend

echo ""
echo "✓ Готово. Статус: sudo systemctl status nemnovo-backend"
echo "  Логи: journalctl -u nemnovo-backend -f"
echo ""
