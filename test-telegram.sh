#!/bin/bash

echo "🧪 Тест интеграции Telegram бота"
echo ""
echo "Отправляю тестовую заявку..."
echo ""

response=$(curl -s -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Иван Иванов",
    "email": "ivan@example.com",
    "phone": "+7 999 555 12 34",
    "telegram": "@ivan_test",
    "message": "Хочу заказать интернет-магазин на Next.js"
  }')

if [ $? -eq 0 ]; then
    echo "✅ Заявка успешно отправлена!"
    echo ""
    echo "Данные заявки:"
    echo "$response" | jq '.' 2>/dev/null || echo "$response"
    echo ""
    echo "📱 Проверьте Telegram - уведомление должно прийти на ID: 7300593025"
    echo ""
    echo "Проверяем логи бота..."
    sleep 2
    docker-compose logs telegram-bot | tail -5
else
    echo "❌ Ошибка отправки заявки"
fi
