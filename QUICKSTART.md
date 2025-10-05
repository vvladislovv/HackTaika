# ⚡ Быстрый старт HackTaika

## 🚀 За 1 минуту

```bash
# Клонируем
git clone <repository-url>
cd hacktaika

# Запускаем
make install
```

**Готово!** 🎉 Открываем http://localhost:3000

## 🎯 Основные команды

```bash
make dev        # Запустить
make logs       # Логи
make health     # Проверить здоровье
make down       # Остановить
make help       # Все команды
```

## 🔐 Админ панель

URL: http://localhost:3000/admin

Создайте администратора командой:
```bash
make admin
```

## 📚 Что делать дальше?

### Разработка
```bash
make logs-frontend    # Смотреть логи
make db-studio        # База данных
make restart          # Перезапустить
```

### База данных
```bash
make admin            # Создать администратора
make backup           # Создать бэкап
make db-push          # Применить схему
```

### Мониторинг
```bash
make health           # Проверить здоровье
make stats            # Ресурсы
./scripts/monitor.sh  # Полный мониторинг
```

### Деплой
```bash
./scripts/deploy.sh              # Development
./scripts/deploy.sh production   # Production
```

## 🔧 Альтернативные способы запуска

### Windows
```bash
START.bat
```

### macOS/Linux без Make
```bash
./START.sh
# или
./quick-start.sh
```

### Docker напрямую
```bash
docker-compose up -d
```

## 🆘 Проблемы?

### Не запускается
```bash
make clean
make install
```

### БД не подключается
```bash
make logs-db
make restart
```

### Полная переустановка
```bash
make clean-all
make install
```

## 📖 Полная документация

- **[README.md](./README.md)** - Основная документация
- **[AUTOMATION.md](./AUTOMATION.md)** - Автоматизация и CI/CD
- **[env.example](./env.example)** - Настройка окружения

## 🏗️ Структура проекта

```
hacktaika/
├── frontend/              # Next.js приложение
│   ├── src/
│   │   ├── app/          # Pages и API
│   │   ├── components/   # React компоненты
│   │   └── lib/          # Утилиты
│   └── prisma/           # Схема БД
├── scripts/              # Автоматизация
├── Makefile              # Команды
└── docker-compose.yml    # Docker конфигурация
```

## ⚙️ Настройка

### Environment Variables
Скопируйте `env.example` в `.env` для кастомизации:
```bash
cp env.example .env
```

### Production
Используйте `docker-compose.prod.yml`:
```bash
make prod
```

## 📈 Метрики

- ⚡ Запуск: < 30 секунд
- 🚀 Сборка: < 5 минут
- 💾 Кэширование: Multi-level
- 📦 Образ: Минимальный размер

## 🎯 Функции

✅ Адаптивный дизайн  
✅ Анимации (Framer Motion)  
✅ Админ-панель  
✅ Аутентификация  
✅ PostgreSQL + Prisma  
✅ Docker  
✅ Автоматизация  
✅ CI/CD  
✅ Мониторинг  
✅ Бэкапы  

---

**Made with ❤️ by HackTaika Team**