"""
Webhook сервер для получения уведомлений о новых заявках из Next.js API
"""
import os
import logging
from aiohttp import web
from dotenv import load_dotenv
import asyncio
from bot import send_order_notification, send_application_notification, bot

load_dotenv()

WEBHOOK_SECRET = os.getenv('BOT_WEBHOOK_SECRET', 'default_secret')
PORT = int(os.getenv('WEBHOOK_PORT', 3001))

logging.basicConfig(level=logging.INFO)


async def handle_order_webhook(request):
    """Обработчик webhook для простых заявок"""
    try:
        # Проверка секретного ключа
        secret = request.headers.get('X-Webhook-Secret')
        if secret != WEBHOOK_SECRET:
            logging.warning("Invalid webhook secret")
            return web.json_response({'error': 'Unauthorized'}, status=401)
        
        data = await request.json()
        logging.info(f"Received order webhook: {data}")
        
        # Отправка уведомления в Telegram
        await send_order_notification(data)
        
        return web.json_response({'success': True, 'message': 'Notification sent'})
    except Exception as e:
        logging.error(f"Error handling order webhook: {e}")
        return web.json_response({'error': str(e)}, status=500)


async def handle_application_webhook(request):
    """Обработчик webhook для подробных заявок"""
    try:
        # Проверка секретного ключа
        secret = request.headers.get('X-Webhook-Secret')
        if secret != WEBHOOK_SECRET:
            logging.warning("Invalid webhook secret")
            return web.json_response({'error': 'Unauthorized'}, status=401)
        
        data = await request.json()
        logging.info(f"Received application webhook: {data}")
        
        # Отправка уведомления в Telegram
        await send_application_notification(data)
        
        return web.json_response({'success': True, 'message': 'Notification sent'})
    except Exception as e:
        logging.error(f"Error handling application webhook: {e}")
        return web.json_response({'error': str(e)}, status=500)


async def handle_health(request):
    """Health check endpoint"""
    return web.json_response({'status': 'ok', 'service': 'telegram-bot-webhook'})


async def init_app():
    """Инициализация приложения"""
    app = web.Application()
    app.router.add_post('/webhook/order', handle_order_webhook)
    app.router.add_post('/webhook/application', handle_application_webhook)
    app.router.add_get('/health', handle_health)
    return app


async def main():
    """Запуск сервера"""
    app = await init_app()
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', PORT)
    await site.start()
    
    logging.info(f"Webhook server started on port {PORT}")
    logging.info(f"Endpoints:")
    logging.info(f"  POST /webhook/order - для простых заявок")
    logging.info(f"  POST /webhook/application - для подробных заявок")
    logging.info(f"  GET /health - health check")
    
    # Держим сервер запущенным
    await asyncio.Event().wait()


if __name__ == '__main__':
    asyncio.run(main())
