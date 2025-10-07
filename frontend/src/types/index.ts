export interface User {
  id: number;
  email: string;
  username: string;
  full_name?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
  price: number;
  max_attendees?: number;
  image_url?: string;
  organizer_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  organizer: User;
}

export interface EventCreate {
  title: string;
  description?: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  address: string;
  latitude: number;
  longitude: number;
  category?: string;
  price: number;
  max_attendees?: number;
  image_url?: string;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface EventsMapResponse {
  events: Event[];
  total_count: number;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  full_name?: string;
}