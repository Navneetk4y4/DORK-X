# DORK-X Single Dockerfile Implementation

## ✅ Single Unified Dockerfile Created

A **single Dockerfile at project root** now manages the entire project (backend + frontend).

### Architecture

```
Dockerfile (at /DORK-X/Dockerfile)
├── Stage 1: Backend Builder (Python 3.11)
│   ├── Install system dependencies
│   ├── Install Python packages
│   └── Prepare backend application
├── Stage 2: Frontend Builder (Node.js 18)
│   ├── Install Node dependencies
│   └── Build Next.js application
├── Stage 3: Backend Runtime (Python)
│   └── Production backend service
├── Stage 4: Frontend Runtime (Node.js)
│   └── Production frontend service
└── Stage 5: Main (Default backend)
    └── Selectable via docker-compose target
```

### Key Features

✅ **Multi-stage Build**
- Separate build stages for backend and frontend
- Optimized for size and performance
- Clear separation of concerns

✅ **Single Source Control**
- One Dockerfile for entire project
- Easier to maintain
- Consistent version pinning

✅ **docker-compose Integration**
- Uses `target` parameter to select backend or frontend stage
- Same Dockerfile, different runtime images
- Clear service definitions

✅ **Environment-aware**
- Development mode (with reload)
- Production ready
- All dependencies properly managed

---

## Backend & Frontend Integration

### 1. API Communication

**Frontend → Backend Communication:**
```typescript
// frontend/lib/api-service.ts
- Connects to backend at: http://localhost:8000
- All API calls typed with TypeScript
- Error handling and validation built-in
```

**Backend Endpoints:**
```python
# backend/app/api/
├── health.py       - Health checks
├── targets.py      - Domain validation
├── scans.py        - OSINT scan management
└── reports.py      - Report generation
```

### 2. Data Flow

```
User (Frontend)
    ↓
Frontend Page (React/Next.js)
    ↓
API Service (Typed client)
    ↓
Axios HTTP Client
    ↓
FastAPI Backend (http://localhost:8000)
    ↓
Business Logic Services
    ↓
PostgreSQL Database
    ↓
Redis Cache
    ↓
Response JSON
    ↓
Frontend State Management (Zustand)
    ↓
UI Update (React)
```

### 3. Integrated Services

**Frontend Services:**
- Homepage with scan submission (`/app/page.tsx`)
- Scan details and monitoring (`/app/scans/[id]/page.tsx`)
- Real-time statistics and findings display

**Backend Services:**
- `DorkGeneratorService` - 80+ Google dork templates
- `ScanExecutorService` - Execute reconnaissance scans
- `ReportGeneratorService` - Generate professional reports

**Database Services:**
- PostgreSQL with 5 normalized tables
- Audit logging for compliance
- Relationships: Scans → Findings, Reports, Queries, Audit Logs

**Caching Services:**
- Redis for rate limiting
- Cache frequently used data
- Improve performance

---

## docker-compose.yml Changes

### Before (Two Dockerfiles)
```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
    
frontend:
  build:
    context: ./frontend
    dockerfile: Dockerfile
```

### After (Single Dockerfile)
```yaml
backend:
  build:
    context: .
    dockerfile: Dockerfile
    target: backend-runtime    # ← Uses Stage 3
    
frontend:
  build:
    context: .
    dockerfile: Dockerfile
    target: frontend-runtime   # ← Uses Stage 4
```

### Service Dependencies
```yaml
db (PostgreSQL)
    ↑
    ├── backend (depends_on: db, redis)
    │   ↓
    └── frontend (depends_on: backend)

redis (Cache)
    ↑
    └── backend
```

---

## .gitignore Updates

Updated to ignore the old Dockerfile copies:
```
# Old Dockerfiles (using single Dockerfile at root now)
backend/Dockerfile
frontend/Dockerfile
```

---

## Project Structure Now

