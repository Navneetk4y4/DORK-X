"""
DORK-X Main Application Entry Point
FastAPI application with comprehensive OSINT reconnaissance capabilities
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
from loguru import logger

from app.core.config import settings
from app.core.database import engine, Base
from app.api import scans, targets, reports, health

# Configure logger
logger.add(
    "logs/dorkx_{time}.log",
    rotation="500 MB",
    retention="10 days",
    level="INFO",
    format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager
    Handles startup and shutdown events
    """
    # Startup
    logger.info("🚀 Starting DORK-X Backend...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Debug Mode: {settings.DEBUG}")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created/verified")
    
    yield
    
    # Shutdown
    logger.info("🛑 Shutting down DORK-X Backend...")


# Initialize FastAPI application
app = FastAPI(
    title="DORK-X API",
    description="""
    🔍 **Automated OSINT Reconnaissance Platform**
    
    ⚠️ **FOR AUTHORIZED SECURITY TESTING ONLY** ⚠️
    
    ## Features
    - Automated Google dorking & OSINT reconnaissance
    - Risk-based finding classification
    - Professional pentesting reports
    - Rate limiting & abuse prevention
    
    ## Security Notice
    This API is intended for:
    - ✅ Authorized penetration testing
    - ✅ Educational security research
    - ✅ Legal security assessments
    
    Never use for unauthorized access or malicious purposes.
    """,
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
    openapi_tags=[
        {
            "name": "health",
            "description": "System health and status endpoints"
        },
        {
            "name": "targets",
            "description": "Target validation and management"
        },
        {
            "name": "scans",
            "description": "Scan execution and monitoring"
        },
        {
            "name": "reports",
            "description": "Report generation and export"
        }
    ]
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Gzip Compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """
    Add processing time header to all responses
    Useful for performance monitoring
    """
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Log all incoming requests for audit trail
    """
    logger.info(f"📨 {request.method} {request.url.path}")
    response = await call_next(request)
    logger.info(f"📤 {request.method} {request.url.path} - Status: {response.status_code}")
    return response


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler for unhandled errors
    """
    logger.error(f"❌ Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": "An unexpected error occurred",
            "detail": str(exc) if settings.DEBUG else None
        }
    )


# Root endpoint
@app.get("/", tags=["health"])
async def root():
    """
    Root endpoint with API information
    """
    return {
        "name": "DORK-X API",
        "version": "1.0.0",
        "status": "operational",
        "description": "Automated OSINT Reconnaissance Platform",
        "docs": "/api/docs",
        "warning": "⚠️ FOR AUTHORIZED SECURITY TESTING ONLY ⚠️"
    }


# Include routers
app.include_router(health.router, prefix="/api/v1", tags=["health"])
app.include_router(targets.router, prefix="/api/v1", tags=["targets"])
app.include_router(scans.router, prefix="/api/v1", tags=["scans"])
app.include_router(reports.router, prefix="/api/v1", tags=["reports"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
