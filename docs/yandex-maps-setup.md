# Настройка Яндекс.Карт для Andex Events

## 🗝 Получение API ключа

### 1. Регистрация в Яндекс
1. Перейдите на [developer.tech.yandex.ru](https://developer.tech.yandex.ru/)
2. Войдите в систему или зарегистрируйтесь
3. Перейдите в раздел "Карты" → "JavaScript API и HTTP Геокодер"

### 2. Создание приложения
1. Нажмите "Создать новый ключ"
2. Выберите тип "Веб-приложение" для фронтенда
3. Укажите домены вашего приложения (localhost для разработки)
4. Получите API ключ

### 3. Настройка лимитов
- **Бесплатный тариф**: 1000 запросов/день
- **Платные тарифы**: от 20₽ за 1000 запросов
- Рекомендуется настроить уведомления о превышении лимитов

## ⚙️ Настройка проекта

### Frontend (React)
1. Добавьте ключ в `.env`:
```bash
REACT_APP_YANDEX_MAPS_API_KEY=your_api_key_here
```

2. Установите зависимости:
```bash
cd frontend
npm install react-yandex-maps @types/yandex-maps
```

### Backend (FastAPI)
1. Добавьте ключ в `.env`:
```bash
YANDEX_MAPS_API_KEY=your_api_key_here
```

### Mobile (Flutter)
1. Добавьте зависимость в `pubspec.yaml`:
```yaml
dependencies:
  yandex_mapkit: ^4.0.0
```

2. **Android** - добавьте ключ в `android/app/src/main/AndroidManifest.xml`:
```xml
<application>
    <meta-data
        android:name="com.yandex.mapkit.ApiKey"
        android:value="your_api_key_here"/>
</application>
```

3. **iOS** - добавьте в `ios/Runner/AppDelegate.swift`:
```swift
import YandexMapsMobile

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    YMKMapKit.setApiKey("your_api_key_here")
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}
```

## 🌍 Доступные API

### 1. JavaScript API
- Интерактивные карты
- Маркеры и балуны
- Построение маршрутов
- Геолокация

### 2. HTTP Геокодер
- Прямое геокодирование (адрес → координаты)
- Обратное геокодирование (координаты → адрес)
- Поиск организаций

### 3. Static API
- Статичные изображения карт
- Маркеры на статичных картах
- Кэширование изображений

### 4. Router API
- Построение маршрутов
- Расчет времени в пути
- Пробки и альтернативные маршруты

## 🎨 Кастомизация

### Стили карт
```javascript
// Темная тема
const mapTheme = 'dark';

// Скрытие элементов интерфейса
const controls = {
  zoomControl: true,
  searchControl: false,
  typeSelector: true,
  fullscreenControl: false
};
```

### Иконки маркеров
```javascript
// Категории событий и их цвета
const categoryColors = {
  'музыка': '#FF6B6B',
  'спорт': '#4ECDC4', 
  'искусство': '#45B7D1',
  'образование': '#96CEB4',
  'технологии': '#FFEAA7',
  'еда': '#DDA0DD',
  'бизнес': '#98D8C8',
  'развлечения': '#F7DC6F'
};
```

## 🚀 Оптимизация

### 1. Кэширование
- Используйте localStorage для кэширования геокодированных адресов
- Кэшируйте результаты поиска организаций
- Ограничивайте частоту запросов к API

### 2. Батчинг запросов
```javascript
// Группируйте запросы геокодирования
const geocodeBatch = async (addresses) => {
  const promises = addresses.map(addr => 
    yandexMapsService.geocodeAddress(addr)
  );
  return Promise.all(promises);
};
```

### 3. Ленивая загрузка
- Загружайте API только при необходимости
- Используйте динамические импорты для компонентов карт

## 🔒 Безопасность

### 1. Ограничения домена
- Настройте доменные ограничения в консоли разработчика
- Используйте разные ключи для разработки и продакшена

### 2. Скрытие ключей
```bash
# Никогда не коммитьте ключи в Git!
# Используйте переменные окружения
echo "REACT_APP_YANDEX_MAPS_API_KEY=your_key" >> .env.local
```

## 📊 Мониторинг

### 1. Использование API
- Отслеживайте количество запросов в консоли разработчика
- Настройте алерты при приближении к лимитам

### 2. Производительность
- Мониторьте время загрузки карт
- Отслеживайте ошибки геокодирования

## 🐛 Частые проблемы

### 1. "API key not valid"
- Проверьте правильность ключа
- Убедитесь, что домен добавлен в настройки

### 2. Медленная загрузка карт
- Используйте CDN для статических ресурсов
- Оптимизируйте размер и количество маркеров

### 3. Ошибки CORS
- Настройте домены в консоли разработчика
- Используйте прокси для development сервера

## 📞 Поддержка

- **Документация**: [tech.yandex.ru/maps](https://tech.yandex.ru/maps/)
- **Форум разработчиков**: [yandex.ru/dev/maps/](https://yandex.ru/dev/maps/)
- **Техподдержка**: через консоль разработчика