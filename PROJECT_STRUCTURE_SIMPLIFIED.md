# 📁 DORK-X Project Structure - Simplified

## Overview
The DORK-X project uses a **simplified, unified structure** for maximum clarity and ease of understanding.

---

## 1. Single Git Repository ✅

**Structure:**
```
DORK-X/
├── .git/                    ← SINGLE git repository at root
├── .gitignore               ← SINGLE unified gitignore file
├── backend/
│   ├── Dockerfile           ← Backend container definition
│   ├── requirements.txt
│   └── app/
├── frontend/
│   ├── Dockerfile           ← Frontend container definition
│   ├── package.json
│   └── app/
├── database/
│   └── init.sql
├── docker-compose.yml       ← SINGLE Docker configuration
└── docs/
```

**Why Single Repository:**
- ✅ All code tracked together (backend, frontend, docs)
- ✅ Single source of truth for version control
- ✅ Simplified CI/CD and deployment
- ✅ Easier collaboration and code review
- ✅ Cleaner history and commit management

---

## 2. Single Unified .gitignore ✅

**Location:** `/DORK-X/.gitignore` (root level)

**Consolidation:**
- ✅ Merged root patterns + frontend patterns
- ✅ Covers all technologies in project
- ✅ Single point of maintenance

**What it ignores:**
```
# Python
__pycache__/
*.py[cod]
venv/
.env

# Node.js / Next.js
node_modules/
.next/
build/
dist/
*.tsbuildinfo

# Database
*.db
*.sqlite
*.sqlite3

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore
docker-compose.override.yml

# Secrets & Environment
.env
.env.local
.env.*.local

# Reports & Logs
reports/
logs/
*.log
```

---

## 3. Docker Structure (Two Dockerfiles, One Compose)

### Why Two Dockerfiles?
Backend (Python) and Frontend (Node.js) require different build processes:
- **Backend Dockerfile:** Python 3.11 + FastAPI runtime
- **Frontend Dockerfile:** Node.js build + Next.js production image

### Single docker-compose.yml
**Location:** `/DORK-X/docker-compose.yml`

**Services:**
1. **PostgreSQL** - Database service
2. **Redis** - Cache service
3. **Backend** - FastAPI API (builds from `backend/Dockerfile`)
4. **Frontend** - Next.js App (builds from `frontend/Dockerfile`)

**Why Single Compose:**
- ✅ One configuration for entire stack
- ✅ Service dependencies clearly defined
- ✅ Health checks and orchestration in one place
- ✅ Environment variables centralized
- ✅ Easy to run: `docker-compose up`

---

## 4. Project Directories

```
DORK-X/
│
├── .git/                          # Version control
├── .gitignore                     # Unified ignore patterns
├── README.md                      # Project overview
├── SETUP.md                       # Installation guide
├── FINAL_GUIDE.md                # Development & deployment
│
├── backend/
│   ├── Dockerfile                # Python 3.11 + FastAPI
│   ├── requirements.txt           # Python dependencies
│   └── app/
│       ├── main.py               # FastAPI application
│       ├── api/                  # Route modules
│       ├── models/               # SQLAlchemy models
│       ├── schemas/              # Pydantic validation
│       ├── services/             # Business logic
│       └── core/                 # Configuration & security
│
├── frontend/
│   ├── Dockerfile                # Node.js + Next.js
│   ├── package.json              # Node dependencies
│   ├── next.config.js            # Next.js config
│   └── app/
│       ├── page.tsx              # Homepage
│       ├── scans/                # Scan pages
│       └── lib/                  # Utilities & API client
│
├── database/
│   └── init.sql                  # PostgreSQL schema
│
├── docker-compose.yml            # Single Docker config
│
└── docs/
    ├── DORK_TEMPLATES.md         # Dork query documentation
    └── API.md                    # API documentation
```

---

## 5. Development Workflow

### Starting the Project
```bash
# Build and start all services
docker-compose up --build

# Services available at:
# - Backend: http://localhost:8000
# - Frontend: http://localhost:3000
# - Database: localhost:5432
# - Redis: localhost:6379
```

### Local Development (without Docker)
```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# Terminal 2: Frontend  
cd frontend
npm install
npm run dev
```

---

## 6. Key Simplifications Made

| Item | Before | After | Benefit |
|------|--------|-------|---------|
| Git Repos | 2 (.git + frontend/.git) | 1 (.git) | Single source of truth |
| .gitignore Files | 2 (root + frontend) | 1 (root) | Unified patterns, easier maintenance |
| Docker Compose | Same | Simplified | Better documentation, clearer dependencies |
| Configuration Points | Multiple | Centralized | Single docker-compose.yml for all services |

---

## 7. For College Project Grading

### Easy to Understand ✅
- Single Git repository shows project cohesion
- Unified .gitignore shows understanding of version control
- Clear docker-compose.yml demonstrates DevOps knowledge

### Easy to Run ✅
```bash
docker-compose up
# Everything starts with one command
```

### Easy to Inspect ✅
- All code in one Git history
- Single .gitignore explains ignored patterns
- Clear separation: backend/ and frontend/ directories

---

## 8. Git Workflow

```bash
# View project history
git log --oneline

# Check what's ignored
cat .gitignore

# Stage and commit changes
git add .
git commit -m "Feature: Add new dork template"

# Push to remote (if configured)
git push
```

---

**Created:** 2024
**Project:** DORK-X - OSINT Reconnaissance Platform
**Status:** Simplified structure for clarity and understanding
