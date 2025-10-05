# Telegram Bot для HackTaika

Telegram бот для уведомлений о новых заявках с сайта HackTaika.

## Возможности

- 🤖 Приветственное сообщение при `/start`
- 🌐 Кнопка для перехода на сайт через Mini App
- 📬 Уведомления о новых простых заявках (Order)
- 📋 Уведомления о подробных заявках (DetailedApplication)
- 🔒 Защищенные webhook endpoints с секретным ключом

## Установка

### Локальная разработка

1. Установите зависимости:
```bash
pip install -r requirements.txt
```

2. Создайте `.env` файл:
```bash
cp .env.example .env
```

3. Заполните переменные окружения:
```env
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
TELEGRAM_ADMIN_ID=your_telegram_user_id
WEBAPP_URL=https://yourdomain.com
BOT_WEBHOOK_SECRET=your_secret_key
```

### Как получить токен бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям для создания бота
4. Скопируйте полученный токен в `.env`

### Как узнать свой Telegram ID

1. Откройте [@userinfobot](https://t.me/userinfobot)
2. Нажмите `/start`
3. Бот отправит вам ваш ID
4. Скопируйте ID в `.env` как `TELEGRAM_ADMIN_ID`

## Запуск

### Запуск обоих сервисов (рекомендуется)

```bash
chmod +x start.sh
./start.sh
```

### Запуск только бота (для команд пользователей)

```bash
python bot.py
```

### Запуск только webhook сервера (для уведомлений)

```bash
python webhook_server.py
```

## Docker

### Сборка образа

```bash
docker build -t hacktaika-telegram-bot .
```

### Запуск контейнера

```bash
docker run -d \
  --name telegram-bot \
  --env-file .env \
  -p 3001:3001 \
  hacktaika-telegram-bot
```

## Интеграция с Next.js

В Next.js API роутах добавьте отправку webhook после создания заявки:

```typescript
// Пример для /api/orders/route.ts
const notifyTelegram = async (orderData: any) => {
  try {
    await fetch(process.env.BOT_WEBHOOK_URL + '/webhook/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Secret': process.env.BOT_WEBHOOK_SECRET || '',
      },
      body: JSON.stringify(orderData),
    });
  } catch (error) {
    console.error('Error notifying telegram:', error);
  }
};

// После создания заявки
await notifyTelegram({
  name: order.name,
  email: order.email,
  phone: order.phone,
  telegram: order.telegram,
  message: order.message,
  createdAt: order.createdAt.toISOString(),
});
```

## API Endpoints

### POST /webhook/order
Уведомление о простой заявке

**Headers:**
- `X-Webhook-Secret`: секретный ключ для авторизации
- `Content-Type`: application/json

**Body:**
```json
{
  "name": "Иван Иванов",
  "email": "ivan@example.com",
  "phone": "+7 999 123-45-67",
  "telegram": "@username",
  "message": "Хочу заказать сайт",
  "createdAt": "2025-10-05T12:00:00Z"
}
```

### POST /webhook/application
Уведомление о подробной заявке

**Headers:**
- `X-Webhook-Secret`: секретный ключ для авторизации
- `Content-Type`: application/json

**Body:**
```json
{
  "fullName": "Иван Иванов",
  "email": "ivan@example.com",
  "phone": "+7 999 123-45-67",
  "telegram": "@username",
  "projectType": "Интернет-магазин",
  "projectProblem": "Описание проблемы",
  "targetAudience": "Молодые родители",
  "budget": "150 000 - 300 000 ₽",
  "deadline": "1-2 месяца",
  "description": "Подробное описание проекта",
  "additionalInfo": "Дополнительная информация",
  "createdAt": "2025-10-05T12:00:00Z"
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "service": "telegram-bot-webhook"
}
```

## Структура проекта

```
telegram-bot/
├── bot.py                  # Основной бот (команды, уведомления)
├── webhook_server.py       # Webhook сервер для приема уведомлений
├── requirements.txt        # Python зависимости
├── Dockerfile             # Docker образ
├── start.sh               # Скрипт запуска обоих сервисов
├── .env.example           # Пример конфигурации
└── README.md              # Документация
```

## Переменные окружения

| Переменная | Описание | Обязательная |
|------------|----------|--------------|
| `TELEGRAM_BOT_TOKEN` | Токен бота от BotFather | Да |
| `TELEGRAM_ADMIN_ID` | ID администратора для уведомлений | Да |
| `WEBAPP_URL` | URL сайта HackTaika | Да |
| `BOT_WEBHOOK_SECRET` | Секретный ключ для webhook | Да |
| `WEBHOOK_PORT` | Порт для webhook сервера (по умолчанию 3001) | Нет |

## Логирование

Все логи выводятся в stdout. В Docker можно смотреть логи через:

```bash
docker logs -f telegram-bot
```

## Безопасность

- Все webhook запросы защищены секретным ключом (`X-Webhook-Secret`)
- Рекомендуется использовать HTTPS для webhook endpoints
- Не храните токен бота в репозитории - используйте `.env` файл

## Troubleshooting

### Бот не отвечает на команды
- Проверьте, что `bot.py` запущен
- Убедитесь, что токен бота правильный
- Проверьте логи на наличие ошибок

### Уведомления не приходят
- Проверьте, что `webhook_server.py` запущен
- Убедитесь, что `TELEGRAM_ADMIN_ID` правильный
- Проверьте, что секретный ключ совпадает в боте и Next.js
- Убедитесь, что Next.js может достучаться до webhook сервера

### Ошибка при запуске в Docker
- Проверьте, что все переменные окружения заполнены в `.env`
- Убедитесь, что порт 3001 не занят другим сервисом
