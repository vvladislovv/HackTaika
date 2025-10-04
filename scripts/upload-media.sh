#!/bin/bash

# Скрипт для загрузки медиафайлов в проект
# Использование: ./scripts/upload-media.sh [тип] [путь_к_файлу]

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

MEDIA_DIR="/Users/evochka/Documents/Codes/Fullstack/hacktaika/frontend/public/media"

# Функция для показа помощи
show_help() {
    echo -e "${GREEN}📁 Скрипт загрузки медиафайлов HackTaika${NC}"
    echo ""
    echo "Использование:"
    echo "  $0 [тип] [путь_к_файлу]"
    echo ""
    echo "Типы медиафайлов:"
    echo "  blog        - Изображения для статей блога"
    echo "  portfolio   - Фото и видео портфолио"
    echo "  works       - Изображения работ"
    echo "  team        - Фото команды"
    echo "  clients     - Логотипы клиентов"
    echo ""
    echo "Примеры:"
    echo "  $0 blog ~/Desktop/article-image.jpg"
    echo "  $0 portfolio ~/Videos/project-demo.mp4"
    echo "  $0 team ~/Photos/team-photo.jpg"
    echo ""
    echo "Опции:"
    echo "  --help, -h  - Показать эту справку"
    echo "  --list      - Показать структуру папок"
    echo "  --optimize  - Оптимизировать изображения"
}

# Функция для показа структуры папок
show_structure() {
    echo -e "${GREEN}📂 Структура медиафайлов:${NC}"
    echo ""
    find "$MEDIA_DIR" -type d | sort | sed 's|.*/media/||' | sed 's/^/  /'
    echo ""
    echo -e "${YELLOW}Размеры файлов:${NC}"
    for dir in blog portfolio works team clients; do
        if [ -d "$MEDIA_DIR/$dir" ]; then
            count=$(find "$MEDIA_DIR/$dir" -type f | wc -l)
            size=$(du -sh "$MEDIA_DIR/$dir" 2>/dev/null | cut -f1)
            echo "  $dir: $count файлов ($size)"
        fi
    done
}

# Функция для оптимизации изображений
optimize_images() {
    echo -e "${YELLOW}🔧 Оптимизация изображений...${NC}"
    
    # Проверяем наличие ImageMagick
    if ! command -v convert &> /dev/null; then
        echo -e "${RED}❌ ImageMagick не установлен. Установите: brew install imagemagick${NC}"
        return 1
    fi
    
    # Оптимизируем изображения в каждой папке
    for dir in blog portfolio works team clients; do
        if [ -d "$MEDIA_DIR/$dir" ]; then
            echo -e "${YELLOW}Обрабатываем $dir...${NC}"
            find "$MEDIA_DIR/$dir" -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | while read file; do
                # Создаем резервную копию
                cp "$file" "$file.backup"
                
                # Оптимизируем
                convert "$file" -quality 85 -strip "$file"
                
                # Показываем результат
                original_size=$(stat -f%z "$file.backup" 2>/dev/null || stat -c%s "$file.backup" 2>/dev/null)
                new_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
                saved=$((original_size - new_size))
                percent=$((saved * 100 / original_size))
                
                echo "  $(basename "$file"): сэкономлено ${saved} байт (${percent}%)"
            done
        fi
    done
    
    echo -e "${GREEN}✅ Оптимизация завершена${NC}"
}

# Функция для загрузки файла
upload_file() {
    local type=$1
    local file_path=$2
    
    # Проверяем тип
    case $type in
        blog|portfolio|works|team|clients)
            ;;
        *)
            echo -e "${RED}❌ Неверный тип: $type${NC}"
            echo "Доступные типы: blog, portfolio, works, team, clients"
            return 1
            ;;
    esac
    
    # Проверяем существование файла
    if [ ! -f "$file_path" ]; then
        echo -e "${RED}❌ Файл не найден: $file_path${NC}"
        return 1
    fi
    
    # Получаем имя файла
    filename=$(basename "$file_path")
    
    # Создаем папку если не существует
    target_dir="$MEDIA_DIR/$type"
    mkdir -p "$target_dir"
    
    # Копируем файл
    cp "$file_path" "$target_dir/$filename"
    
    # Получаем размер файла
    file_size=$(stat -f%z "$target_dir/$filename" 2>/dev/null || stat -c%s "$target_dir/$filename" 2>/dev/null)
    file_size_mb=$((file_size / 1024 / 1024))
    
    echo -e "${GREEN}✅ Файл загружен:${NC}"
    echo "  Тип: $type"
    echo "  Файл: $filename"
    echo "  Размер: ${file_size_mb}MB"
    echo "  Путь: $target_dir/$filename"
    
    # Показываем рекомендации
    case $type in
        blog)
            echo -e "${YELLOW}💡 Рекомендации для блога:${NC}"
            echo "  - Размер: 1200x630px"
            echo "  - Формат: JPG, PNG, WebP"
            echo "  - Название: post-slug.jpg"
            ;;
        portfolio)
            echo -e "${YELLOW}💡 Рекомендации для портфолио:${NC}"
            echo "  - Размер: 1920x1080px или больше"
            echo "  - Формат: JPG, PNG, WebP, MP4"
            echo "  - Название: project-name-1.jpg"
            ;;
        works)
            echo -e "${YELLOW}💡 Рекомендации для работ:${NC}"
            echo "  - Размер: 800x600px"
            echo "  - Формат: JPG, PNG, WebP"
            echo "  - Название: work-name.jpg"
            ;;
        team)
            echo -e "${YELLOW}💡 Рекомендации для команды:${NC}"
            echo "  - Размер: 400x400px (квадрат)"
            echo "  - Формат: JPG, PNG, WebP"
            echo "  - Название: name-surname.jpg"
            ;;
        clients)
            echo -e "${YELLOW}💡 Рекомендации для клиентов:${NC}"
            echo "  - Размер: 200x100px"
            echo "  - Формат: PNG с прозрачностью"
            echo "  - Название: client-name.png"
            ;;
    esac
}

# Обработка аргументов
case $1 in
    --help|-h)
        show_help
        exit 0
        ;;
    --list)
        show_structure
        exit 0
        ;;
    --optimize)
        optimize_images
        exit 0
        ;;
    "")
        echo -e "${RED}❌ Не указан тип медиафайла${NC}"
        show_help
        exit 1
        ;;
    *)
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Не указан путь к файлу${NC}"
            show_help
            exit 1
        fi
        upload_file "$1" "$2"
        ;;
esac
