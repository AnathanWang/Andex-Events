# Andex Events - Локальные мероприятия на карте

Полнофункциональное приложение для отображения и управления локальными мероприятиями с интеграцией карт.

## 🚀 Технологический стек

### Backend
- **Python FastAPI** - Быстрый и современный веб-фреймворк
- **PostgreSQL** - Основная база данных
- **Redis** - Кэширование и сессии
- **SQLAlchemy** - ORM для работы с БД
- **Alembic** - Миграции базы данных
- **JWT** - Аутентификация
- **Uvicorn** - ASGI сервер

### Frontend (Web)
- **React 18** с TypeScript
- **Material-UI (MUI)** - UI компоненты
- **React Query** - Управление состоянием и кэширование
- **React Router** - Маршрутизация
- **Leaflet/Google Maps** - Интеграция карт
- **Axios** - HTTP клиент

### Mobile
- **Flutter** - Кроссплатформенная разработка
- **Provider** - Управление состоянием
- **Google Maps Flutter** - Карты для мобильных
- **Go Router** - Навигация
- **Dio** - HTTP клиент

## 📁 Структура проекта

```
Andex-Events/
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   │   └── routes/     # Маршруты API
│   │   ├── core/           # Основные настройки
│   │   ├── db/             # База данных
│   │   ├── models/         # Модели и схемы
│   │   └── services/       # Бизнес-логика
│   ├── tests/              # Тесты
│   ├── main.py            # Точка входа
│   └── requirements.txt    # Зависимости Python
├── frontend/               # React web приложение
│   ├── src/
│   │   ├── components/     # React компоненты
│   │   ├── pages/          # Страницы
│   │   ├── services/       # API сервисы
│   │   ├── hooks/          # React hooks
│   │   └── types/          # TypeScript типы
│   └── package.json        # Зависимости Node.js
├── mobile/                 # Flutter мобильное приложение
│   ├── lib/
│   │   ├── models/         # Dart модели
│   │   ├── services/       # API сервисы
│   │   ├── screens/        # Экраны приложения
│   │   ├── widgets/        # Flutter виджеты
│   │   └── providers/      # State management
│   └── pubspec.yaml        # Зависимости Flutter
├── shared/                 # Общие ресурсы
├── docker-compose.yml      # Docker конфигурация
└── .env.example           # Пример переменных окружения
```

## 🛠 Установка и настройка

### 1. Клонирование репозитория
```bash
git clone https://github.com/AnathanWang/Andex-Events.git
cd Andex-Events
```

### 2. Настройка переменных окружения
```bash
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
```

### 3. Запуск с Docker (рекомендуется)
```bash
docker-compose up -d
```

### 4. Ручная установка

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # На Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### Mobile
```bash
cd mobile
flutter pub get
flutter run
```

## 🗄 База данных

Создайте PostgreSQL базу данных и выполните миграции:

```bash
cd backend
alembic upgrade head
```

## 🗺 Настройка карт

### Google Maps
1. Получите API ключ в [Google Cloud Console](https://console.cloud.google.com/)
2. Включите следующие API:
   - Maps JavaScript API
   - Places API
   - Geocoding API
3. Добавьте ключ в `.env` файл

### Для мобильного приложения
Добавьте API ключ в соответствующие конфигурационные файлы:
- `android/app/src/main/AndroidManifest.xml`
- `ios/Runner/AppDelegate.swift`

## 📱 Функциональность

### Основные возможности
- 🗺 **Интерактивная карта** с отображением мероприятий
- 📍 **Геолокация** и поиск по расстоянию
- 👤 **Регистрация и аутентификация** пользователей
- 📅 **Создание и управление** мероприятиями
- 🔍 **Поиск и фильтрация** по категориям
- 📱 **Адаптивный дизайн** для мобильных и десктопа
- 🔔 **Регистрация на мероприятия**
- 📊 **Профиль организатора**

### API Endpoints

#### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/auth/me` - Текущий пользователь

#### События
- `GET /api/events` - Список событий
- `POST /api/events` - Создание события
- `GET /api/events/{id}` - Детали события
- `PUT /api/events/{id}` - Обновление события
- `DELETE /api/events/{id}` - Удаление события
- `POST /api/events/{id}/register` - Регистрация на событие

#### Карта
- `GET /api/map/events` - События в границах карты
- `GET /api/map/categories` - Категории событий

## 🧪 Тестирование

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

### Mobile
```bash
cd mobile
flutter test
```

## 🚀 Развертывание

### Production
1. Настройте production переменные окружения
2. Соберите Docker образы
3. Настройте reverse proxy (nginx)
4. Настройте SSL сертификаты
5. Настройте мониторинг и логи

### Heroku
```bash
heroku create andex-events-backend
git subtree push --prefix=backend heroku main
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit изменения (`git commit -m 'Add some AmazingFeature'`)
4. Push в branch (`git push origin feature/AmazingFeature`)
5. Создайте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 👥 Авторы

- **AnathanWang** - *Основной разработчик* - [AnathanWang](https://github.com/AnathanWang)

## 🙏 Благодарности

- FastAPI за отличный фреймворк
- React и Flutter команды за инструменты разработки
- Сообщество открытого исходного кода

---

📧 **Контакты:** При возникновении вопросов создавайте Issues в репозитории.
Приложение для отображения событий города на карте. Реализовано на Flutter (Android, iOS, Web) с бэкендом на Python (FastAPI). Пользователи могут просматривать события на карте, фильтровать их и открывать подробности. Бэкенд хранит данные в БД и отдаёт их через REST API.
