# 🚀 DORK-X Setup Guide

## Quick Start Instructions

### Step 1: Environment Setup

The `.env` files have been created from templates. You need to configure them:

#### Backend Configuration (`/backend/.env`)

**CRITICAL:** Update these values:

```bash
# Security (MUST CHANGE)
SECRET_KEY=your-super-secret-key-change-this-now
JWT_SECRET=your-jwt-secret-key-change-this-now

# Database
DATABASE_URL=postgresql://dorkx_user:dorkx_password@localhost:5432/dorkx_db

# Redis
REDIS_URL=redis://localhost:6379

# Search Engine API Keys (Required for functionality)
GOOGLE_API_KEY=your-google-api-key-here
GOOGLE_CSE_ID=your-custom-search-engine-id-here
BING_API_KEY=your-bing-api-key-here
```

**Getting API Keys:**

1. **Google Custom Search API:**
   - Visit: https://developers.google.com/custom-search/v1/overview
   - Create a project in Google Cloud Console
   - Enable Custom Search API
   - Create credentials (API Key)
   - Create a Custom Search Engine at: https://cse.google.com/
   - Copy your CSE ID

2. **Bing Search API:**
   - Visit: https://www.microsoft.com/en-us/bing/apis/bing-web-search-api
   - Sign up for Azure
   - Create a Bing Search resource
   - Copy your API key

#### Frontend Configuration (`/frontend/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

### Step 2: Install Dependencies

#### Option A: Using Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Option B: Manual Installation

**Backend:**
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

**Frontend:**
```bash
cd frontend

# Install dependencies
npm install
```

**Database (PostgreSQL):**
```bash
# Install PostgreSQL (macOS)
brew install postgresql@15
brew services start postgresql@15

# Create database
createdb dorkx_db

# Run initialization script
psql dorkx_db < database/init.sql
```

**Redis:**
```bash
# Install Redis (macOS)
brew install redis
brew services start redis
```

---

### Step 3: Initialize Database

```bash
cd backend

# Create tables
psql -U dorkx_user -d dorkx_db -f ../database/init.sql

# Or using Docker:
docker-compose exec db psql -U dorkx_user -d dorkx_db -f /docker-entrypoint-initdb.d/init.sql
```

---

### Step 4: Run the Application

#### Using Docker:
```bash
# Already running from Step 2
# Access at:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:8000
# - API Docs: http://localhost:8000/api/docs
```

#### Manual:

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

---

### Step 5: Verify Installation

1. **Check Backend Health:**
   ```bash
   curl http://localhost:8000/api/v1/health
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
