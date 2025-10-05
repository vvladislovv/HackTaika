import os
import asyncio
import logging
from aiogram import Bot, Dispatcher, types, F
from aiogram.filters import Command
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from dotenv import load_dotenv

load_dotenv()

# Конфигурация
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
ADMIN_ID = int(os.getenv('TELEGRAM_ADMIN_ID'))
WEBAPP_URL = os.getenv('WEBAPP_URL')

# Инициализация
logging.basicConfig(level=logging.INFO)
bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


@dp.message(Command('start'))
async def cmd_start(message: types.Message):
    """Обработчик команды /start с приветствием и кнопкой для Mini App"""
    # Для Mini App Telegram допускает ТОЛЬКО HTTPS URL. Для http (локально) используем обычную ссылку
    buttons_row = []
    if WEBAPP_URL and WEBAPP_URL.lower().startswith('https://'):
        buttons_row.append(
            InlineKeyboardButton(
                text="🚀 Открыть HackTaika",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        )
    elif WEBAPP_URL:
        buttons_row.append(
            InlineKeyboardButton(
                text="🌐 Открыть сайт",
                url=WEBAPP_URL
            )
        )

    keyboard = InlineKeyboardMarkup(inline_keyboard=[[btn] for btn in buttons_row] or [])
    
    welcome_text = (
        "👋 <b>Привет! Добро пожаловать в HackTaika!</b>\n\n"
        "🎯 Мы создаем инновационные цифровые решения:\n"
        "• Веб-приложения\n"
        "• Мобильные приложения\n"
        "• Telegram Mini Apps\n"
        "• CRM системы\n"
        "• E-commerce\n\n"
        "💡 Нажмите на кнопку ниже, чтобы открыть наш сайт и оставить заявку!"
    )
    
    await message.answer(
        welcome_text,
        reply_markup=keyboard,
        parse_mode='HTML'
    )


async def send_order_notification(order_data: dict):
    """Отправка уведомления о новой простой заявке"""
    try:
        message_text = (
            "🔔 <b>Новая заявка!</b>\n\n"
            f"👤 <b>Имя:</b> {order_data.get('name', 'Не указано')}\n"
            f"📧 <b>Email:</b> {order_data.get('email', 'Не указан')}\n"
            f"📞 <b>Телефон:</b> {order_data.get('phone', 'Не указан')}\n"
        )
        
        if order_data.get('telegram'):
            message_text += f"💬 <b>Telegram:</b> {order_data.get('telegram')}\n"
        
        message_text += f"\n📝 <b>Сообщение:</b>\n{order_data.get('message', 'Без сообщения')}\n"
        message_text += f"\n⏰ <b>Время:</b> {order_data.get('createdAt', 'Не указано')}"
        
        await bot.send_message(
            chat_id=ADMIN_ID,
            text=message_text,
            parse_mode='HTML'
        )
        logging.info(f"Order notification sent to admin {ADMIN_ID}")
    except Exception as e:
        logging.error(f"Error sending order notification: {e}")


async def send_application_notification(app_data: dict):
    """Отправка уведомления о новой подробной заявке"""
    try:
        message_text = (
            "🎯 <b>Новая подробная заявка!</b>\n\n"
            "<b>📋 КОНТАКТНЫЕ ДАННЫЕ</b>\n"
            f"👤 <b>Имя:</b> {app_data.get('fullName', 'Не указано')}\n"
            f"📧 <b>Email:</b> {app_data.get('email', 'Не указан')}\n"
            f"📞 <b>Телефон:</b> {app_data.get('phone', 'Не указан')}\n"
        )
        
        if app_data.get('telegram'):
            message_text += f"💬 <b>Telegram:</b> {app_data.get('telegram')}\n"
        
        message_text += (
            f"\n<b>💼 О ПРОЕКТЕ</b>\n"
            f"🏷 <b>Тип:</b> {app_data.get('projectType', 'Не указан')}\n"
            f"🎯 <b>Проблема:</b> {app_data.get('projectProblem', 'Не указана')}\n"
            f"👥 <b>Аудитория:</b> {app_data.get('targetAudience', 'Не указана')}\n"
            f"\n<b>💰 БЮДЖЕТ И СРОКИ</b>\n"
            f"💵 <b>Бюджет:</b> {app_data.get('budget', 'Не указан')}\n"
            f"⏱ <b>Дедлайн:</b> {app_data.get('deadline', 'Не указан')}\n"
            f"\n<b>📝 ОПИСАНИЕ</b>\n"
            f"{app_data.get('description', 'Не указано')}\n"
        )
        
        if app_data.get('additionalInfo'):
            message_text += f"\n<b>ℹ️ ДОПОЛНИТЕЛЬНО</b>\n{app_data.get('additionalInfo')}\n"
        
        message_text += f"\n⏰ <b>Время:</b> {app_data.get('createdAt', 'Не указано')}"
        
        await bot.send_message(
            chat_id=ADMIN_ID,
            text=message_text,
            parse_mode='HTML'
        )
        logging.info(f"Application notification sent to admin {ADMIN_ID}")
    except Exception as e:
        logging.error(f"Error sending application notification: {e}")


async def main():
    """Запуск бота"""
    logging.info("Starting Telegram bot...")
    await dp.start_polling(bot)


if __name__ == '__main__':
    asyncio.run(main())
