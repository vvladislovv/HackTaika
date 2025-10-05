# Настройка Telegram Бота для HackTaika

## Быстрый старт

### 1. Создание бота в Telegram

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Придумайте имя для бота (например: "HackTaika Notifications")
4. Придумайте username для бота (должен заканчиваться на `bot`, например: `hacktaika_bot`)
5. Скопируйте полученный токен - это ваш `TELEGRAM_BOT_TOKEN`

### 2. Получение вашего Telegram ID

1. Откройте [@userinfobot](https://t.me/userinfobot) в Telegram
2. Нажмите `/start`
3. Бот отправит вам информацию, включая ваш ID
4. Скопируйте число из поля "Id" - это ваш `TELEGRAM_ADMIN_ID`

### 3. Настройка переменных окружения

1. Скопируйте файл `env.example` в `.env`:
```bash
cp env.example .env
```

2. Откройте `.env` и заполните следующие переменные:
```env
# Токен бота от BotFather
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz

# Ваш Telegram ID (куда будут приходить уведомления)
TELEGRAM_ADMIN_ID=123456789

# URL вашего сайта (для локальной разработки)
WEBAPP_URL=http://localhost:3000

# Секретный ключ для защиты webhook (придумайте сложный)
BOT_WEBHOOK_SECRET=your_very_secret_key_123456
```

### 4. Обновление базы данных

Необходимо применить миграции для добавления поля `telegram` в таблицы:

```bash
# Через Docker
docker-compose exec frontend npx prisma migrate dev --name add_telegram_field

# Или локально (если у вас установлен Node.js)
cd frontend
npx prisma migrate dev --name add_telegram_field
```

### 5. Запуск с Docker

```bash
# Пересоберите контейнеры с новым сервисом telegram-bot
docker-compose down
docker-compose up --build -d

# Проверьте логи бота
docker-compose logs -f telegram-bot
```

### 6. Проверка работы

1. Откройте Telegram и найдите вашего бота по username
2. Отправьте команду `/start`
3. Вы должны получить приветственное сообщение с кнопкой для перехода на сайт

4. Проверьте уведомления:
   - Откройте сайт http://localhost:3000
   - Заполните любую форму заявки
   - Уведомление должно прийти в Telegram на ваш аккаунт

## Структура бота

```
telegram-bot/
├── bot.py                  # Основной бот (обработка команд)
├── webhook_server.py       # Webhook сервер для уведомлений
├── requirements.txt        # Python зависимости
├── Dockerfile             # Docker образ
└── README.md              # Документация
```

## Функционал

### Команды бота

- `/start` - Приветственное сообщение с кнопкой перехода на сайт

### Уведомления

Бот автоматически отправляет уведомления администратору при:

1. **Простой заявке (Order)**:
   - Имя, email, телефон
   - Telegram (если указан)
   - Сообщение клиента

2. **Подробной заявке (DetailedApplication)**:
   - Все контактные данные
   - Информация о проекте
   - Бюджет и сроки
   - Подробное описание

## Безопасность

- Все webhook запросы защищены секретным ключом (`BOT_WEBHOOK_SECRET`)
- Рекомендуется использовать сложный случайный ключ
- Для production используйте HTTPS для webhook endpoints

## Локальная разработка (без Docker)

### Установка зависимостей

```bash
cd telegram-bot
pip install -r requirements.txt
```

### Настройка .env

Создайте файл `.env` в папке `telegram-bot/`:
```env
TELEGRAM_BOT_TOKEN=your_token
TELEGRAM_ADMIN_ID=your_id
WEBAPP_URL=http://localhost:3000
BOT_WEBHOOK_SECRET=your_secret
WEBHOOK_PORT=3001
```

### Запуск

```bash
# В одном терминале - webhook сервер
python webhook_server.py

# В другом терминале - бот
python bot.py
```

## Troubleshooting

### Бот не отвечает на /start

- Проверьте правильность токена в `.env`
- Убедитесь, что контейнер `telegram-bot` запущен: `docker ps`
- Проверьте логи: `docker-compose logs telegram-bot`

### Уведомления не приходят

1. Проверьте, что `TELEGRAM_ADMIN_ID` правильный (это ваш личный ID, а не ID бота)
2. Убедитесь, что webhook сервер доступен из frontend контейнера
3. Проверьте, что `BOT_WEBHOOK_SECRET` одинаковый в `.env` и используется в коде
4. Проверьте логи frontend: `docker-compose logs frontend | grep telegram`
5. Проверьте логи бота: `docker-compose logs telegram-bot`

### Ошибка подключения к webhook

- Убедитесь, что `BOT_WEBHOOK_URL` в frontend указывает на правильный адрес
- В Docker: `http://telegram-bot:3001`
- Проверьте, что оба контейнера в одной сети: `docker network inspect hacktaika-network`

## Production

Для production обновите в `.env`:

```env
WEBAPP_URL=https://yourdomain.com
BOT_WEBHOOK_SECRET=super_secure_random_key_123abc
```

И в `docker-compose.prod.yml` убедитесь, что telegram-bot сервис настроен аналогично.

## Дополнительно

### Изменение приветственного сообщения

Отредактируйте файл `telegram-bot/bot.py`, функцию `cmd_start()`.

### Изменение формата уведомлений

Отредактируйте функции `send_order_notification()` и `send_application_notification()` в `telegram-bot/bot.py`.

### Добавление новых команд

Добавьте обработчики в `telegram-bot/bot.py`:

```python
@dp.message(Command('help'))
async def cmd_help(message: types.Message):
    await message.answer("Справка по командам...")
```

## Полезные ссылки

- [Документация aiogram](https://docs.aiogram.dev/)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather команды](https://core.telegram.org/bots#botfather)
