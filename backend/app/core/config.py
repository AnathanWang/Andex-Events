from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # App settings
    APP_NAME: str = "Andex Events"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@localhost/andex_events"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://localhost:8080"]
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Maps API
    YANDEX_MAPS_API_KEY: str = ""
    GOOGLE_MAPS_API_KEY: str = ""  # Оставляем для совместимости
    MAPBOX_API_KEY: str = ""
    
    # Email (for notifications)
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    
    # File uploads
    UPLOAD_FOLDER: str = "uploads"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    
    class Config:
        env_file = ".env"

settings = Settings()