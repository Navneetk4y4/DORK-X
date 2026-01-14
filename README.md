# 🔍 DORK-X: Automated OSINT Reconnaissance Platform

**⚠️ FOR EDUCATIONAL AND AUTHORIZED TESTING PURPOSES ONLY ⚠️**

## 📋 Project Overview

DORK-X is an advanced OSINT (Open Source Intelligence) reconnaissance web application designed for ethical penetration testing and security assessments. It automates Google dorking and search-engine dorking to discover publicly indexed information about target domains.

### ⚖️ Legal & Ethical Notice

This tool is intended ONLY for:
- ✅ Authorized security assessments
- ✅ Educational purposes in controlled environments
- ✅ Penetration testing with written permission
- ✅ Security research on owned infrastructure

**NEVER use this tool for:**
- ❌ Unauthorized scanning
- ❌ Malicious reconnaissance
- ❌ Exploitation of discovered vulnerabilities
- ❌ Any illegal activities

## 🎯 Features

- **Automated Dork Generation**: 10+ categories of security-focused dorks
- **Multi-Search Engine Support**: Google, Bing, DuckDuckGo APIs
- **Risk Classification**: Automated severity assessment (INFO → CRITICAL)
- **OWASP Mapping**: Findings mapped to OWASP Top 10
- **Professional Reporting**: PDF/HTML/CSV export formats
- **Modern Dashboard**: Real-time visualization and filtering
- **Audit Logging**: Complete accountability trail
- **Rate Limiting**: Built-in abuse prevention

## 🏗️ Architecture

```
DORK-X/
├── backend/          # FastAPI Python backend
│   ├── app/
│   │   ├── api/      # API endpoints
│   │   ├── core/     # Configuration
│   │   ├── models/   # Database models
│   │   └── services/ # Business logic & Google Search
│   └── requirements.txt
├── frontend/         # Next.js 16 React frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── lib/          # Utilities & API client
├── reports/          # Generated PDF/HTML reports
└── .venv/           # Python virtual environment
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Google Custom Search API credentials (for real results)

### Installation

1. **Backend setup:**
```bash
cd /path/to/DORK-X

# Create virtual environment
python3.11 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r backend/requirements.txt
```

2. **Configure environment:**
```bash
# Edit backend/.env with your Google API credentials
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CSE_ID=your-custom-search-engine-id
DATABASE_URL=sqlite:///./dorkx.db
```

**Get Google API Keys:**
- API Key: https://developers.google.com/custom-search/v1/overview
- CSE ID: https://cse.google.com/cse/ (configure to search entire web)

3. **Frontend setup:**
```bash
cd frontend
npm install
```

4. **Run the application:**

**Terminal 1 - Backend:**
```bash
source .venv/bin/activate
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Access dashboard at: **http://localhost:3000**

---

## 🚀 Running Your First Scan

1. Navigate to http://localhost:3000
2. Enter target domain (e.g., `example.com`)
3. Accept the legal disclaimer
4. Select scan profile:
   - **Quick**: ~10 queries (fast testing)
   - **Standard**: ~44 queries (recommended)
   - **Deep**: ~100+ queries (thorough)
5. Click "Start Scan"
6. View real-time results as Google returns findings

---

## Access Points

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| Health Check | http://localhost:8000/api/v1/health |

---

## Understanding Scan Results

### Risk Levels
- **CRITICAL**: Credentials, API keys, database exposure
- **HIGH**: Backup files, source code, database dumps  
- **MEDIUM**: Admin panels, login pages, configurations
- **LOW**: Cloud storage, error messages, Git exposure
- **INFO**: General indexed content

### Finding Categories
- `credentials` - Leaked passwords/secrets
- `backup_files` - Exposed backups
- `admin_panels` - Administrative interfaces
- `database_dumps` - Database files
- `source_code` - Exposed code repositories
- `cloud_storage` - S3/Azure/GCS links
- `error_messages` - Stack traces

---

## API Quota Management

**Google Custom Search Free Tier:**
- 100 queries per day
- Resets at midnight Pacific Time

**Scan Profile Usage:**
- Quick: ~10% of daily quota
- Standard: ~44% of daily quota
- Deep: ~100% of daily quota

**Tip**: Use Quick scans for testing, Standard for assessments.

---

## Troubleshooting

### "0 findings" after scan
- Verify Google API keys in `backend/.env`
- Ensure CSE is set to "Search the entire web"
- Try a well-known domain first (e.g., `github.com`)
- Check backend terminal for API errors

### Backend won't start
- Activate venv: `source .venv/bin/activate`
- Verify Python 3.11+: `python --version`
- Check logs for import errors

### Frontend won't start
- Delete and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `rm -rf .next`
- Ensure Node.js 18+: `node --version`

### API quota exceeded
- Backend logs show 429 errors
- Wait until midnight PT for reset
- Or subscribe to paid tier

---

## ⚙️ Advanced Configuration

### Backend Environment Variables (`backend/.env`)

**Core Settings:**
```
DATABASE_URL=sqlite:///./dorkx.db
SECRET_KEY=dev-secret-key
ENVIRONMENT=development
DEBUG=True
```

