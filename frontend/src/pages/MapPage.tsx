import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Fab,
  SelectChangeEvent
} from '@mui/material';
import { MyLocation as MyLocationIcon } from '@mui/icons-material';
import YandexMap from '../components/YandexMap';
import { useGeolocation } from '../hooks/useGeolocation';
import { eventsAPI } from '../services/events';
import { Event, MapBounds } from '../types';
import { useQuery } from 'react-query';

const MapPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([55.76, 37.64]); // Москва по умолчанию
  
  const { latitude, longitude, error: geoError, loading: geoLoading, refreshLocation } = useGeolocation();

  // Загрузка категорий
  const { data: categories = [] } = useQuery(
    'categories',
    eventsAPI.getCategories,
    {
      staleTime: 5 * 60 * 1000, // 5 минут
    }
  );

  // Загрузка событий в границах карты
  const { 
    data: eventsData, 
    isLoading: eventsLoading, 
    error: eventsError 
  } = useQuery(
    ['mapEvents', mapBounds, selectedCategory],
    () => {
      if (!mapBounds) return Promise.resolve({ events: [], total_count: 0 });
      return eventsAPI.getEventsInBounds(mapBounds, selectedCategory || undefined);
    },
    {
      enabled: !!mapBounds,
      staleTime: 2 * 60 * 1000, // 2 минуты
    }
  );

  // Обновление центра карты при получении геолокации
  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handleCategoryChange = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value);
  };

  const handleBoundsChange = (bounds: MapBounds) => {
    setMapBounds(bounds);
  };

  const handleEventClick = (event: Event) => {
    // Здесь можно добавить навигацию к деталям события
    console.log('Event clicked:', event);
  };

  const handleMyLocationClick = () => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
    } else {
      refreshLocation();
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Карта мероприятий
      </Typography>

      {/* Фильтры */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Категория</InputLabel>
            <Select
              value={selectedCategory}
              label="Категория"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">
                <em>Все категории</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {eventsData && (
            <Typography variant="body2" color="text.secondary">
              Найдено мероприятий: {eventsData.total_count}
            </Typography>
          )}

          {eventsLoading && (
            <CircularProgress size={24} />
          )}
        </Box>
      </Paper>

      {/* Ошибки */}
      {geoError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {geoError}
        </Alert>
      )}

      {eventsError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Ошибка загрузки мероприятий
        </Alert>
      )}

      {/* Карта */}
      <Paper sx={{ height: 600, position: 'relative', overflow: 'hidden' }}>
        <YandexMap
          events={eventsData?.events || []}
          center={mapCenter}
          zoom={12}
          onBoundsChange={handleBoundsChange}
          onEventClick={handleEventClick}
          height="100%"
        />

        {/* Кнопка "Моё местоположение" */}
        <Fab
          color="primary"
          aria-label="my location"
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            zIndex: 1000,
          }}
          onClick={handleMyLocationClick}
          disabled={geoLoading}
        >
          {geoLoading ? <CircularProgress size={24} /> : <MyLocationIcon />}
        </Fab>
      </Paper>

      {/* Информация о геолокации */}
      {latitude && longitude && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Ваше местоположение: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MapPage;