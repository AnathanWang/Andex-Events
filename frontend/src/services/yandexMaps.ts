import api from './api';

export interface YandexGeocodingResponse {
  response: {
    GeoObjectCollection: {
      featureMember: Array<{
        GeoObject: {
          Point: {
            pos: string; // "долгота широта"
          };
          name: string;
          description: string;
          metaDataProperty: {
            GeocoderMetaData: {
              Address: {
                formatted: string;
                Components: Array<{
                  kind: string;
                  name: string;
                }>;
              };
            };
          };
        };
      }>;
    };
  };
}

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  address: string;
  name: string;
}

class YandexMapsService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.REACT_APP_YANDEX_MAPS_API_KEY || '';
  }

  // Геокодирование адреса в координаты
  async geocodeAddress(address: string): Promise<GeocodeResult[]> {
    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${this.apiKey}&geocode=${encodeURIComponent(address)}&format=json&results=5&lang=ru_RU`
      );

      if (!response.ok) {
        throw new Error('Ошибка геокодирования');
      }

      const data: YandexGeocodingResponse = await response.json();
      const features = data.response.GeoObjectCollection.featureMember;

      return features.map(feature => {
        const geoObject = feature.GeoObject;
        const [longitude, latitude] = geoObject.Point.pos.split(' ').map(Number);
        
        return {
          latitude,
          longitude,
          address: geoObject.metaDataProperty.GeocoderMetaData.Address.formatted,
          name: geoObject.name
        };
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      throw error;
    }
  }

  // Обратное геокодирование координат в адрес
  async reverseGeocode(latitude: number, longitude: number): Promise<GeocodeResult | null> {
    try {
      const response = await fetch(
        `https://geocode-maps.yandex.ru/1.x/?apikey=${this.apiKey}&geocode=${longitude},${latitude}&format=json&results=1&lang=ru_RU`
      );

      if (!response.ok) {
        throw new Error('Ошибка обратного геокодирования');
      }

      const data: YandexGeocodingResponse = await response.json();
      const features = data.response.GeoObjectCollection.featureMember;

      if (features.length === 0) {
        return null;
      }

      const geoObject = features[0].GeoObject;
      const [lng, lat] = geoObject.Point.pos.split(' ').map(Number);

      return {
        latitude: lat,
        longitude: lng,
        address: geoObject.metaDataProperty.GeocoderMetaData.Address.formatted,
        name: geoObject.name
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  }

  // Поиск организаций поблизости
  async searchNearby(latitude: number, longitude: number, query: string, radius: number = 1000): Promise<any[]> {
    try {
      const response = await fetch(
        `https://search-maps.yandex.ru/v1/?apikey=${this.apiKey}&text=${encodeURIComponent(query)}&ll=${longitude},${latitude}&spn=0.01,0.01&type=biz&lang=ru_RU&results=10`
      );

      if (!response.ok) {
        throw new Error('Ошибка поиска организаций');
      }

      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error('Search nearby error:', error);
      throw error;
    }
  }

  // Получение маршрута между точками
  async getRoute(fromLat: number, fromLng: number, toLat: number, toLng: number): Promise<any> {
    try {
      const response = await fetch(
        `https://api.routing.yandex.net/v2/route?apikey=${this.apiKey}&waypoints=${fromLng},${fromLat}|${toLng},${toLat}&mode=driving&lang=ru_RU`
      );

      if (!response.ok) {
        throw new Error('Ошибка построения маршрута');
      }

      return await response.json();
    } catch (error) {
      console.error('Route error:', error);
      throw error;
    }
  }

  // Статический URL для изображения карты
  getStaticMapUrl(
    latitude: number,
    longitude: number,
    zoom: number = 15,
    width: number = 400,
    height: number = 300,
    markers?: Array<{ lat: number; lng: number; color?: string }>
  ): string {
    let url = `https://static-maps.yandex.ru/1.x/?ll=${longitude},${latitude}&z=${zoom}&size=${width},${height}&l=map&lang=ru_RU`;

    if (markers && markers.length > 0) {
      const markerParams = markers.map(marker => 
        `${marker.lng},${marker.lat},${marker.color || 'red'}`
      ).join('~');
      url += `&pt=${markerParams}`;
    }

    return url;
  }
}

export const yandexMapsService = new YandexMapsService();