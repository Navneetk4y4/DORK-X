"""
Application Configuration
Centralized settings management using Pydantic
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    
    # Application
    APP_NAME: str = "DORK-X"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    LOG_LEVEL: str = "INFO"
    
    # Security
    SECRET_KEY: str
    JWT_SECRET: str = "your-jwt-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    DATABASE_URL: str
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # Search Engine APIs
    GOOGLE_API_KEY: str = ""
    GOOGLE_CSE_ID: str = ""
    BING_API_KEY: str = ""
    
    # Rate Limiting
    MAX_QUERIES_PER_DAY: int = 100
    MAX_QUERIES_PER_SESSION: int = 20
    QUERY_DELAY_SECONDS: int = 3
    MAX_REQUESTS_PER_MINUTE: int = 10
    
    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000"
    
    # Report Storage
    REPORT_STORAGE_PATH: str = "/Users/navneetkumar/Desktop/DORK-X/reports"
    
    # Scanning Configuration
    MAX_RESULTS_PER_QUERY: int = 10
    SCAN_TIMEOUT_MINUTES: int = 30
    
    # Blocked Domains (for safety)
    BLOCKED_TLDS: List[str] = [".gov", ".mil", ".edu"]
    BLOCKED_DOMAINS: List[str] = [
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        "internal",
        "local"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Initialize settings
settings = Settings()
