# DORK-X

Automated OSINT Reconnaissance Platform

## Features
- Automated Google dorking & OSINT reconnaissance
- Risk-based finding classification
- Professional pentesting reports
- Analytics dashboard
- 20+ reconnaissance categories
- API-first design (FastAPI backend, Next.js frontend)

---

## Quick Start

### 1. Clone the repository
```sh
git clone https://github.com/yourusername/dork-x.git
cd dork-x
```

### 2. Backend Setup (FastAPI)
```sh
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # Edit .env with your API keys
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup (Next.js)
```sh
cd ../frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/docs

---

## Environment Variables
Copy `.env.example` to `.env` in the backend directory and fill in your API keys:

```
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CSE_ID=your_google_cse_id
ALLOWED_ORIGINS=http://localhost:3000
SECRET_KEY=your_secret_key
DATABASE_URL=sqlite:///test.db
REDIS_URL=redis://localhost:6379/0
```

---

## Docker (optional)

You can use Docker Compose for a full-stack setup:

```sh
docker-compose up --build
```

---

## Legal Disclaimer
**DORK-X is for authorized security testing and educational use only.**
Never scan targets without explicit permission.

---

## License
MIT
