#!/bin/bash

# Скрипт для первоначальной настройки проекта Andex Events
# Использование: ./setup.sh

set -e

echo "🚀 Начинаем настройку проекта Andex Events..."

# Проверка наличия необходимых инструментов
check_dependency() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 не установлен. Пожалуйста, установите $1 и повторите попытку."
        exit 1
    fi
}

echo "🔍 Проверяем зависимости..."
check_dependency "docker"
check_dependency "docker-compose"
check_dependency "node"
check_dependency "python3"

# Создание .env файла если его нет
if [ ! -f .env ]; then
    echo "📝 Создаем .env файл..."
    cp .env.example .env
    echo "✅ .env файл создан. Пожалуйста, отредактируйте его с вашими настройками."
else
    echo "✅ .env файл уже существует"
fi

# Backend setup
echo "🐍 Настраиваем backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "📦 Создаем виртуальное окружение Python..."
    python3 -m venv venv
fi

echo "🔄 Активируем виртуальное окружение и устанавливаем зависимости..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Backend настроен"
cd ..

# Frontend setup
echo "⚛️ Настраиваем frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "📦 Устанавливаем зависимости Node.js..."
    npm install
else
    echo "🔄 Обновляем зависимости Node.js..."
    npm update
fi

echo "✅ Frontend настроен"
cd ..

# Mobile setup (Flutter)
echo "📱 Проверяем Flutter..."
if command -v flutter &> /dev/null; then
    echo "🔄 Настраиваем мобильное приложение..."
    cd mobile
    flutter pub get
    echo "✅ Mobile приложение настроено"
    cd ..
else
    echo "⚠️ Flutter не установлен. Пропускаем настройку мобильного приложения."
    echo "💡 Для работы с мобильным приложением установите Flutter: https://flutter.dev/"
fi

# Docker setup
echo "🐳 Проверяем Docker setup..."
if docker-compose config > /dev/null 2>&1; then
    echo "✅ Docker Compose конфигурация корректна"
else
    echo "❌ Ошибка в Docker Compose конфигурации"
    exit 1
fi

# Создание необходимых директорий
echo "📁 Создаем необходимые директории..."
mkdir -p uploads
mkdir -p logs
mkdir -p shared

echo "🎉 Настройка завершена!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Отредактируйте .env файл с вашими настройками"
echo "2. Получите API ключ Яндекс.Карт: https://developer.tech.yandex.ru/"
echo "3. Добавьте ключ в .env как YANDEX_MAPS_API_KEY"
echo "4. Запустите проект:"
echo "   docker-compose up -d     # Запуск всех сервисов"
echo "   или"
echo "   ./run-dev.sh            # Запуск в режиме разработки"
echo ""
echo "📚 Полная документация: docs/yandex-maps-setup.md"