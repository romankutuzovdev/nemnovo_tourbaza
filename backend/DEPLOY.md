# Деплой бэкенда (nginx + gunicorn + systemd)

API на **http://87.229.34.70:8005/api/**

## Схема

```
nginx (порт 8005) → gunicorn (127.0.0.1:8000)
     ↓
  статика /static/
  медиа  /media/
```

## 1. Первичная установка

```bash
# На сервере (замените путь на свой)
cd /home/user/nemnovo_tourbaza/backend  # или где лежит проект

chmod +x deploy.sh update.sh
./deploy.sh
```

Скрипт установит зависимости, создаст venv, применит миграции, соберёт статику.

## 2. Systemd (gunicorn)

Отредактируйте `nemnovo-backend.service` — замените `/home/user/nemnovo` на путь к **backend**:

```bash
nano nemnovo-backend.service
# WorkingDirectory=/home/ВАШ_ЮЗЕР/nemnovo_tourbaza/backend
# Environment="PATH=.../backend/.venv/bin"
# ExecStart=.../backend/.venv/bin/gunicorn ...
```

Если нет пользователя `www-data`, замените на своего: `User=ubuntu`, `Group=ubuntu`.

```bash
sudo cp nemnovo-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable nemnovo-backend
sudo systemctl start nemnovo-backend
```

## 3. Nginx

Отредактируйте `nginx-nemnovo.conf` — замените `/home/user/nemnovo` на путь к **backend**:

```bash
nano nginx-nemnovo.conf
# location /static/ { alias /путь/к/backend/staticfiles/; }
# location /media/  { alias /путь/к/backend/media/; }
```

```bash
sudo cp nginx-nemnovo.conf /etc/nginx/sites-available/nemnovo
sudo ln -s /etc/nginx/sites-available/nemnovo /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 4. Firewall

```bash
sudo ufw allow 8005
sudo ufw reload
```

---

## Обновление и перезапуск

После `git pull` или копирования файлов:

```bash
cd backend
./update.sh
```

Скрипт применит миграции, соберёт статику и перезапустит `nemnovo-backend`.

---

## Полезные команды

| Действие | Команда |
|----------|---------|
| Статус | `sudo systemctl status nemnovo-backend` |
| Логи | `journalctl -u nemnovo-backend -f` |
| Перезапуск | `sudo systemctl restart nemnovo-backend` |
| Остановка | `sudo systemctl stop nemnovo-backend` |

---

## .env

```env
DJANGO_SECRET_KEY=сгенерируйте-ключ
DJANGO_DEBUG=0
ALLOWED_HOSTS=87.229.34.70,localhost,127.0.0.1
```

Секрет: `python3 -c "import secrets; print(secrets.token_urlsafe(50))"`
