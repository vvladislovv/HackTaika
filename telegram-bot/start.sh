#!/bin/bash

# Скрипт для запуска обоих компонентов бота:
# 1. Webhook сервер для получения уведомлений
# 2. Polling бот для команд пользователей

echo "Starting Telegram Bot services..."

# Запускаем webhook сервер в фоне
python webhook_server.py &
WEBHOOK_PID=$!

# Даем время на запуск webhook сервера
sleep 2

# Запускаем бота с polling
python bot.py &
BOT_PID=$!

echo "Bot services started:"
echo "  Webhook server PID: $WEBHOOK_PID"
echo "  Bot polling PID: $BOT_PID"

# Ждем завершения любого процесса
wait -n

# Если один из процессов упал, завершаем второй
kill $WEBHOOK_PID $BOT_PID 2>/dev/null

echo "Bot services stopped"
