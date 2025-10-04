#!/bin/bash

# Скрипт мониторинга сервисов
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}📊 Мониторинг HackTaika${NC}"
echo ""

# Функция проверки сервиса
check_service() {
    local name=$1
    local url=$2
    
    if curl -sf "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name работает${NC}"
        return 0
    else
        echo -e "${RED}❌ $name не отвечает${NC}"
        return 1
    fi
}

# Функция проверки контейнера
check_container() {
    local container=$1
    
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        local status=$(docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null || echo "no healthcheck")
        if [ "$status" = "healthy" ] || [ "$status" = "no healthcheck" ]; then
            echo -e "${GREEN}✅ Контейнер $container запущен${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠️  Контейнер $container: $status${NC}"
            return 1
        fi
    else
        echo -e "${RED}❌ Контейнер $container не запущен${NC}"
        return 1
    fi
}

# Проверяем контейнеры
echo -e "${YELLOW}Контейнеры:${NC}"
check_container "hacktaika-frontend"
check_container "hacktaika-db"
echo ""

# Проверяем сервисы
echo -e "${YELLOW}Сервисы:${NC}"
check_service "Frontend" "http://localhost:3000"
check_service "API Health" "http://localhost:3000/api/health"
echo ""

# Использование ресурсов
echo -e "${YELLOW}Использование ресурсов:${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" | grep hacktaika
echo ""

# Проверка места на диске
echo -e "${YELLOW}Использование диска Docker:${NC}"
docker system df
echo ""

# Логи ошибок
echo -e "${YELLOW}Последние ошибки в логах:${NC}"
docker-compose logs --tail=20 | grep -i error || echo "Ошибок не найдено"
