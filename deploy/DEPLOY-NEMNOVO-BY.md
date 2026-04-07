# Деплой: домен **nemnovo.by** (и **www.nemnovo.by**)

Сайт в продакшене обслуживается по этим именам; nginx и сертификаты ниже завязаны на них.

**VPS:** `91.149.179.14` — выполняйте команды на сервере по SSH.  
**Смените root‑пароль**, если он где‑то светился.

## Требования

- DNS: записи `A` для `nemnovo.by` и `www.nemnovo.by` → `91.149.179.14`
- Порты **80** и **443** открыты (firewall / панель хостинга)

## 1. Загрузить проект на сервер

С вашего компьютера (из папки с репозиторием):

```bash
scp -r ./nemnovo_tourbaza root@91.149.179.14:/opt/
```

Или `git clone` в `/opt/nemnovo_tourbaza`.

## 2. Пакеты (Ubuntu/Debian на сервере)

```bash
apt update
apt install -y git nginx python3 python3-venv python3-pip certbot python3-certbot-nginx curl

curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

## 3. Backend (Django)

```bash
cd /opt/nemnovo_tourbaza/backend
chmod +x deploy.sh update.sh
cp .env.example .env
nano .env
```

В `.env` для продакшена задайте минимум:

```env
DJANGO_DEBUG=0
DJANGO_SECRET_KEY=<сгенерируйте длинную строку>
ALLOWED_HOSTS=nemnovo.by,www.nemnovo.by,91.149.179.14,localhost,127.0.0.1
CSRF_TRUSTED_ORIGINS=https://nemnovo.by,https://www.nemnovo.by,http://91.149.179.14
CORS_ORIGINS=https://nemnovo.by,https://www.nemnovo.by,http://91.149.179.14
FRONTEND_URL=https://nemnovo.by
```

Установка и миграции:

```bash
./deploy.sh
```

Права на медиа и **SQLite** (Gunicorn под `www-data` пишет сессии при входе в `/admin/`):

```bash
chown -R www-data:www-data /opt/nemnovo_tourbaza/backend/media
chown -R www-data:www-data /opt/nemnovo_tourbaza/backend/staticfiles
chown www-data:www-data /opt/nemnovo_tourbaza/backend/db.sqlite3
chgrp www-data /opt/nemnovo_tourbaza/backend
chmod g+rwx /opt/nemnovo_tourbaza/backend
```

Иначе SQLite не сможет создать `-wal`/`-shm` в каталоге после `scp` с Mac (владелец `501:staff`) — в логах `attempt to write a readonly database`, вход в `/admin/` даёт **500**.

Скрипт `backend/deploy.sh` после миграций выставляет права на `db.sqlite3` и группу `www-data` с `g+rwx` на каталог `backend/`.

Systemd:

```bash
cp /opt/nemnovo_tourbaza/deploy/systemd/nemnovo-backend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable nemnovo-backend
systemctl start nemnovo-backend
systemctl status nemnovo-backend
```

Nginx только для бэкенда (localhost:8005):

```bash
cp /opt/nemnovo_tourbaza/deploy/nginx/nemnovo-backend.conf /etc/nginx/sites-available/nemnovo-backend
ln -sf /etc/nginx/sites-available/nemnovo-backend /etc/nginx/sites-enabled/nemnovo-backend
nginx -t && systemctl reload nginx
```

Проверка с сервера: `curl -sS http://127.0.0.1:8005/api/ | head`

## 4. Frontend (Next.js)

```bash
cd /opt/nemnovo_tourbaza/frontend
cat > .env.production.local <<'EOF'
NEXT_PUBLIC_API_URL=
BACKEND_URL=http://127.0.0.1:8005
EOF

npm ci
npm run build
```

Переменная `BACKEND_URL` должна совпадать при **сборке** (rewrites в `next.config.js`) и в **runtime** для SSR: она задана в `nemnovo-frontend.service`; без неё страницы не получают JSON из Django.

Systemd:

```bash
cp /opt/nemnovo_tourbaza/deploy/systemd/nemnovo-frontend.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable nemnovo-frontend
systemctl start nemnovo-frontend
systemctl status nemnovo-frontend
```

## 5. Публичный nginx для `nemnovo.by`

```bash
cp /opt/nemnovo_tourbaza/deploy/nginx/nemnovo-frontend.conf /etc/nginx/sites-available/nemnovo-frontend
ln -sf /etc/nginx/sites-available/nemnovo-frontend /etc/nginx/sites-enabled/nemnovo-frontend
nginx -t && systemctl reload nginx
```

**Админка Django:** **`/admin/`** на том же домене или IP (`https://nemnovo.by/admin/`, `http://91.149.179.14/admin/`). В `nemnovo-frontend.conf`: `location /admin/` → прокси на `8005`; **`/api/`** — тоже прокси на `8005` (иначе Next.js и Django спорят о слэше в конце URL и запросы вида `/api/partners/` зацикливаются); **`/static/` и `/media/`** — `alias` на диск. Учётную запись админа создайте командой из последнего раздела ниже.

Когда DNS уже указывает на сервер:

```bash
certbot --nginx -d nemnovo.by -d www.nemnovo.by
```

Проверка продления:

```bash
certbot renew --dry-run
```

## 6. Второй сайт на том же сервере

- Создайте **отдельный** файл в `/etc/nginx/sites-available/` с **другим** `server_name` и **другим** `proxy_pass` (другой порт, например `3001`).
- Шаблон: `deploy/nginx/second-site.example.conf`
- Отдельный systemd unit для второго Node/PHP‑приложения.
- Отдельный `certbot --nginx -d второй-домен`

Конфликтов не будет, если у каждого сайта свой `server_name`.

## 7. Обновление после `git pull`

```bash
cd /opt/nemnovo_tourbaza/backend && ./update.sh
cd /opt/nemnovo_tourbaza/frontend && npm ci && npm run build && systemctl restart nemnovo-frontend
```

---

Суперпользователь для Django: `python manage.py createsuperuser` в активированном venv.
