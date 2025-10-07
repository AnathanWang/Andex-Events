from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import datetime

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None

class User(UserBase):
    id: int
    is_active: bool
    is_verified: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Event schemas
class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_datetime: datetime
    end_datetime: datetime
    location_name: str
    address: str
    latitude: float
    longitude: float
    category: Optional[str] = None
    price: float = 0.0
    max_attendees: Optional[int] = None
    image_url: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_datetime: Optional[datetime] = None
    end_datetime: Optional[datetime] = None
    location_name: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    category: Optional[str] = None
    price: Optional[float] = None
    max_attendees: Optional[int] = None
    image_url: Optional[str] = None

class Event(EventBase):
    id: int
    organizer_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    organizer: User
    
    class Config:
        from_attributes = True

# Map schemas
class MapBounds(BaseModel):
    north: float
    south: float
    east: float
    west: float

class EventsMapResponse(BaseModel):
    events: List[Event]
    total_count: int

# Registration schemas
class EventRegistrationCreate(BaseModel):
    event_id: int

class EventRegistration(BaseModel):
    id: int
    event_id: int
    user_id: int
    registration_date: datetime
    status: str
    
    class Config:
        from_attributes = True

# Authentication schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None