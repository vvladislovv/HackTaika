# HackTaika - Современный веб-сайт с админ-панелью

Полнофункциональный сайт на Next.js с TypeScript, Prisma, PostgreSQL и Docker.

## 🚀 Особенности

- **Адаптивный дизайн** - полная поддержка десктопной и мобильной версий
- **Современные анимации** - плавные переходы с Framer Motion
- **Apple-style текстовые эффекты** - постепенное появление текста при прокрутке
- **Модальные окна** - красивые модалки для товаров и портфолио
- **Админ-панель** - полноценная система управления контентом
- **Аутентификация** - безопасный вход для администраторов
- **База данных** - PostgreSQL с Prisma ORM
- **Docker** - простое развертывание
- **⚡ Полная автоматизация** - Makefile со всеми командами
- **🚀 Оптимизация** - многоуровневое кэширование и оптимизация
- **📊 Мониторинг** - health checks и автоматические проверки
- **💾 Бэкапы** - автоматическое резервное копирование
- **🔄 CI/CD** - готовый пайплайн для GitHub Actions

## 📋 Технологии

- **Frontend:** Next.js 15, React 19, TypeScript 5
- **Styling:** Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes
- **База данных:** PostgreSQL, Prisma ORM
- **Валидация:** Zod
- **Аутентификация:** NextAuth.js
- **Формы:** React Hook Form
- **Контейнеризация:** Docker

## 🎨 Цветовая палитра

- Белый: `#FFFFFF`
- Кремовый: `#FFF8F0`
- Оранжевый: `#FF6B35`
- Рыжий: `#D4522A`
- Коричневый: `#8B4513`
- Темно-коричневый: `#5C3317`

## 🏗️ Структура проекта

```
hacktaika/
├── frontend/
│   ├── src/
│   │   ├── app/              # Next.js App Router
│   │   ├── components/       # React компоненты
│   │   ├── lib/              # Утилиты и конфигурация
│   │   ├── hooks/            # Custom hooks
│   │   └── styles/           # Глобальные стили
│   ├── prisma/               # Prisma схема
│   └── public/               # Статические файлы
├── docker-compose.yml
└── README.md
```

## 🚦 Быстрый старт

### Предварительные требования

- Docker и Docker Compose
- Make (для автоматизации)
- Node.js 20+ (опционально для локальной разработки)

### Автоматическая установка (РЕКОМЕНДУЕТСЯ)

```bash
# Одна команда для полной установки!
make install
```

Эта команда автоматически:
- Соберет оптимизированные Docker образы
- Запустит все контейнеры
- Применит схему БД

**Готово! 🎉** Приложение доступно на http://localhost:3000

### Ручная установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd hacktaika
```

2. Создайте `.env` файл (опционально):
```bash
cp env.example .env
```

3. Запустите проект:
```bash
make dev
# или
docker-compose up -d
```

## 🎯 Основные команды

### Быстрые команды
```bash
make dev              # Запустить в development
make prod             # Запустить в production
make logs             # Показать все логи
make health           # Проверить здоровье
make restart          # Перезапустить
make down             # Остановить
make help             # Показать все команды
```

### База данных
```bash
make admin            # Создать администратора
make db-studio        # Открыть Prisma Studio
make backup           # Создать бэкап БД
make restore          # Восстановить БД
```

### Мониторинг и отладка
```bash
make health           # Проверить здоровье сервисов
make stats            # Использование ресурсов
make logs-frontend    # Логи только frontend
make logs-db          # Логи только БД
./scripts/monitor.sh  # Полный мониторинг
```

### Деплой
```bash
./scripts/deploy.sh              # Development деплой
./scripts/deploy.sh production   # Production деплой
```

📖 **Полная документация**: [AUTOMATION.md](./AUTOMATION.md)

### Создание администратора

```bash
make admin
# Следуйте инструкциям в консоли
```

Или через Prisma Studio:
```bash
make db-studio
```

## 📱 Основные разделы сайта

### Публичная часть
- **Главная** - герой с анимациями
- **Описание** - информация о компании с эффектом Apple
- **Товары** - каталог услуг с модальными окнами
- **Портфолио** - выполненные работы
- **Девблог** - новости и статьи
- **Соцсети** - ссылки на социальные сети
- **Форма заказа** - обратная связь

### Админ-панель (`/admin`)
- **Вход** - аутентификация администраторов
- **Управление работами** - CRUD товаров
- **Управление портфолио** - CRUD проектов
- **Управление блогом** - CRUD статей
- **Управление соцсетями** - CRUD социальных сетей
- **Управление админами** - добавление/удаление администраторов

## 🗄️ База данных

Схема включает следующие таблицы:
- `Admin` - администраторы
- `Work` - товары/услуги
- `PortfolioItem` - портфолио проектов
- `BlogPost` - статьи блога
- `Social` - социальные сети
- `Order` - заказы от клиентов

## 🔧 Разработка

### Локальная разработка

```bash
cd frontend
npm install
npm run dev
```

### Prisma команды

```bash
# Генерация Prisma Client
npm run prisma:generate

