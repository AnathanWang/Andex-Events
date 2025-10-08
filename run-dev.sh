#!/bin/bash

# Скрипт для запуска проекта в режиме разработки
# Использование: ./run-dev.sh

set -e

echo "🚀 Запускаем Andex Events в режиме разработки..."

# Проверка .env файла
if [ ! -f .env ]; then
    echo "❌ .env файл не найден. Запустите ./setup.sh для первоначальной настройки."
    exit 1
fi

# Загружаем переменные окружения
export $(cat .env | grep -v '^#' | xargs)

# Функция для остановки всех процессов при завершении
cleanup() {
    echo "🛑 Останавливаем сервисы..."
    pkill -f "uvicorn main:app" || true
    pkill -f "npm start" || true
    pkill -f "flutter run" || true
    exit 0
}

trap cleanup SIGINT SIGTERM

# Запуск базы данных и Redis через Docker
echo "🗄️ Запускаем базу данных и Redis..."
docker-compose up -d postgres redis

# Ожидание готовности базы данных
echo "⏳ Ожидаем готовности базы данных..."
sleep 10

# Запуск backend
echo "🐍 Запускаем backend..."
cd backend
source venv/bin/activate

# Применяем миграции (если есть alembic)
if [ -f "alembic.ini" ]; then
    echo "📊 Применяем миграции базы данных..."
    alembic upgrade head
fi

# Запускаем FastAPI сервер в фоне
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "✅ Backend запущен (PID: $BACKEND_PID)"
cd ..

# Ожидание запуска backend
echo "⏳ Ожидаем запуска backend..."
sleep 5

# Запуск frontend
echo "⚛️ Запускаем frontend..."
cd frontend
npm start &
FRONTEND_PID=$!
echo "✅ Frontend запущен (PID: $FRONTEND_PID)"
cd ..

# Запуск мобильного приложения (опционально)
if command -v flutter &> /dev/null; then
    read -p "🤔 Запустить мобильное приложение? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📱 Запускаем мобильное приложение..."
        cd mobile
        flutter run &
        MOBILE_PID=$!
        echo "✅ Мобильное приложение запущено (PID: $MOBILE_PID)"
        cd ..
    fi
fi

echo ""
echo "🎉 Все сервисы запущены!"
echo ""
echo "🌐 Доступные URL:"
echo "   Backend API: http://localhost:8000"
echo "   API Docs: http://localhost:8000/docs"
echo "   Frontend: http://localhost:3000"
echo "   Database: postgresql://postgres:password@localhost:5432/andex_events"
echo "   Redis: redis://localhost:6379"
echo ""
echo "📊 Мониторинг логов:"
echo "   Backend: tail -f backend/logs/app.log"
echo "   Frontend: проверьте консоль браузера"
echo ""
echo "💡 Полезные команды:"
echo "   docker-compose logs postgres  # Логи базы данных"
echo "   docker-compose logs redis     # Логи Redis"
echo ""
echo "🛑 Для остановки нажмите Ctrl+C"

# Ожидание завершения
wait