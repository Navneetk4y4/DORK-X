"""
Health Check API Endpoints
System status and monitoring
"""

from fastapi import APIRouter, Depends
from datetime import datetime
from app.schemas import HealthResponse
from app.core.config import settings
from app.core.database import engine
from app.core.redis import get_redis

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Comprehensive health check endpoint
    Returns status of all system components
    """
    # Check database
    try:
        engine.connect()
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
    
    # Check Redis
    redis_client = get_redis()
    try:
        if redis_client:
            redis_client.ping()
            redis_status = "healthy"
        else:
            redis_status = "disconnected"
    except Exception as e:
        redis_status = f"unhealthy: {str(e)}"
    
    # Check API keys
    api_keys_status = {
        "google": bool(settings.GOOGLE_API_KEY),
        "bing": bool(settings.BING_API_KEY)
    }
    
    return HealthResponse(
        status="operational",
        timestamp=datetime.utcnow(),
        version=settings.VERSION,
        database=db_status,
        redis=redis_status,
        api_keys_configured=api_keys_status
    )
