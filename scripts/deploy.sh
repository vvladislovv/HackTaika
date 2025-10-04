#!/bin/bash

# Скрипт автоматического деплоя
set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Начинается автоматический деплой HackTaika...${NC}"

# Проверка требований
echo -e "${YELLOW}Проверка требований...${NC}"
command -v docker >/dev/null 2>&1 || { echo -e "${RED}❌ Docker не установлен${NC}"; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo -e "${RED}❌ Docker Compose не установлен${NC}"; exit 1; }

# Определяем окружение
ENV=${1:-production}
echo -e "${YELLOW}Окружение: ${ENV}${NC}"

# Создаем резервную копию
echo -e "${YELLOW}📦 Создание резервной копии БД...${NC}"
if docker ps | grep -q hacktaika-db; then
    mkdir -p ./backups
    BACKUP_FILE="./backups/pre_deploy_$(date +%Y%m%d_%H%M%S).sql"
    docker exec hacktaika-db pg_dump -U hacktaika hacktaika_db > "$BACKUP_FILE"
    echo -e "${GREEN}✅ Бэкап создан: $BACKUP_FILE${NC}"
else
    echo -e "${YELLOW}⚠️  БД не запущена, пропускаем бэкап${NC}"
fi

# Останавливаем текущие контейнеры
echo -e "${YELLOW}⏹️  Остановка текущих контейнеров...${NC}"
if [ "$ENV" = "production" ]; then
    docker-compose -f docker-compose.prod.yml down
else
    docker-compose down
fi

# Очистка старых образов
echo -e "${YELLOW}🧹 Очистка старых образов...${NC}"
docker image prune -f

# Сборка новых образов
echo -e "${YELLOW}🔨 Сборка образов...${NC}"
if [ "$ENV" = "production" ]; then
    docker-compose -f docker-compose.prod.yml build --no-cache
else
    docker-compose build --no-cache
fi

# Запуск контейнеров
echo -e "${YELLOW}▶️  Запуск контейнеров...${NC}"
if [ "$ENV" = "production" ]; then
    docker-compose -f docker-compose.prod.yml up -d
else
    docker-compose up -d
fi

# Ждем запуска БД
echo -e "${YELLOW}⏳ Ожидание запуска БД...${NC}"
sleep 10

# Применяем миграции
echo -e "${YELLOW}📦 Применение миграций БД...${NC}"
if [ "$ENV" = "production" ]; then
    docker exec hacktaika-frontend-prod npx prisma db push
else
    docker exec hacktaika-frontend npx prisma db push
fi

# Проверка здоровья
echo -e "${YELLOW}🏥 Проверка здоровья сервисов...${NC}"
sleep 5

if curl -sf http://localhost:3000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Frontend работает${NC}"
else
    echo -e "${RED}❌ Frontend не отвечает${NC}"
    exit 1
fi

# Успешный деплой
echo -e "${GREEN}✨ Деплой успешно завершен!${NC}"
echo -e "${GREEN}🌐 Приложение доступно на: http://localhost:3000${NC}"

# Показываем логи
echo -e "${YELLOW}📋 Последние логи:${NC}"
if [ "$ENV" = "production" ]; then
    docker-compose -f docker-compose.prod.yml logs --tail=50
else
    docker-compose logs --tail=50
fi
