#!/bin/bash

# Скрипт для создания placeholder изображений
# Использование: ./scripts/create-placeholders.sh

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

MEDIA_DIR="/Users/evochka/Documents/Codes/Fullstack/hacktaika/frontend/public/media"

echo -e "${GREEN}🎨 Создание placeholder изображений...${NC}"

# Проверяем ImageMagick
if ! command -v convert &> /dev/null; then
    echo -e "${YELLOW}⚠️  ImageMagick не установлен. Устанавливаем через brew...${NC}"
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo -e "${RED}❌ Brew не найден. Установите ImageMagick вручную${NC}"
        exit 1
    fi
fi

# Функция для создания placeholder изображения
create_placeholder() {
    local width=$1
    local height=$2
    local output=$3
    local text=$4
    local color=$5
    
    convert -size ${width}x${height} xc:"$color" \
        -gravity center \
        -pointsize 24 \
        -fill white \
        -annotate +0+0 "$text" \
        -quality 85 \
        "$output"
    
    echo "  ✅ Создано: $output (${width}x${height})"
}

# Создаем папки
mkdir -p "$MEDIA_DIR/blog"
mkdir -p "$MEDIA_DIR/portfolio"
mkdir -p "$MEDIA_DIR/works"
mkdir -p "$MEDIA_DIR/team"
mkdir -p "$MEDIA_DIR/clients"

# Blog изображения (1200x630)
echo -e "${YELLOW}📝 Создание изображений для блога...${NC}"
create_placeholder 1200 630 "$MEDIA_DIR/blog/hacktaika-launch.jpg" "HackTaika\nLaunch" "#FF6B35"
create_placeholder 1200 630 "$MEDIA_DIR/blog/nextjs-optimization.jpg" "Next.js\nOptimization" "#000000"
create_placeholder 1200 630 "$MEDIA_DIR/blog/design-system.jpg" "Design\nSystem" "#8B4513"
create_placeholder 1200 630 "$MEDIA_DIR/blog/docker-automation.jpg" "Docker\nAutomation" "#2496ED"
create_placeholder 1200 630 "$MEDIA_DIR/blog/mobile-design.jpg" "Mobile\nDesign" "#34A853"
create_placeholder 1200 630 "$MEDIA_DIR/blog/web-security.jpg" "Web\nSecurity" "#EA4335"

# Portfolio изображения (1920x1080)
echo -e "${YELLOW}💼 Создание изображений для портфолио...${NC}"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/telegram-miniapp-1.jpg" "Telegram\nMini App" "#0088CC"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/telegram-miniapp-2.jpg" "Telegram\nMini App\nScreens" "#0088CC"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/fintech-site-1.jpg" "Fintech\nWebsite" "#1A73E8"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/fintech-site-2.jpg" "Fintech\nDashboard" "#1A73E8"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/chatbot-1.jpg" "AI\nChatbot" "#00D4AA"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/chatbot-2.jpg" "Chatbot\nInterface" "#00D4AA"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/ecommerce-1.jpg" "E-commerce\nStore" "#FF6B35"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/ecommerce-2.jpg" "E-commerce\nProducts" "#FF6B35"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/ecommerce-3.jpg" "E-commerce\nCheckout" "#FF6B35"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/delivery-app-1.jpg" "Delivery\nApp" "#34A853"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/delivery-app-2.jpg" "Delivery\nTracking" "#34A853"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/landing-1.jpg" "Landing\nPage" "#9C27B0"
create_placeholder 1920 1080 "$MEDIA_DIR/portfolio/landing-2.jpg" "Landing\nHero" "#9C27B0"

# Works изображения (800x600)
echo -e "${YELLOW}🛠️  Создание изображений для работ...${NC}"
create_placeholder 800 600 "$MEDIA_DIR/works/ecommerce-shop.jpg" "E-commerce\nShop" "#FF6B35"
create_placeholder 800 600 "$MEDIA_DIR/works/corporate-site.jpg" "Corporate\nWebsite" "#1A73E8"
create_placeholder 800 600 "$MEDIA_DIR/works/telegram-miniapp.jpg" "Telegram\nMini App" "#0088CC"
create_placeholder 800 600 "$MEDIA_DIR/works/landing-page.jpg" "Landing\nPage" "#9C27B0"

# Team изображения (400x400)
echo -e "${YELLOW}👥 Создание изображений для команды...${NC}"
create_placeholder 400 400 "$MEDIA_DIR/team/developer-1.jpg" "Developer\n1" "#FF6B35"
create_placeholder 400 400 "$MEDIA_DIR/team/developer-2.jpg" "Developer\n2" "#1A73E8"
create_placeholder 400 400 "$MEDIA_DIR/team/designer-1.jpg" "Designer\n1" "#9C27B0"
create_placeholder 400 400 "$MEDIA_DIR/team/manager-1.jpg" "Manager\n1" "#34A853"

# Clients логотипы (200x100)
echo -e "${YELLOW}🏢 Создание логотипов клиентов...${NC}"
create_placeholder 200 100 "$MEDIA_DIR/clients/client-1.png" "Client 1" "#FF6B35"
create_placeholder 200 100 "$MEDIA_DIR/clients/client-2.png" "Client 2" "#1A73E8"
create_placeholder 200 100 "$MEDIA_DIR/clients/client-3.png" "Client 3" "#9C27B0"
create_placeholder 200 100 "$MEDIA_DIR/clients/client-4.png" "Client 4" "#34A853"

echo -e "${GREEN}✅ Все placeholder изображения созданы!${NC}"
echo ""
echo -e "${YELLOW}📊 Статистика:${NC}"
echo "  Blog: $(find "$MEDIA_DIR/blog" -name "*.jpg" | wc -l) изображений"
echo "  Portfolio: $(find "$MEDIA_DIR/portfolio" -name "*.jpg" | wc -l) изображений"
echo "  Works: $(find "$MEDIA_DIR/works" -name "*.jpg" | wc -l) изображений"
echo "  Team: $(find "$MEDIA_DIR/team" -name "*.jpg" | wc -l) изображений"
echo "  Clients: $(find "$MEDIA_DIR/clients" -name "*.png" | wc -l) логотипов"
echo ""
echo -e "${GREEN}🎉 Готово! Теперь изображения должны загружаться корректно.${NC}"
