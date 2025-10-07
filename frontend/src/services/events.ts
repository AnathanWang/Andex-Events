import api from './api';
import { Event, EventCreate, MapBounds, EventsMapResponse } from '../types';

export const eventsAPI = {
  getEvents: async (params?: {
    skip?: number;
    limit?: number;
    category?: string;
    lat?: number;
    lng?: number;
    radius_km?: number;
  }): Promise<Event[]> => {
    const response = await api.get('/events', { params });
    return response.data;
  },

  getEvent: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: EventCreate): Promise<Event> => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id: number, eventData: Partial<EventCreate>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  registerForEvent: async (id: number): Promise<void> => {
    await api.post(`/events/${id}/register`);
  },

  getEventsInBounds: async (bounds: MapBounds, category?: string): Promise<EventsMapResponse> => {
    const params = {
      north: bounds.north,
      south: bounds.south,
      east: bounds.east,
      west: bounds.west,
      ...(category && { category }),
    };
    const response = await api.get('/map/events', { params });
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get('/map/categories');
    return response.data;
  },
};