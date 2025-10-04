# 💾 Директория бэкапов

Здесь хранятся бэкапы базы данных PostgreSQL.

## Создание бэкапа

```bash
make backup
```

Создаст файл: `backup_YYYYMMDD_HHMMSS.sql`

## Восстановление

```bash
make restore
```

Восстановит из последнего бэкапа.

## Ручное восстановление

```bash
# Восстановить из конкретного файла
docker exec -i hacktaika-db psql -U hacktaika hacktaika_db < backups/backup_20250104_120000.sql
```

## ⚠️ Важно

- Бэкапы НЕ коммитятся в Git (добавлены в .gitignore)
- Храните бэкапы в безопасном месте для production
- Регулярно создавайте бэкапы перед обновлениями
