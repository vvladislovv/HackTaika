# 📁 Управление медиафайлами HackTaika

Полное руководство по работе с изображениями, видео и другими медиафайлами.

## 🎯 Быстрый старт

### Показать структуру
```bash
make media-list
```

### Загрузить файл
```bash
make media-upload TYPE=blog FILE=~/Desktop/image.jpg
```

### Оптимизировать изображения
```bash
make media-optimize
```

## 📂 Структура папок

```
frontend/public/media/
├── blog/           # Изображения для статей DevBlog
├── portfolio/      # Фото и видео портфолио проектов
├── works/          # Изображения работ и услуг
├── team/           # Фото команды HackTaika
├── clients/        # Логотипы клиентов
└── README.md       # Документация по медиафайлам
```

## 🚀 Команды Makefile

### Просмотр
```bash
make media-list      # Показать структуру и размеры
make media-help      # Справка по скрипту
```

### Загрузка
```bash
# Загрузить изображение для блога
make media-upload TYPE=blog FILE=~/Desktop/article-image.jpg

# Загрузить видео для портфолио
make media-upload TYPE=portfolio FILE=~/Videos/project-demo.mp4

# Загрузить фото команды
make media-upload TYPE=team FILE=~/Photos/team-photo.jpg

# Загрузить логотип клиента
make media-upload TYPE=clients FILE=~/Downloads/client-logo.png
```

### Оптимизация
```bash
make media-optimize  # Оптимизировать все изображения
```

## 📏 Рекомендации по размерам

### Блог (`/blog/`)
- **Размер**: 1200x630px (соотношение 1.91:1)
- **Формат**: JPG, PNG, WebP
- **Размер файла**: до 500KB
- **Названия**: `post-slug.jpg`

### Портфолио (`/portfolio/`)
- **Размер**: 1920x1080px или больше
- **Формат**: JPG, PNG, WebP, MP4
- **Размер файла**: до 1MB (изображения), до 10MB (видео)
- **Названия**: `project-name-1.jpg`, `project-demo.mp4`

### Работы (`/works/`)
- **Размер**: 800x600px
- **Формат**: JPG, PNG, WebP
- **Размер файла**: до 300KB
- **Названия**: `work-name.jpg`

### Команда (`/team/`)
- **Размер**: 400x400px (квадрат)
- **Формат**: JPG, PNG, WebP
- **Размер файла**: до 200KB
- **Названия**: `name-surname.jpg`

### Клиенты (`/clients/`)
- **Размер**: 200x100px
- **Формат**: PNG с прозрачностью
- **Размер файла**: до 100KB
- **Названия**: `client-name.png`

## 🛠️ Прямое использование скрипта

```bash
# Показать справку
./scripts/upload-media.sh --help

# Показать структуру
./scripts/upload-media.sh --list

# Загрузить файл
./scripts/upload-media.sh blog ~/Desktop/image.jpg
./scripts/upload-media.sh portfolio ~/Videos/demo.mp4

# Оптимизировать изображения
./scripts/upload-media.sh --optimize
```

## 🎨 Оптимизация изображений

### Автоматическая (Next.js)
- Конвертация в WebP/AVIF
- Изменение размера под устройство
- Lazy loading
- Кэширование

### Ручная оптимизация
```bash
# Установка ImageMagick
brew install imagemagick

# Оптимизация через скрипт
make media-optimize

# Или вручную
convert input.jpg -quality 85 -strip output.jpg
```

## 💻 Использование в коде

### Next.js Image компонент
```jsx
import Image from 'next/image'

<Image
  src="/media/blog/hacktaika-launch.jpg"
  alt="Запуск HackTaika"
  width={1200}
  height={630}
  priority
/>
```

### Обычный img тег
```jsx
<img 
  src="/media/portfolio/project-1.jpg" 
  alt="Проект 1"
  loading="lazy"
/>
```

### Видео
```jsx
<video 
  src="/media/portfolio/project-demo.mp4"
  controls
  poster="/media/portfolio/project-poster.jpg"
>
  Ваш браузер не поддерживает видео
</video>
```

## 🔄 Обновление контента

### Через админ-панель
1. Создайте администратора: `make admin`
2. Откройте http://localhost:3000/admin
3. Войдите с вашими данными
4. Перейдите в нужный раздел (Блог, Портфолио, Работы)
5. Добавьте/отредактируйте записи
6. Укажите пути к медиафайлам: `/media/type/filename.jpg`

### Через API
```bash
# Добавить статью в блог
curl -X POST http://localhost:3000/api/admin/blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Новая статья",
    "content": "Содержание статьи...",
    "excerpt": "Краткое описание",
    "image": "/media/blog/new-article.jpg",
    "published": true
  }'
```

## ⚠️ Важные моменты

### Безопасность
- Все файлы проверяются на тип
- Максимальные размеры файлов ограничены
- Запрещены исполняемые файлы

### Производительность
- Изображения автоматически оптимизируются
- Видео сжимаются при загрузке
- Lazy loading для всех медиафайлов

### SEO
- Все изображения должны иметь alt текст
- Используйте описательные названия файлов
- Оптимизируйте размеры для быстрой загрузки

## 🛠️ Инструменты

### Рекомендуемые
- **Figma** - для создания изображений
- **Photoshop/GIMP** - для редактирования
- **ImageOptim** - для сжатия (macOS)
- **Squoosh** - для оптимизации (веб)

### Командная строка
- **ImageMagick** - для автоматизации
- **ffmpeg** - для работы с видео
- **jpegoptim** - для сжатия JPEG
- **pngquant** - для сжатия PNG

## 📈 Мониторинг

### Размеры папок
```bash
make media-list
```

### Детальная информация
```bash
du -sh frontend/public/media/*
```

### Очистка неиспользуемых файлов
```bash
# Найти файлы, не используемые в БД
grep -r "filename.jpg" frontend/src/
```

## 🆘 Troubleshooting

### Файл не загружается
```bash
# Проверить права доступа
ls -la frontend/public/media/

# Проверить размер файла
ls -lh ~/path/to/file.jpg
```

### Изображение не отображается
1. Проверить путь в БД
2. Убедиться, что файл существует
3. Проверить права доступа
4. Очистить кэш браузера

### Медленная загрузка
1. Оптимизировать изображения: `make media-optimize`
2. Проверить размеры файлов
3. Использовать WebP формат
4. Включить lazy loading

---

**Создано для HackTaika** 🚀
