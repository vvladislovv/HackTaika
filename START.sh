#!/bin/bash

echo "🚀 Запуск проекта HackTaika..."
echo ""

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker Desktop: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен."
    exit 1
fi

echo "✅ Docker найден"

# Создание .env если не существует
if [ ! -f "frontend/.env" ]; then
    echo "📝 Создание .env файла..."
    cp frontend/.env.example frontend/.env 2>/dev/null || cat > frontend/.env << EOF
DATABASE_URL="postgresql://hacktaika:hacktaika_password@postgres:5432/hacktaika_db"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
EOF
    echo "✅ .env файл создан"
fi

# Запуск контейнеров
echo "🐳 Запуск Docker контейнеров..."
docker-compose up -d

echo ""
echo "⏳ Ожидание запуска сервисов (это может занять 2-3 минуты)..."
sleep 10

# Проверка статуса
if docker-compose ps | grep -q "Up"; then
    echo "✅ Контейнеры запущены"
else
    echo "❌ Ошибка запуска контейнеров"
    docker-compose logs
    exit 1
fi

echo ""
echo "📦 Ожидание инициализации базы данных..."
sleep 20

# Заполнение базы данных
echo "🌱 Заполнение базы данных тестовыми данными..."
docker-compose exec -T frontend npm run seed

echo ""
echo "🎉 Проект успешно запущен!"
echo ""
echo "📍 Доступные адреса:"
echo "   Главная страница: http://localhost:3000"
echo "   Админ-панель: http://localhost:3000/admin"
echo ""
echo "🔐 Данные для входа:"
echo "   Email: admin@hacktaika.com"
echo "   Пароль: admin123"
echo ""
echo "📚 Полезные команды:"
if command -v make &> /dev/null; then
    echo "   🎯 С Makefile (РЕКОМЕНДУЕТСЯ):"
    echo "   make logs          - Посмотреть логи"
    echo "   make health        - Проверить здоровье"
    echo "   make restart       - Перезапустить"
    echo "   make down          - Остановить"
    echo "   make help          - Все команды"
    echo ""
    echo "   📖 Полная документация: AUTOMATION.md"
else
    echo "   Остановить проект: docker-compose down"
    echo "   Посмотреть логи: docker-compose logs -f"
    echo "   Пересобрать: docker-compose up -d --build"
fi
echo ""
echo "✨ Готово! Откройте http://localhost:3000 в браузере"

