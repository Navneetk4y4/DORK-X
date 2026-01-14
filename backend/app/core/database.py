"""
Database Configuration and Session Management
SQLAlchemy setup with PostgreSQL
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.core.config import settings


def _create_engine():
    # SQLite needs different engine args (no pool sizing and check_same_thread flag)
    if settings.DATABASE_URL.startswith("sqlite"):
        return create_engine(
            settings.DATABASE_URL,
            connect_args={"check_same_thread": False},
            echo=settings.DEBUG
        )

    return create_engine(
        settings.DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        echo=settings.DEBUG
    )


# Create database engine
engine = _create_engine()

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Create base class for declarative models
Base = declarative_base()


def get_db():
    """
    Dependency function to get database session
    Automatically closes session after request
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
