from pydantic_settings import BaseSettings
from pydantic import Field
from typing import Optional


class Settings(BaseSettings):
    PROJECT_NAME: str = "DORK-X"
    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str = ""
    REDIS_URL: str = ""
    SECRET_KEY: str = "change-me"

    GOOGLE_API_KEY: Optional[str] = None
    GOOGLE_CSE_ID: Optional[str] = None
    GOOGLE_API_KEY2: Optional[str] = None
    GOOGLE_CSE_ID2: Optional[str] = None
    ALLOWED_ORIGINS: str = ""
    REPORT_STORAGE_PATH: Optional[str] = None
    BING_API_KEY: Optional[str] = None

    BLOCKED_TLDS: list[str] = [
        ".local", ".localhost", ".internal", ".test", ".example", ".invalid"
    ]
    BLOCKED_DOMAINS: list[str] = [
        "localhost", "127.0.0.1", "0.0.0.0"
    ]

    DEBUG: bool = False
    ENVIRONMENT: str = 'development'

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
