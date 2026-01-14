# DORK-X - Quick Start Guide

## 🚀 Project is RUNNING

```
✅ Backend:   http://localhost:8000
✅ Frontend:  http://localhost:3000
✅ Database:  PostgreSQL (port 5432)
✅ Cache:     Redis (port 6379)
```

---

## Access Points

**Frontend (User Interface)**
```
http://localhost:3000
```

**API Documentation (Interactive)**
```
http://localhost:8000/api/docs
```

**API Root (Status Check)**
```
http://localhost:8000
```
Returns:
```json
{
  "name": "DORK-X API",
  "version": "1.0.0",
  "status": "operational",
  "description": "Automated OSINT Reconnaissance Platform",
  "docs": "/api/docs",
  "warning": "⚠️ FOR AUTHORIZED SECURITY TESTING ONLY ⚠️"
}
```

---

## Useful Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### Full Rebuild
```bash
docker-compose down
docker-compose up --build
```

### Execute Commands in Container
```bash
# Backend
docker-compose exec backend bash
python -c "import app; print('Backend OK')"

# Frontend  
docker-compose exec frontend bash
npm list
```

### View All Containers
```bash
docker-compose ps
docker ps -a
```

---

## What's Included

### Backend (FastAPI)
- 11 API endpoints
- SQLAlchemy ORM with 5 models
- PostgreSQL integration
- Redis caching
- Pydantic validation
- CORS enabled
- Request logging
- Swagger docs

### Frontend (Next.js)
- HomePage with scan form
- Responsive design (TailwindCSS)
- React components
- Zustand state management
- Axios HTTP client
- Dark theme UI
- Mobile optimized

### Database (PostgreSQL)
- Scan management
- Query tracking
- Finding results
- Reports
- Audit logs

### Cache (Redis)
- Session storage
- Rate limiting
- Response caching

---

## API Endpoints (Documentation at /api/docs)

**Available at:** `http://localhost:8000/api/docs`

Test any endpoint directly in the Swagger UI.

---

## Directory Structure

```
/DORK-X/
├── Dockerfile                 (Multi-stage build)
├── docker-compose.yml         (Service orchestration)
├── .gitignore                (Consolidated patterns)
├── backend/
│   ├── app/
│   │   ├── main.py          (FastAPI app)
│   │   ├── models/          (SQLAlchemy models)
│   │   ├── schemas/         (Pydantic schemas)
│   │   ├── services/        (Business logic)
│   │   ├── core/            (Config, database, redis)
│   │   └── routes/          (API endpoints)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx         (Homepage)
│   │   ├── layout.tsx       (Root layout)
│   │   └── api/             (API routes)
│   ├── package.json
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   └── tsconfig.json
└── docs/
    └── guides/
```

---

## Development Notes

### Auto-Reload Enabled
- Backend: Hot reload active (Uvicorn)
- Frontend: Hot module replacement (Next.js)
- Edit files and see changes immediately

### Environment Variables
Already configured in `docker-compose.yml`:
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `NEXT_PUBLIC_API_URL` - Frontend API endpoint
- `DEBUG=true` - Development mode

### No Additional Setup Needed
- All dependencies installed
- Database initialized
- Services connected
- Ready to use

---

## Troubleshooting

### Services Not Starting?
```bash
# Check logs
docker-compose logs

# Clean and rebuild
docker-compose down
docker-compose up --build -d
```

### Port Already in Use?
Edit `docker-compose.yml` and change port mapping:
```yaml
ports:
  - "3001:3000"  # Changed from 3000 to 3001
```

### Database Connection Error?
```bash
# Check database is running
docker-compose ps db

# Check logs
docker-compose logs db

# Reinitialize
docker-compose down -v  # -v removes volumes
docker-compose up -d
```

### API Not Responding?
```bash
# Test connectivity
curl http://localhost:8000

# Check logs
docker-compose logs backend

# Verify port
docker-compose ps backend
```

---

## What's Next?

1. **Open Frontend** → http://localhost:3000
2. **View API Docs** → http://localhost:8000/api/docs
3. **Test an Endpoint** → Use Swagger UI to try endpoints
4. **View Logs** → `docker-compose logs -f`
5. **Modify Code** → Edit files, auto-reload works
6. **Deploy** → Ready for production with env setup

---

## Key Files Modified for Fixes

| File | Change | Reason |
|------|--------|--------|
| Dockerfile | Node:18 → Node:20 (2 stages) | Next.js 14 requires >=20.9.0 |
| backend/app/models/models.py | metadata → additional_metadata | SQLAlchemy 2.0+ conflict |
| frontend/app/page.tsx | Removed duplicate return | Build compilation error |
| Dockerfile | next.config.js → next.config.ts | File not found error |

---

## Git Status

All changes committed and saved:
```
Last commit: 7e7f6c8
Message: fix: Resolve frontend Node.js and SQLAlchemy compatibility issues
Changes: 15+ commits with clean history
```

---

## Project Ready? ✅

- [x] All services running
- [x] Frontend accessible
- [x] Backend responding
- [x] Database connected
- [x] Redis connected
- [x] Logs clean
- [x] Integration verified
- [x] Git history clean
- [x] Single Dockerfile
- [x] Single docker-compose.yml
- [x] Single .gitignore
- [x] Single repository

**Status: READY FOR COLLEGE SUBMISSION**

---

*DORK-X - Automated OSINT Reconnaissance Platform*  
*Built with FastAPI, Next.js, PostgreSQL, and Redis*  
*January 14, 2026*
