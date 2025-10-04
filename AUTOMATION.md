# 🚀 Автоматизация HackTaika

Полное руководство по автоматизации и оптимизации проекта.

## 📋 Содержание

- [Быстрый старт](#быстрый-старт)
- [Makefile команды](#makefile-команды)
- [Docker оптимизация](#docker-оптимизация)
- [Кэширование](#кэширование)
- [CI/CD](#cicd)
- [Мониторинг](#мониторинг)
- [Бэкапы](#бэкапы)

## 🎯 Быстрый старт

### Первая установка
```bash
make install
```

Эта команда автоматически:
1. Соберет Docker образы с кэшированием
2. Запустит контейнеры
3. Применит схему БД
4. Заполнит тестовыми данными

### Ежедневная работа
```bash
make dev          # Запустить в development режиме
make logs         # Смотреть логи
make restart      # Перезапустить
make down         # Остановить
```

## 🛠️ Makefile команды

### Development
| Команда | Описание |
|---------|----------|
| `make dev` | Запустить в dev режиме |
| `make dev-build` | Пересобрать и запустить |
| `make logs` | Показать логи всех сервисов |
| `make logs-frontend` | Логи только frontend |
| `make logs-db` | Логи только БД |

### Production
| Команда | Описание |
|---------|----------|
| `make prod` | Запустить в production |
| `make prod-build` | Пересобрать production |

### База данных
| Команда | Описание |
|---------|----------|
| `make db-push` | Применить схему БД |
| `make db-migrate` | Создать миграцию |
| `make db-studio` | Открыть Prisma Studio |
| `make seed` | Заполнить тестовыми данными |
| `make admin` | Создать администратора |
| `make psql` | Подключиться к PostgreSQL |

### Мониторинг
| Команда | Описание |
|---------|----------|
| `make health` | Проверить здоровье сервисов |
| `make stats` | Использование ресурсов |
| `make ps` | Статус контейнеров |

### Бэкапы
| Команда | Описание |
|---------|----------|
| `make backup` | Создать бэкап БД |
| `make restore` | Восстановить из последнего бэкапа |

### Очистка
| Команда | Описание |
|---------|----------|
| `make clean` | Остановить и удалить контейнеры |
| `make clean-all` | Удалить все (включая данные) |
| `make prune` | Очистить Docker от неиспользуемого |

### Быстрые действия
| Команда | Описание |
|---------|----------|
| `make quick-restart` | Быстрый перезапуск frontend |
| `make rebuild-frontend` | Пересобрать только frontend |

### Утилиты
| Команда | Описание |
|---------|----------|
| `make shell-frontend` | Shell в контейнере frontend |
| `make shell-db` | Shell в контейнере БД |
| `make lint` | Проверка кода линтером |
| `make info` | Информация о проекте |
| `make help` | Показать все команды |

## 🐳 Docker оптимизация

### Многоступенчатая сборка
Проект использует оптимизированный Dockerfile с тремя этапами:
- **deps**: Установка зависимостей с кэшированием
- **builder**: Сборка приложения
- **runner**: Минимальный production образ

### BuildKit кэширование
Включено автоматически для ускорения сборки:
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

### Два режима работы
- **Dockerfile.dev**: Для разработки с hot reload
- **Dockerfile**: Для production с оптимизацией

## 💾 Кэширование

### Next.js кэширование
Автоматически настроено в `next.config.js`:
- Статические ресурсы: 1 год кэша
- Webpack bundle splitting для оптимальной загрузки
- SWC минификация
- Image optimization с AVIF/WebP

### Docker volumes для кэша
- `nextjs_cache`: Кэш Next.js сборки
- `postgres_cache`: Кэш PostgreSQL
- Persistent `node_modules`

### HTTP headers
Настроены оптимальные заголовки для:
- Браузерного кэширования
- CDN кэширования
- Безопасности

## 🔄 CI/CD

### GitHub Actions
Автоматический пайплайн в `.github/workflows/ci-cd.yml`:

1. **Lint**: Проверка кода
2. **Build**: Сборка с кэшированием
3. **Test**: Тестирование с PostgreSQL
4. **Deploy**: Автодеплой на staging/production

### Локальные скрипты

#### Деплой
```bash
./scripts/deploy.sh              # Development
./scripts/deploy.sh production   # Production
```

Автоматически:
- Создает бэкап БД
- Останавливает старые контейнеры
- Собирает новые образы
- Применяет миграции
- Проверяет здоровье

#### Мониторинг
```bash
./scripts/monitor.sh
```

Показывает:
- Статус контейнеров
- Здоровье сервисов
- Использование ресурсов
- Последние ошибки

## 📊 Мониторинг

### Health checks
Автоматические проверки здоровья:
- PostgreSQL: каждые 5 секунд
- Frontend: каждые 10 секунд

Endpoint для мониторинга:
```bash
curl http://localhost:3000/api/health
```

### Логи
```bash
# Все логи
make logs

# Только ошибки
make logs | grep -i error

# Последние 100 строк
make logs --tail=100

# Follow режим
make logs -f
```

### Метрики
```bash
# Использование ресурсов
make stats

# Docker система
docker system df

# Детальная информация
make info
```

## 💾 Бэкапы

### Автоматический бэкап
```bash
make backup
```

Создает SQL дамп в `./backups/backup_YYYYMMDD_HHMMSS.sql`

### Восстановление
```bash
make restore
```

Восстанавливает из последнего бэкапа в `./backups/`

### Ручной бэкап/восстановление
```bash
# Бэкап
docker exec hacktaika-db pg_dump -U hacktaika hacktaika_db > backup.sql

# Восстановление
docker exec -i hacktaika-db psql -U hacktaika hacktaika_db < backup.sql
```

## 🎨 Best Practices

### Development workflow
```bash
# Утром
make dev

# Проверка здоровья
make health

# Работа с БД
make db-studio

# Просмотр логов
make logs-frontend

# Вечером
make down
```

### Production deployment
```bash
# Перед деплоем
make backup

# Деплой
./scripts/deploy.sh production

# Проверка
make health
./scripts/monitor.sh
```

### Оптимизация производительности
1. Регулярно очищайте Docker:
   ```bash
   make prune
   ```

2. Используйте production режим для тестирования:
   ```bash
   make prod
   ```

3. Мониторьте ресурсы:
   ```bash
   make stats
   ```

## 🔧 Конфигурация

### Environment файлы
- `env.example`: Шаблон переменных окружения
- Создайте `.env` для кастомизации

### Docker Compose файлы
- `docker-compose.yml`: Development
- `docker-compose.prod.yml`: Production

### Ресурсы контейнеров
Настроены лимиты в docker-compose файлах:
- PostgreSQL: 512MB (dev), 1GB (prod)
- Frontend: 1GB (prod)

## 🆘 Troubleshooting

### Контейнеры не запускаются
```bash
make clean
make dev-build
```

### БД не подключается
```bash
make logs-db
docker exec hacktaika-db pg_isready -U hacktaika
```

### Frontend падает
```bash
make logs-frontend
make rebuild-frontend
```

### Нехватка места
```bash
make prune
docker volume prune
```

### Сброс всего
```bash
make clean-all
make install
```

## 📈 Метрики производительности

### Целевые показатели
- Время сборки: < 5 минут
- Старт контейнеров: < 30 секунд
- Response time: < 200ms
- Lighthouse score: > 90

### Мониторинг метрик
```bash
# Response time
curl -w "@-" -o /dev/null -s http://localhost:3000 <<'EOF'
time_namelookup:  %{time_namelookup}\n
time_connect:  %{time_connect}\n
time_starttransfer:  %{time_starttransfer}\n
time_total:  %{time_total}\n
EOF

# Размер образов
docker images | grep hacktaika
```

## 🎯 Roadmap

- [ ] Автоматические тесты
- [ ] Метрики Prometheus
- [ ] Grafana дашборды
- [ ] Автоматические бэкапы по cron
- [ ] Blue-green deployment
- [ ] Kubernetes манифесты

---

**Сделано с ❤️ для максимальной производительности**