**Search Engines:**
```
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CSE_ID=your-custom-search-engine-id
BING_API_KEY=optional
```

**Rate Limiting:**
```
MAX_QUERIES_PER_DAY=100
MAX_QUERIES_PER_SESSION=20
QUERY_DELAY_SECONDS=3
```

### Get Google API Keys

1. **Google Custom Search API:**
   - Visit: https://developers.google.com/custom-search/v1/overview
   - Create project in Google Cloud Console
   - Enable Custom Search API
   - Create API Key credentials

2. **Custom Search Engine (CSE):**
   - Go to: https://cse.google.com/cse/
   - Create new search engine
   - **IMPORTANT:** Select "Search the entire web"
   - Copy your Search Engine ID

### Frontend Environment (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📚 Project Structure

```
DORK-X/
├── backend/              # FastAPI Backend
│   ├── app/
│   │   ├── api/         # REST endpoints
│   │   ├── services/    # Google Search API client
│   │   ├── models/      # Database models
│   │   └── main.py
│   ├── requirements.txt
│   └── .env            # Configuration
│
├── frontend/            # Next.js Frontend
│   ├── app/            # Pages (App Router)
│   ├── lib/            # API utilities
│   └── package.json
│
└── README.md           # This file
```

---

## 🧪 Testing

**Verify Backend Health:**
```bash
curl http://localhost:8000/api/v1/health
```

**API Documentation:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

---

## 📝 Tips for Development

- **Quick scan testing:** Use Quick profile (~10 queries) to test without exhausting daily quota
- **Monitor quotas:** Google free tier provides 100 queries/day
- **View logs:** Backend logs show all API calls and errors
- **Database:** SQLite stores all scans in `backend/dorkx.db` (auto-created)

## 🔧 Configuration

### Backend Environment (`backend/.env`)
```env
# Database - SQLite (no setup required)
DATABASE_URL=sqlite:///./dorkx.db

# Search APIs (Required for real results)
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CSE_ID=your-custom-search-engine-id

# Security
SECRET_KEY=dev-secret-key
JWT_SECRET=dev-jwt-secret

# Optional: Redis for caching (not required)
REDIS_URL=redis://localhost:6379
```

### Frontend Environment (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 Usage

1. **Configure Google API:**
   - Get API key from [Google Cloud Console](https://console.cloud.google.com)
   - Create Custom Search Engine at [CSE Portal](https://cse.google.com)
   - **Important:** Configure CSE to "Search the entire web"
   - Add credentials to `backend/.env`

2. **Start a Scan:**
   - Navigate to http://localhost:3000
   - Enter target domain (e.g., `example.com`)
   - Accept legal disclaimer
   - Select scan profile (Quick/Standard/Deep)
   - Click "Start Scan"

3. **View Results:**
   - Real-time progress updates
   - Findings organized by risk level
   - Filter by category, severity, or keyword
   - Click findings for detailed analysis

4. **Generate Report:**
   - Click "PDF Report" button
   - Download professional report with all findings

## 🛡️ Security Features

- **Google Custom Search**: Real dorking via official API
- **Input Validation**: Strict domain validation and sanitization
- **Rate Limiting**: API quota management (100 queries/day free tier)
- **Scope Control**: Automatic blocking of unauthorized targets
- **Audit Logging**: Complete activity tracking
- **API Key Protection**: Environment-based credential management
- **CAPTCHA Detection**: Automatic abort on detection

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest tests/ -v --cov=app

# Frontend tests
cd frontend
npm test
```

## 📊 Tech Stack

**Backend:**
- FastAPI (Python web framework)
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Redis (Caching)
- Pydantic (Validation)
- ReportLab (PDF generation)

**Frontend:**
- Next.js 14 (React framework)
- TailwindCSS (Styling)
- Recharts (Data visualization)
- Axios (HTTP client)
- Zustand (State management)

## 🎓 Development Phases

- [x] Phase 1: Project Setup & Architecture
- [ ] Phase 2: Core Dorking Engine
- [ ] Phase 3: Risk Classification System
- [ ] Phase 4: Frontend Dashboard
- [ ] Phase 5: Report Generation
- [ ] Phase 6: Testing & Deployment

## 📖 Documentation

- [Architecture Overview](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Dork Templates](docs/dorks.md)
- [Risk Classification](docs/risk-classification.md)
- [Deployment Guide](docs/deployment.md)

## 🤝 Contributing

This is an educational project. Contributions focused on:
- Security improvements
- New dork templates
- UI/UX enhancements
- Documentation

## 📄 License

This project is for educational purposes. See LICENSE file for details.

## ⚠️ Disclaimer

The developers of DORK-X assume no liability for misuse of this tool. Users are solely responsible for ensuring they have proper authorization before scanning any target. Unauthorized access to computer systems is illegal under laws including but not limited to the Computer Fraud and Abuse Act (CFAA) in the United States and similar laws in other jurisdictions.

## 📧 Contact

For educational inquiries only.

---

**Remember: With great power comes great responsibility. Use ethically, always.**
