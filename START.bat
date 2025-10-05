@echo off
echo 🚀 Запуск проекта HackTaika...
echo.

REM Проверка Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker не установлен. Установите Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose не установлен.
    pause
    exit /b 1
)

echo ✅ Docker найден

REM Создание .env если не существует
if not exist "frontend\.env" (
    echo 📝 Создание .env файла...
    (
        echo DATABASE_URL="postgresql://hacktaika:hacktaika_password@postgres:5432/hacktaika_db"
        echo NEXTAUTH_SECRET="your-super-secret-key-change-in-production-please-use-openssl-rand-base64-32"
        echo NEXTAUTH_URL="http://localhost:3000"
    ) > frontend\.env
    echo ✅ .env файл создан
)

REM Запуск контейнеров
echo 🐳 Запуск Docker контейнеров...
docker-compose up -d

echo.
echo ⏳ Ожидание запуска сервисов (это может занять 2-3 минуты)...
timeout /t 30 /nobreak >nul

echo.
echo 🎉 Проект успешно запущен!
echo.
echo 📍 Доступные адреса:
echo    Главная страница: http://localhost:3000
echo    Админ-панель: http://localhost:3000/admin
echo.
echo 🔐 Создайте администратора:
echo    docker exec hacktaika-frontend npm run create-admin
echo.
echo 📚 Полезные команды:
echo    Остановить: docker-compose down
echo    Логи: docker-compose logs -f
echo    Пересобрать: docker-compose up -d --build
echo.
echo 📖 Документация: AUTOMATION.md
echo.
echo ✨ Готово! Откройте http://localhost:3000 в браузере
pause

