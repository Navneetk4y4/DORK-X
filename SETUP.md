# 🚀 DORK-X Setup Guide

## Quick Start Instructions

### Step 1: Environment Setup

#### Backend Configuration (`backend/.env`)

**Required Configuration:**

```bash
# Database - SQLite (automatic, no setup needed)
DATABASE_URL=sqlite:///./dorkx.db

# Security Keys (can use defaults for development)
SECRET_KEY=dev-secret-key
JWT_SECRET=dev-jwt-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Search Engine API Keys (REQUIRED for real Google Dorking)
GOOGLE_API_KEY=your-google-api-key-here
GOOGLE_CSE_ID=your-custom-search-engine-id-here

# Optional: Bing Search API
BING_API_KEY=dev-placeholder

# Rate Limiting
MAX_QUERIES_PER_DAY=100
MAX_QUERIES_PER_SESSION=20
QUERY_DELAY_SECONDS=3

# Application Settings
ENVIRONMENT=development
DEBUG=True
LOG_LEVEL=INFO

# CORS Settings
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Report Storage
REPORT_STORAGE_PATH=/path/to/DORK-X/reports
```

**Getting API Keys:**

1. **Google Custom Search API (Required):**
   - Visit: https://developers.google.com/custom-search/v1/overview
   - Create a project in Google Cloud Console
   - Enable Custom Search API
   - Create credentials (API Key)
   - Go to: https://cse.google.com/cse/
   - Create a new search engine
   - **Important:** Select "Search the entire web" (not specific sites)
   - Copy your Search Engine ID (CSE ID)

2. **Bing Search API (Optional):**
   - Visit Azure Portal: https://portal.azure.com
   - Create a "Bing Search v7" resource
   - Copy your API key

#### Frontend Configuration (`frontend/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### Step 2: Install Dependencies

**Backend:**
```bash
cd /path/to/DORK-X

# Create virtual environment (Python 3.11 recommended)
python3.11 -m venv .venv

# Activate virtual environment
# On macOS/Linux:
source .venv/bin/activate
# On Windows:
# .venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install

# Install dev dependencies (if needed)
npm install -D @types/node
```

**No Database Setup Required:**
- SQLite is used by default (file: `backend/dorkx.db`)
- Database tables are created automatically on first run
- No PostgreSQL or Redis installation needed

---

### Step 3: Run the Application

**Terminal 1 - Start Backend:**
```bash
# Activate venv if not already active
source .venv/bin/activate

cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
✅ Database tables created/verified
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
▲ Next.js 16.1.1 (Turbopack)
- Local:    http://localhost:3000
✓ Ready in 2.3s
```

You should see:
```
▲ Next.js 16.1.1 (Turbopack)
- Local:    http://localhost:3000
✓ Ready in 2.3s
```

---

### Step 4: Verify Installation

1. **Check Backend Health:**
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

2. **Access Frontend:**
   - Open browser: http://localhost:3000
   - You should see the DORK-X dashboard

3. **Test API Documentation:**
   - Visit: http://localhost:8000/docs
   - Interactive Swagger UI for all endpoints

---

### Step 5: Run Your First Scan

1. Navigate to http://localhost:3000
2. Enter a target domain (e.g., `example.com`)
3. Accept the legal disclaimer
4. Choose "Quick" scan profile for testing
5. Click "Start Scan"
6. View real-time results as Google API returns findings

**Notes:**
- Google free tier: 100 queries/day
- Quick scan: ~10 queries
- Standard scan: ~44 queries
- Deep scan: ~100+ queries

---

## Troubleshooting

### Backend won't start
- Ensure Python 3.11+ is installed
- Activate venv: `source .venv/bin/activate`
- Check logs for specific errors

### Frontend won't start
- Ensure Node.js 18+ is installed
- Delete `node_modules` and run `npm install` again
- Check for port conflicts on 3000

### No scan results (0 findings)
- Verify Google API keys in `backend/.env`
- Check CSE is configured to "Search entire web"
- View backend logs for API errors
- Free tier has 100 queries/day limit

