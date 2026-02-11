# Nemnovo Tour

Минималистичный премиальный сайт туров на Next.js с постельными тонами.

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Стек

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Шрифты: Cormorant Garamond (заголовки), Outfit (текст)

## Структура

- **Hero** — главный экран с призывом к действию
- **Туры** — блок с маршрутами (карточки)
- **О нас** — короткий текст о философии
- **Контакты** — форма заявки

Тексты и разделы можно заменить по вашему ТЗ — пришлите docx, если нужно подставить точное содержание.

---

## Деплой на Netlify

### 1. Репозиторий

Убедитесь, что проект в Git и запушен на **GitHub**, **GitLab** или **Bitbucket**.

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ВАШ_ЛОГИН/nemnovo_tour.git
git push -u origin main
```

### 2. Сайт в Netlify

1. Зайдите на [netlify.com](https://www.netlify.com) и войдите в аккаунт.
2. **Add new site** → **Import an existing project**.
3. Выберите **GitHub** (или другой хостинг) и разрешите доступ.
4. Укажите репозиторий с проектом.
5. Настройки сборки Netlify подставит сам (Next.js):
   - **Build command:** `npm run build`
   - **Publish directory:** оставьте как предложено (для Next.js обрабатывает плагин)
   - **Base directory:** пусто
6. Нажмите **Deploy site**.

### 3. Переменные (если появятся)

Если позже понадобятся переменные окружения (API, ключи), задайте их в Netlify: **Site configuration** → **Environment variables**.

### 4. Домен

В **Domain management** можно подключить свой домен или использовать адрес вида `имя-сайта.netlify.app`.

В проекте уже есть файл **`netlify.toml`** с командой сборки и версией Node (20).

**Статический экспорт:** сайт собирается в статику (`output: 'export'`). Результат — папка **`out/`**. Редиректы без локали (например `/` → `/ru`) заданы в **`public/_redirects`** и копируются в `out` при сборке. На Netlify в настройках укажите **Publish directory: `out`**.
