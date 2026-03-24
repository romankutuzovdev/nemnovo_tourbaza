# Развёртывание через ngrok

Один туннель ngrok на порт 3000 (Next.js). API и медиа проксируются через rewrites.

## 1. Установка ngrok

```bash
brew install ngrok
```

Авторизация (при первом запуске):

```bash
ngrok config add-authtoken <ВАШ_ТОКЕН>
```

Токен: https://dashboard.ngrok.com/get-started/your-authtoken

## 2. Переменные окружения

Создайте `frontend/.env.local`:

```env
# Пустой URL = запросы к API идут на тот же домен (проксируются через Next.js)
NEXT_PUBLIC_API_URL=
BACKEND_URL=http://127.0.0.1:8000
```

> Если бэкенд на другом порту (например 8001), укажите `BACKEND_URL=http://127.0.0.1:8001`

## 3. Запуск

В трёх терминалах:

```bash
# 1. Бэкенд
cd backend && python manage.py runserver 8000

# 2. Фронтенд
cd frontend && npm run dev

# 3. ngrok
ngrok http 3000
```

## 4. Результат

В выводе ngrok будет URL вида `https://xxxx-xx-xx-xx-xx.ngrok-free.app`. Откройте его в браузере.

---

### Остановка cloudflared (если был)

```bash
pkill -f cloudflared
```