### Redis connection warnings
- Redis is optional (used for caching)
- Can be safely ignored for development
- To suppress: `brew install redis && brew services start redis`

---

## Optional: Redis Installation

For production caching (optional):

```bash
# macOS
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt-get install redis-server
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```
   ```

2. **Open Frontend:**
   - Navigate to http://localhost:3000
   - You should see the DORK-X homepage

3. **Test API Documentation:**
   - Visit http://localhost:8000/api/docs
   - Interactive API documentation (Swagger UI)

---

## 🏗️ Project Structure

```
DORK-X/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/            # API endpoints
│   │   ├── core/           # Configuration & DB
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── main.py         # Application entry
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
│
├── frontend/               # Next.js Frontend
│   ├── app/               # Pages (App Router)
│   ├── lib/               # Utilities & API client
│   ├── package.json       # Node dependencies
│   └── Dockerfile
│
├── database/              # Database scripts
│   └── init.sql          # Schema initialization
│
├── reports/              # Generated reports
├── docker-compose.yml    # Docker orchestration
└── README.md            # Project documentation
```

---

## 🧪 Testing the Application

### Test Target Validation:

```bash
curl -X POST http://localhost:8000/api/v1/targets/validate \
  -H "Content-Type: application/json" \
  -d '{"target": "example.com"}'
```

### Create a Test Scan:

```bash
curl -X POST http://localhost:8000/api/v1/scans \
  -H "Content-Type: application/json" \
  -d '{
    "target_domain": "example.com",
    "scan_profile": "quick",
    "consent_accepted": true,
    "user_id": "test-user"
  }'
```

---

## 📚 Next Development Phases

### Phase 2: Core Scanning Engine (Next Priority)
- [ ] Implement search engine API integration
- [ ] Add result parsing logic
- [ ] Implement rate limiting
- [ ] Add CAPTCHA detection

### Phase 3: Risk Classification
- [ ] Build risk classification engine
- [ ] Implement OWASP mapping
- [ ] Add remediation guidance

### Phase 4: Enhanced UI
- [ ] Add real-time progress indicators
- [ ] Create data visualization charts
- [ ] Implement advanced filtering
- [ ] Add export functionality

### Phase 5: Report Generation
- [ ] PDF generation with ReportLab
- [ ] HTML report templates
- [ ] CSV export
- [ ] Email delivery (optional)

---

## 🔧 Common Issues & Solutions

### Issue: Database Connection Failed
```bash
# Check if PostgreSQL is running
brew services list

# Restart PostgreSQL
brew services restart postgresql@15
```

### Issue: Redis Connection Failed
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG
```

### Issue: Frontend Can't Connect to Backend
- Verify backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in frontend/.env.local
- Check CORS settings in backend

### Issue: Module Not Found Errors
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

---

## 🎓 For College Project Presentation

### Key Points to Highlight:

1. **Security Focus:**
   - Legal disclaimer enforcement
   - Audit logging
   - Rate limiting
   - Scope validation

2. **Technical Architecture:**
   - Microservices design
   - RESTful API
   - Modern tech stack
   - Database design

3. **Real-World Application:**
   - Penetration testing workflow
   - OWASP alignment
   - Professional reporting
   - Risk classification

4. **Ethical Considerations:**
   - Authorization enforcement
   - Responsible disclosure
   - Legal compliance
   - Educational purpose

### Demo Flow:
1. Show homepage with disclaimer
2. Validate a target domain
3. Accept legal disclaimer
4. Start a scan (use quick profile for demo)
5. Show real-time progress
6. Display findings dashboard
7. Generate a report

---

## 📞 Support

For issues or questions during development:
- Check API documentation: http://localhost:8000/api/docs
- Review logs: `docker-compose logs -f`
- Verify environment variables
- Check database connectivity

---

**Remember:** This is a college project for educational purposes. Always obtain proper authorization before scanning any target.
