# TasteAI Environment Setup & Deployment Guide

## System Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.11.0 or higher
- **Git**: v2.30.0 or higher

---

## Environment Variables

### Backend Environment (`backend/.env`)

Copy `backend/.env.example` to `backend/.env`:

```env
PROJECT_NAME=TasteAI
API_V1_STR=/api/v1
DATABASE_URL=sqlite:///./tasteai.db
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### Frontend Environment (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8001/api/v1
```

---

## Local Installation & Execution

### 1. Backend Service Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# Linux / macOS:
# source .venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Seed SQLite database with initial restaurant & dish data
python -m app.ingestion.seed_data

# Run FastAPI Uvicorn server on port 8001
$env:PYTHONPATH = "."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

### 2. Frontend Application Setup

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## Testing & Verification Commands

### Backend Automated Test Suite
Run `pytest` to execute all unit and integration tests:

```bash
cd backend
$env:PYTHONPATH = "."
python -m pytest
```

### Frontend TypeScript & Production Build Check
Run `npm run build` to verify type checking and Vite bundle compilation:

```bash
cd frontend
npm run build
```

---

## Containerized Deployment (Docker)

Both backend and frontend include production Dockerfiles.

### Build & Run Containerized Backend
```bash
cd backend
docker build -t tasteai-backend .
docker run -d -p 8001:8001 --env-file .env tasteai-backend
```

### Build & Run Containerized Frontend
```bash
cd frontend
docker build -t tasteai-frontend .
docker run -d -p 5173:80 tasteai-frontend
```
