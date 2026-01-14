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

Access at: http://localhost:3000

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