# Применение миграций
npm run prisma:push

# Открыть Prisma Studio
npm run prisma:studio
```

## 🐳 Docker и автоматизация

### Makefile команды (РЕКОМЕНДУЕТСЯ)
```bash
make dev              # Запустить development
make prod             # Запустить production
make logs             # Показать логи
make restart          # Перезапустить
make down             # Остановить
make clean            # Очистить контейнеры
make prune            # Очистить Docker полностью
```

### Прямые Docker команды
```bash
docker-compose up -d              # Запустить
docker-compose down               # Остановить
docker-compose logs -f            # Логи
docker-compose restart            # Перезапустить
docker-compose up -d --build      # Пересобрать
```

### Оптимизация и кэширование
- **BuildKit кэширование** для быстрой сборки
- **Multi-stage Dockerfile** для минимальных образов
- **Next.js кэширование** для быстрой загрузки
- **HTTP headers** для браузерного кэша
- **Persistent volumes** для node_modules и кэша

## 🔒 Безопасность

- Пароли хешируются с помощью bcrypt
- JWT токены для сессий
- Защищенные API routes через NextAuth
- Валидация данных с Zod
- HTTPS рекомендуется для production

## 🎯 API Endpoints

### Публичные
- `GET /api/works` - список товаров
- `GET /api/portfolio` - список портфолио
- `GET /api/blog` - статьи блога
- `GET /api/socials` - социальные сети
- `POST /api/orders` - создать заказ

### Админские (требуют аутентификации)
- `POST /api/auth/login` - вход
- `GET|POST /api/admin/works` - управление работами
- `PUT|DELETE /api/admin/works/[id]` - редактировать/удалить работу
- `GET|POST /api/admin/portfolio` - управление портфолио
- `PUT|DELETE /api/admin/portfolio/[id]` - редактировать/удалить проект
- `GET|POST /api/admin/blog` - управление блогом
- `PUT|DELETE /api/admin/blog/[id]` - редактировать/удалить статью
- `GET|POST /api/admin/socials` - управление соцсетями
- `PUT|DELETE /api/admin/socials/[id]` - редактировать/удалить соцсеть
- `GET|POST /api/admin/admins` - управление админами
- `DELETE /api/admin/admins/[id]` - удалить админа

## ⚡ Производительность

### Реализовано
- ✅ Docker BuildKit кэширование
- ✅ Multi-stage сборка
- ✅ Next.js standalone output
- ✅ Webpack bundle splitting
- ✅ HTTP кэширование (1 год для статики)
- ✅ Image optimization (AVIF/WebP)
- ✅ SWC минификация
- ✅ Автоматические health checks
- ✅ CI/CD пайплайн
- ✅ Автоматические бэкапы

### Метрики
- 🚀 Время сборки: < 5 минут
- ⚡ Старт контейнеров: < 30 секунд
- 📦 Production образ: минимальный размер
- 💾 Кэш: multi-level caching

## 📝 TODO для production

- [ ] Настроить HTTPS/SSL
- [ ] Добавить rate limiting
- [ ] Настроить CDN для статики
- [ ] Добавить мониторинг ошибок (Sentry)
- [ ] Добавить email уведомления для заказов
- [ ] Добавить SEO meta-теги
- [ ] Настроить Kubernetes (опционально)
- [ ] Prometheus + Grafana метрики

## 👥 Авторы

HackTaika Team

## 📄 Лицензия

Все права защищены © 2024 HackTaika

