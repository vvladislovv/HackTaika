#!/bin/bash

# Быстрый старт HackTaika
# Этот скрипт проверяет все требования и запускает проект

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════╗"
echo "║                                       ║"
echo "║        HackTaika Quick Start          ║"
echo "║                                       ║"
echo "╚═══════════════════════════════════════╝"
echo -e "${NC}"

# Проверка Docker
echo -e "${YELLOW}🔍 Проверка требований...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен. Установите Docker Desktop: https://www.docker.com/products/docker-desktop${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker установлен${NC}"

# Проверка Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose не установлен${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker Compose установлен${NC}"

# Проверка Make
if ! command -v make &> /dev/null; then
    echo -e "${YELLOW}⚠️  Make не установлен. Будем использовать прямые команды Docker${NC}"
    USE_MAKE=false
else
    echo -e "${GREEN}✅ Make установлен${NC}"
    USE_MAKE=true
fi

echo ""
echo -e "${YELLOW}📋 Выберите режим запуска:${NC}"
echo "  1) Быстрый старт (автоматическая установка)"
echo "  2) Development режим"
echo "  3) Production режим"
echo "  4) Только запустить (если уже установлено)"
echo ""
read -p "Выберите опцию [1-4]: " choice

case $choice in
    1)
        echo -e "${GREEN}🚀 Запуск автоматической установки...${NC}"
        if [ "$USE_MAKE" = true ]; then
            make install
        else
            echo -e "${YELLOW}Сборка образов...${NC}"
            docker-compose build
            echo -e "${YELLOW}Запуск контейнеров...${NC}"
            docker-compose up -d
            echo -e "${YELLOW}Ожидание запуска БД...${NC}"
            sleep 10
            echo -e "${YELLOW}Применение схемы БД...${NC}"
            docker exec hacktaika-frontend npx prisma db push
        fi
        ;;
    2)
        echo -e "${GREEN}🔧 Запуск в Development режиме...${NC}"
        if [ "$USE_MAKE" = true ]; then
            make dev
        else
            docker-compose up -d
        fi
        ;;
    3)
        echo -e "${GREEN}🚀 Запуск в Production режиме...${NC}"
        if [ "$USE_MAKE" = true ]; then
            make prod
        else
            docker-compose -f docker-compose.prod.yml up -d
        fi
        ;;
    4)
        echo -e "${GREEN}▶️  Запуск контейнеров...${NC}"
        docker-compose up -d
        ;;
    *)
        echo -e "${RED}❌ Неверный выбор${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✨ Готово!${NC}"
echo ""
echo -e "${BLUE}📝 Полезные команды:${NC}"
if [ "$USE_MAKE" = true ]; then
    echo "  make logs          - Показать логи"
    echo "  make health        - Проверить здоровье"
    echo "  make db-studio     - Открыть Prisma Studio"
    echo "  make admin         - Создать администратора"
    echo "  make down          - Остановить"
    echo "  make help          - Все команды"
else
    echo "  docker-compose logs -f              - Показать логи"
    echo "  docker-compose ps                   - Статус контейнеров"
    echo "  docker exec -it hacktaika-frontend npx prisma studio  - Prisma Studio"
    echo "  docker-compose down                 - Остановить"
fi
echo ""
echo -e "${GREEN}🌐 Приложение доступно:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Admin:    http://localhost:3000/admin"
echo ""
echo -e "${YELLOW}📖 Документация: AUTOMATION.md${NC}"
echo ""
