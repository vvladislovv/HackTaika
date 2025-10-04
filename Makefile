.PHONY: help dev prod build up down restart logs clean prune seed admin health backup restore

# Цвета для вывода
GREEN  := \033[0;32m
YELLOW := \033[0;33m
RED    := \033[0;31m
NC     := \033[0m # No Color

# Переменные
COMPOSE_DEV := docker-compose
COMPOSE_PROD := docker-compose -f docker-compose.prod.yml
FRONTEND_CONTAINER := hacktaika-frontend
DB_CONTAINER := hacktaika-db

help: ## Показать помощь
	@echo "$(GREEN)HackTaika - Команды автоматизации$(NC)"
	@echo ""
	@echo "$(YELLOW)Доступные команды:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(NC) %s\n", $$1, $$2}'

# Development команды
dev: ## Запустить в dev режиме
	@echo "$(GREEN)🚀 Запуск в development режиме...$(NC)"
	$(COMPOSE_DEV) up -d
	@echo "$(GREEN)✅ Приложение запущено на http://localhost:3000$(NC)"

dev-build: ## Пересобрать и запустить в dev режиме
	@echo "$(GREEN)🔨 Пересборка и запуск...$(NC)"
	$(COMPOSE_DEV) up -d --build
	@echo "$(GREEN)✅ Готово!$(NC)"

# Production команды
prod: ## Запустить в production режиме
	@echo "$(GREEN)🚀 Запуск в production режиме...$(NC)"
	$(COMPOSE_PROD) up -d
	@echo "$(GREEN)✅ Production запущено!$(NC)"

prod-build: ## Пересобрать и запустить в production
	@echo "$(GREEN)🔨 Пересборка production...$(NC)"
	$(COMPOSE_PROD) up -d --build
	@echo "$(GREEN)✅ Готово!$(NC)"

# Управление контейнерами
up: dev ## Запустить контейнеры (alias для dev)

down: ## Остановить контейнеры
	@echo "$(YELLOW)⏹️  Остановка контейнеров...$(NC)"
	$(COMPOSE_DEV) down
	@echo "$(GREEN)✅ Остановлено$(NC)"

restart: ## Перезапустить контейнеры
	@echo "$(YELLOW)🔄 Перезапуск...$(NC)"
	$(COMPOSE_DEV) restart
	@echo "$(GREEN)✅ Перезапущено$(NC)"

stop: ## Остановить без удаления
	@echo "$(YELLOW)⏸️  Остановка...$(NC)"
	$(COMPOSE_DEV) stop
	@echo "$(GREEN)✅ Остановлено$(NC)"

start: ## Запустить существующие контейнеры
	@echo "$(GREEN)▶️  Запуск...$(NC)"
	$(COMPOSE_DEV) start
	@echo "$(GREEN)✅ Запущено$(NC)"

# Логи
logs: ## Показать логи всех сервисов
	$(COMPOSE_DEV) logs -f

logs-frontend: ## Логи frontend
	$(COMPOSE_DEV) logs -f frontend

logs-db: ## Логи базы данных
	$(COMPOSE_DEV) logs -f postgres

# База данных
db-push: ## Применить схему БД (Prisma push)
	@echo "$(GREEN)📦 Применение схемы БД...$(NC)"
	docker exec -it $(FRONTEND_CONTAINER) npx prisma db push
	@echo "$(GREEN)✅ Схема применена$(NC)"

db-migrate: ## Создать миграцию
	@echo "$(GREEN)📦 Создание миграции...$(NC)"
	docker exec -it $(FRONTEND_CONTAINER) npx prisma migrate dev
	@echo "$(GREEN)✅ Миграция создана$(NC)"

db-studio: ## Открыть Prisma Studio
	@echo "$(GREEN)🎨 Запуск Prisma Studio...$(NC)"
	docker exec -it $(FRONTEND_CONTAINER) npx prisma studio

seed: ## Заполнить БД тестовыми данными
	@echo "$(GREEN)🌱 Заполнение БД...$(NC)"
	docker exec -it $(FRONTEND_CONTAINER) npm run seed
	@echo "$(GREEN)✅ Данные добавлены$(NC)"

admin: ## Создать администратора
	@echo "$(GREEN)👤 Создание администратора...$(NC)"
	docker exec -it $(FRONTEND_CONTAINER) npm run create-admin
	@echo "$(GREEN)✅ Администратор создан$(NC)"

# Очистка
clean: ## Остановить и удалить контейнеры, но сохранить volumes
	@echo "$(YELLOW)🧹 Очистка контейнеров...$(NC)"
	$(COMPOSE_DEV) down
	@echo "$(GREEN)✅ Очищено$(NC)"

clean-all: ## Удалить все (контейнеры, volumes, образы)
	@echo "$(RED)⚠️  ВНИМАНИЕ: Будут удалены ВСЕ данные!$(NC)"
	@read -p "Продолжить? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(RED)🗑️  Удаление всего...$(NC)"; \
		$(COMPOSE_DEV) down -v --rmi all; \
		echo "$(GREEN)✅ Все удалено$(NC)"; \
	else \
		echo "$(YELLOW)Отменено$(NC)"; \
	fi

prune: ## Очистить Docker (неиспользуемые образы, контейнеры, сети)
	@echo "$(YELLOW)🧹 Очистка Docker...$(NC)"
	docker system prune -af --volumes
	@echo "$(GREEN)✅ Docker очищен$(NC)"

# Мониторинг
ps: ## Показать статус контейнеров
	@echo "$(GREEN)📊 Статус контейнеров:$(NC)"
	$(COMPOSE_DEV) ps

health: ## Проверить здоровье сервисов
	@echo "$(GREEN)🏥 Проверка здоровья сервисов...$(NC)"
	@echo ""
	@echo "$(YELLOW)Database:$(NC)"
	@docker exec $(DB_CONTAINER) pg_isready -U hacktaika && echo "$(GREEN)✅ БД работает$(NC)" || echo "$(RED)❌ БД не отвечает$(NC)"
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@curl -sf http://localhost:3000 > /dev/null && echo "$(GREEN)✅ Frontend работает$(NC)" || echo "$(RED)❌ Frontend не отвечает$(NC)"

stats: ## Показать использование ресурсов
	@echo "$(GREEN)📈 Использование ресурсов:$(NC)"
	docker stats --no-stream

# Бэкап
backup: ## Создать бэкап БД
	@echo "$(GREEN)💾 Создание бэкапа...$(NC)"
	@mkdir -p ./backups
	@docker exec $(DB_CONTAINER) pg_dump -U hacktaika hacktaika_db > ./backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✅ Бэкап создан в ./backups/$(NC)"

restore: ## Восстановить БД из последнего бэкапа
	@echo "$(YELLOW)♻️  Восстановление из бэкапа...$(NC)"
	@LATEST=$$(ls -t ./backups/*.sql 2>/dev/null | head -n1); \
	if [ -z "$$LATEST" ]; then \
		echo "$(RED)❌ Бэкапы не найдены$(NC)"; \
		exit 1; \
	fi; \
	echo "Восстановление из: $$LATEST"; \
	docker exec -i $(DB_CONTAINER) psql -U hacktaika hacktaika_db < $$LATEST
	@echo "$(GREEN)✅ Восстановлено$(NC)"

# Shell доступ
# Медиафайлы
media-list: ## Показать структуру медиафайлов
	@echo "$(GREEN)📁 Структура медиафайлов:$(NC)"
	@./scripts/upload-media.sh --list

media-upload: ## Загрузить медиафайл (make media-upload TYPE=blog FILE=path/to/file.jpg)
	@if [ -z "$(TYPE)" ] || [ -z "$(FILE)" ]; then \
		echo "$(RED)❌ Использование: make media-upload TYPE=blog FILE=path/to/file.jpg$(NC)"; \
		echo "$(YELLOW)Типы: blog, portfolio, works, team, clients$(NC)"; \
		exit 1; \
	fi
	@./scripts/upload-media.sh $(TYPE) $(FILE)

media-optimize: ## Оптимизировать все изображения
	@echo "$(GREEN)🔧 Оптимизация изображений...$(NC)"
	@./scripts/upload-media.sh --optimize

media-help: ## Показать справку по медиафайлам
	@./scripts/upload-media.sh --help

shell-frontend: ## Войти в контейнер frontend
	docker exec -it $(FRONTEND_CONTAINER) sh

shell-db: ## Войти в контейнер БД
	docker exec -it $(DB_CONTAINER) sh

psql: ## Подключиться к PostgreSQL
	docker exec -it $(DB_CONTAINER) psql -U hacktaika -d hacktaika_db

# Установка и обновление
install: ## Первая установка (build + db push + seed)
	@echo "$(GREEN)🎉 Первая установка HackTaika...$(NC)"
	@echo "$(GREEN)1. Сборка образов...$(NC)"
	$(COMPOSE_DEV) build
	@echo "$(GREEN)2. Запуск контейнеров...$(NC)"
	$(COMPOSE_DEV) up -d
	@echo "$(GREEN)3. Ожидание запуска БД...$(NC)"
	@sleep 10
	@echo "$(GREEN)4. Применение схемы БД...$(NC)"
	docker exec $(FRONTEND_CONTAINER) npx prisma db push
	@echo "$(GREEN)5. Заполнение тестовыми данными...$(NC)"
	docker exec $(FRONTEND_CONTAINER) npm run seed
	@echo "$(GREEN)✨ Установка завершена! Приложение доступно на http://localhost:3000$(NC)"

update: ## Обновить зависимости и пересобрать
	@echo "$(GREEN)🔄 Обновление...$(NC)"
	$(COMPOSE_DEV) down
	$(COMPOSE_DEV) build --no-cache
	$(COMPOSE_DEV) up -d
	@echo "$(GREEN)✅ Обновлено$(NC)"

# Тестирование
test: ## Запустить тесты (если есть)
	@echo "$(GREEN)🧪 Запуск тестов...$(NC)"
	docker exec $(FRONTEND_CONTAINER) npm test

lint: ## Запустить линтер
	@echo "$(GREEN)🔍 Проверка кода...$(NC)"
	docker exec $(FRONTEND_CONTAINER) npm run lint

# Быстрые действия
quick-restart: ## Быстрый перезапуск frontend
	@echo "$(YELLOW)⚡ Быстрый перезапуск frontend...$(NC)"
	docker restart $(FRONTEND_CONTAINER)
	@echo "$(GREEN)✅ Готово$(NC)"

rebuild-frontend: ## Пересобрать только frontend
	@echo "$(GREEN)🔨 Пересборка frontend...$(NC)"
	$(COMPOSE_DEV) up -d --build --no-deps frontend
	@echo "$(GREEN)✅ Готово$(NC)"

# CI/CD
ci-build: ## Build для CI/CD
	@echo "$(GREEN)🏗️  CI Build...$(NC)"
	DOCKER_BUILDKIT=1 docker build --cache-from hacktaika-frontend:latest -t hacktaika-frontend:latest -f ./frontend/Dockerfile ./frontend
	@echo "$(GREEN)✅ Build завершен$(NC)"

# Информация
info: ## Показать информацию о проекте
	@echo "$(GREEN)ℹ️  Информация о проекте HackTaika$(NC)"
	@echo ""
	@echo "$(YELLOW)Версия Docker:$(NC)"
	@docker --version
	@echo ""
	@echo "$(YELLOW)Версия Docker Compose:$(NC)"
	@docker-compose --version
	@echo ""
	@echo "$(YELLOW)Запущенные контейнеры:$(NC)"
	@$(COMPOSE_DEV) ps
	@echo ""
	@echo "$(YELLOW)Использование места на диске:$(NC)"
	@docker system df