```
DORK-X/
├── .git/                  ← Single repository
├── .gitignore             ← Single unified file
├── Dockerfile             ← SINGLE unified file (multi-stage)
├── docker-compose.yml     ← References single Dockerfile
│
├── backend/
│   ├── requirements.txt   (no Dockerfile - in root)
│   └── app/
│       ├── main.py        (FastAPI app)
│       ├── api/           (11 endpoints)
│       ├── models/        (SQLAlchemy models)
│       ├── schemas/       (Pydantic validation)
│       ├── services/      (Business logic)
│       └── core/          (Config, database, security)
│
├── frontend/
│   ├── package.json       (no Dockerfile - in root)
│   └── app/
│       ├── page.tsx       (Homepage)
│       ├── scans/         (Scan details)
│       └── lib/           (API service, utilities)
│
├── database/
│   └── init.sql           (PostgreSQL schema)
│
└── docs/
    └── DORK_TEMPLATES.md  (80+ dork queries)
```

---

## How Services Work Together

### 1. User initiates scan (Frontend)
```
Homepage (page.tsx)
├── User enters domain
├── Selects scan profile (quick/standard/deep)
├── Accepts legal consent
└── Calls backend API: POST /api/scans
```

### 2. Backend processes scan
```
FastAPI Handler (scans.py)
├── Validates input
├── Creates Scan record in DB
├── Executes DorkGeneratorService
├── Stores findings in PostgreSQL
└── Returns scan JSON to frontend
```

### 3. Frontend displays results
```
Scan Details (scans/[id]/page.tsx)
├── Polls backend for status: GET /api/scans/{id}
├── Displays real-time statistics
├── Shows findings table with filtering
├── Allows report generation
└── User can export or view detailed report
```

### 4. Database relationships
```
Scan (one-to-many)
├── DorkQuery (10-20 per scan)
├── Finding (100+ per scan)
├── Report (one-to-one)
└── AuditLog (track all actions)
```

---

## Integration Testing Points

### ✅ Frontend-Backend Connection
- [x] Frontend connects to http://localhost:8000
- [x] API client properly typed (TypeScript)
- [x] Error handling implemented
- [x] Request/response validation

### ✅ Database Connection
- [x] Backend connects to PostgreSQL
- [x] Tables created with proper schemas
- [x] Relationships defined
- [x] Audit logging enabled

### ✅ Redis Cache
- [x] Backend connects to Redis
- [x] Rate limiting implemented
- [x] Cache layer available

### ✅ Services Integration
- [x] DorkGeneratorService creates 80+ queries
- [x] ScanExecutorService runs searches
- [x] ReportGeneratorService generates outputs
- [x] All services communicate through database

---

## Benefits of Single Dockerfile

✅ **Simplicity**
- One file to maintain
- Clear multi-stage process
- Easy to understand flow

✅ **Consistency**
- Same dependencies/versions used
- Coordinated updates
- Unified base images

✅ **Efficiency**
- Shared layers
- Faster builds (caching)
- Smaller final images

✅ **Maintainability**
- Single configuration
- Clear stages
- Easier debugging

---

## Running the Project

### Start Everything
```bash
cd /Users/navneetkumar/Desktop/DORK-X
docker-compose up --build
```

### Services Available
```
Frontend:  http://localhost:3000
Backend:   http://localhost:8000
Database:  localhost:5432
Cache:     localhost:6379
```

### Verify Integration
```bash
# Check backend health
curl http://localhost:8000/api/health

# Check frontend loads
curl http://localhost:3000

# View backend docs
open http://localhost:8000/api/docs
```

---

## Confirmation

✅ **Single Dockerfile:** Created at `/DORK-X/Dockerfile`
✅ **Multi-stage Build:** Backend and Frontend stages
✅ **docker-compose.yml:** Updated to use single Dockerfile
✅ **.gitignore:** Updated to ignore old Dockerfiles
✅ **Integration:** Full backend-frontend communication verified
✅ **Services:** All 4 services work together (DB, Redis, Backend, Frontend)

---

**Date:** 2024-01-14
**Project:** DORK-X - OSINT Reconnaissance Platform
**Status:** ✅ Single Dockerfile Implementation Complete
