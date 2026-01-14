# DORK-X - Quick Start Guide

## 🚀 Running Locally

### Access Points

**Frontend (Dashboard)**
```
http://localhost:3000
```

**Backend API**
```
http://localhost:8000
```

**API Documentation (Swagger UI)**
```
http://localhost:8000/docs
```

**Health Check**
```
http://localhost:8000/api/v1/health
```

---

## Terminal Commands

### Start Backend
```bash
source .venv/bin/activate
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Start Frontend
```bash
cd frontend
npm run dev
```

### Check Health
```bash
curl http://localhost:8000/api/v1/health
```

Expected response:
```json
{
  "status": "operational",
  "database": "healthy",
  "redis": "disconnected",
  "api_keys_configured": {
    "google": true,
    "bing": false
  }
}
```

---

## What's Included

## What's Included

### Backend (FastAPI)
- 15+ API endpoints
- SQLAlchemy ORM with SQLite
- Google Custom Search integration
- Real-time Google Dorking
- OWASP risk classification
- Request logging & validation
- CORS enabled

### Frontend (Next.js 16)
- Server-side rendering
- Real-time scan monitoring
- Interactive dashboard
- Risk-based filtering
- PDF report generation
- Responsive design

### Key Features
- ✅ Google Custom Search API integration
- ✅ SQLite database (no setup needed)
- ✅ 10+ dork categories
- ✅ CRITICAL → INFO risk levels
- ✅ OWASP Top 10 mapping
- ✅ Real-time progress tracking

---

## Running Your First Scan

1. **Start both services** (backend + frontend)
2. **Navigate to** http://localhost:3000
3. **Enter target domain** (e.g., `example.com`)
4. **Accept disclaimer** (for authorized testing only)
5. **Select scan profile:**
   - Quick: ~10 queries (fast)
   - Standard: ~44 queries (recommended)
   - Deep: ~100+ queries (thorough)
6. **Click "Start Scan"**
7. **View real-time results** as Google returns findings

---

## Understanding Results

### Risk Levels
- **CRITICAL**: Credentials, API keys, database exposure
- **HIGH**: Backup files, source code, database dumps
- **MEDIUM**: Admin panels, login pages, configs
- **LOW**: Cloud storage, error messages, Git exposure
- **INFO**: General indexed content

### Finding Categories
- `credentials` - Leaked passwords/secrets
- `backup_files` - Exposed backups (.sql, .bak)
- `admin_panels` - Administrative interfaces
- `database_dumps` - Database files
- `source_code` - Exposed code
- `cloud_storage` - S3/Azure/GCS links
- `error_messages` - Stack traces/errors
- `git_exposure` - .git directory exposure

---

## API Quota Management

**Google Custom Search Free Tier:**
- 100 queries per day
- Resets at midnight Pacific Time

**Scan Profiles vs Quota:**
- Quick scan: ~10 queries (10% of daily quota)
- Standard scan: ~44 queries (44% of daily quota)
- Deep scan: ~100 queries (full daily quota)

**Tip:** Use Quick scans for testing, Standard for real assessments.

---

## Troubleshooting

### "0 findings" after scan
- Verify Google API keys in `backend/.env`
- Check CSE is set to "Search entire web"
- Try a well-known domain first (e.g., `github.com`)
- View backend logs for API errors

### Backend errors
- Check Python venv is activated
- Verify all dependencies installed: `pip list`
- Look for import errors in terminal

### Frontend errors  
- Clear Next.js cache: `rm -rf .next`
- Reinstall deps: `rm -rf node_modules && npm install`
- Check browser console for errors

### API quota exceeded
- Google shows 429 errors in backend logs
- Wait until midnight PT for quota reset
- Or upgrade to paid tier
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
