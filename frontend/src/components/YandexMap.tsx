import React, { useState, useEffect } from 'react';
import { YMaps, Map, Placemark, ZoomControl, SearchControl, TypeSelector } from 'react-yandex-maps';
import { Event } from '../types';
import { Box, Card, CardContent, Typography, Chip } from '@mui/material';

interface YandexMapProps {
  events: Event[];
  center?: [number, number];
  zoom?: number;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  onEventClick?: (event: Event) => void;
  height?: string | number;
}

const YandexMap: React.FC<YandexMapProps> = ({
  events,
  center = [55.76, 37.64], // Москва по умолчанию
  zoom = 10,
  onBoundsChange,
  onEventClick,
  height = 400
}) => {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const apiKey = process.env.REACT_APP_YANDEX_MAPS_API_KEY || '';

  // Обработчик изменения границ карты
  const handleBoundsChange = (e: any) => {
    if (onBoundsChange && mapInstance) {
      const bounds = mapInstance.getBounds();
      if (bounds) {
        onBoundsChange({
          north: bounds[1][0],
          south: bounds[0][0],
          east: bounds[1][1],
          west: bounds[0][1]
        });
      }
    }
  };

  // Получение цвета маркера по категории
  const getMarkerColor = (category?: string): string => {
    const colors: { [key: string]: string } = {
      'музыка': '#FF6B6B',
      'спорт': '#4ECDC4',
      'искусство': '#45B7D1',
      'образование': '#96CEB4',
      'технологии': '#FFEAA7',
      'еда': '#DDA0DD',
      'бизнес': '#98D8C8',
      'развлечения': '#F7DC6F'
    };
    return colors[category?.toLowerCase() || ''] || '#74B9FF';
  };

  // Обработчик клика по маркеру
  const handlePlacemarkClick = (event: Event) => {
    setSelectedEvent(event);
    if (onEventClick) {
      onEventClick(event);
    }
  };

  return (
    <Box sx={{ height, width: '100%', position: 'relative' }}>
      <YMaps
        query={{
          apikey: apiKey,
          lang: 'ru_RU'
        }}
      >
        <Map
          defaultState={{ center, zoom }}
          width="100%"
          height="100%"
          onLoad={setMapInstance}
          onBoundsChange={handleBoundsChange}
        >
          {/* Элементы управления */}
          <ZoomControl />
          <SearchControl options={{ float: 'right' }} />
          <TypeSelector options={{ float: 'right' }} />

          {/* Маркеры событий */}
          {events.map((event) => (
            <Placemark
              key={event.id}
              geometry={[event.latitude, event.longitude]}
              onClick={() => handlePlacemarkClick(event)}
              options={{
                preset: 'islands#circleIcon',
                iconColor: getMarkerColor(event.category)
              }}
              properties={{
                balloonContentHeader: event.title,
                balloonContentBody: `
                  <div>
                    <p><strong>Место:</strong> ${event.location_name}</p>
                    <p><strong>Адрес:</strong> ${event.address}</p>
                    <p><strong>Дата:</strong> ${new Date(event.start_datetime).toLocaleString('ru-RU')}</p>
                    ${event.price > 0 ? `<p><strong>Цена:</strong> ${event.price}₽</p>` : '<p><strong>Бесплатно</strong></p>'}
                    ${event.description ? `<p>${event.description}</p>` : ''}
                  </div>
                `,
                balloonContentFooter: event.category ? `<small>Категория: ${event.category}</small>` : ''
              }}
            />
          ))}
        </Map>
      </YMaps>

      {/* Карточка выбранного события */}
      {selectedEvent && (
        <Card
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            width: 300,
            maxHeight: 200,
            overflow: 'auto',
            zIndex: 1000
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {selectedEvent.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📍 {selectedEvent.location_name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              📅 {new Date(selectedEvent.start_datetime).toLocaleString('ru-RU')}
            </Typography>
            {selectedEvent.category && (
              <Chip
                label={selectedEvent.category}
                size="small"
                sx={{ backgroundColor: getMarkerColor(selectedEvent.category), color: 'white' }}
              />
            )}
            <Typography variant="body2" sx={{ mt: 1 }}>
              {selectedEvent.price > 0 ? `${selectedEvent.price}₽` : 'Бесплатно'}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default YandexMap;