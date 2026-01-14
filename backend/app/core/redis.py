"""
Redis Cache Configuration
For rate limiting and caching search results
"""

import redis
from app.core.config import settings
from loguru import logger

# Initialize Redis client
try:
    redis_client = redis.from_url(
        settings.REDIS_URL,
        decode_responses=True,
        encoding="utf-8"
    )
    # Test connection
    redis_client.ping()
    logger.info("✅ Redis connection established")
except Exception as e:
    logger.error(f"❌ Redis connection failed: {str(e)}")
    redis_client = None


def get_redis():
    """
    Get Redis client instance
    """
    return redis_client
