import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'Геолокация не поддерживается браузером',
        loading: false,
      }));
      return;
    }

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'Ошибка получения местоположения';
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Доступ к геолокации запрещен';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Информация о местоположении недоступна';
          break;
        case error.TIMEOUT:
          errorMessage = 'Время ожидания геолокации истекло';
          break;
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 минут
    });
  }, []);

  const refreshLocation = () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          error: 'Не удалось обновить местоположение',
          loading: false,
        }));
      }
    );
  };

  return {
    ...state,
    refreshLocation,
  };
};