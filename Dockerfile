# Multi-stage Dockerfile for DORK-X project
# Single file managing both backend (FastAPI) and frontend (Next.js)
# This demonstrates unified project structure with integrated services

# ============================================
# STAGE 1: Backend Builder
# ============================================
FROM python:3.11-slim AS backend-builder

WORKDIR /backend

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/app ./app

# Create reports directory
RUN mkdir -p /backend/reports

# ============================================
# STAGE 2: Frontend Builder
# ============================================
FROM node:18-alpine AS frontend-builder

WORKDIR /frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend code
COPY frontend/ .

# Build Next.js application
RUN npm run build

# ============================================
# STAGE 3: Backend Runtime
# ============================================
FROM python:3.11-slim AS backend-runtime

WORKDIR /app

# Install only runtime dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy Python packages from builder
COPY --from=backend-builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=backend-builder /usr/local/bin /usr/local/bin

# Copy backend application
COPY --from=backend-builder /backend/app ./app

# Copy reports directory
COPY --from=backend-builder /backend/reports ./reports

# Create core directories
RUN mkdir -p /app/core && \
    mkdir -p /app/models && \
    mkdir -p /app/schemas && \
    mkdir -p /app/services && \
    mkdir -p /app/api

# Copy backend core modules (if they exist)
COPY backend/app/main.py ./main.py 2>/dev/null || true
COPY backend/app/core ./core/ 2>/dev/null || true
COPY backend/app/models ./models/ 2>/dev/null || true
COPY backend/app/schemas ./schemas/ 2>/dev/null || true
COPY backend/app/services ./services/ 2>/dev/null || true
COPY backend/app/api ./api/ 2>/dev/null || true

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# ============================================
# STAGE 4: Frontend Runtime
# ============================================
FROM node:18-alpine AS frontend-runtime

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built Next.js app from builder
COPY --from=frontend-builder /frontend/node_modules ./node_modules
COPY --from=frontend-builder /frontend/.next ./.next
COPY --from=frontend-builder /frontend/public ./public
COPY --from=frontend-builder /frontend/next.config.js ./
COPY --from=frontend-builder /frontend/package*.json ./

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["npm", "start"]

# ============================================
# STAGE 5: Main (selectable runtime)
# Default: backend (can be overridden)
# ============================================
FROM backend-runtime AS main

LABEL description="DORK-X - OSINT Reconnaissance Platform"
LABEL version="1.0"
LABEL project="College Project"
LABEL maintainer="DORK-X Development Team"
