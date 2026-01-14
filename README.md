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
├── frontend/         # Next.js React frontend
├── database/         # PostgreSQL scripts
├── reports/          # Generated reports
└── docs/            # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Installation

1. **Clone and setup:**
```bash
cd ~/Desktop/DORK-X
```

2. **Backend setup:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
```

3. **Frontend setup:**
```bash
cd ../frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

4. **Database setup:**
```bash
# Start PostgreSQL and Redis
docker-compose up -d db redis
# Run migrations
cd backend
alembic upgrade head
```

5. **Run the application:**

Terminal 1 (Backend):
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

Access at: http://localhost:3000

## 🔧 Configuration

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/dorkx
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key-here
GOOGLE_API_KEY=your-google-api-key
GOOGLE_CSE_ID=your-custom-search-engine-id
BING_API_KEY=your-bing-api-key
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📚 Usage

1. **Start a Scan:**
   - Navigate to the dashboard
   - Enter target domain (e.g., `example.com`)
   - Accept legal disclaimer
   - Select scan profile (Quick/Standard/Deep)
   - Click "Start Scan"

2. **View Results:**
   - Real-time progress updates
   - Findings organized by risk level
   - Filter by category, severity, or keyword
   - Click findings for detailed analysis

3. **Generate Report:**
   - Click "Generate Report"
   - Choose format (PDF/HTML/CSV)
   - Download professional penetration testing report

## 🛡️ Security Features

- **Input Validation**: Strict domain validation and sanitization
- **Rate Limiting**: Per-user and per-IP request limits
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
