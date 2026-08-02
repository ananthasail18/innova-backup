# 🍽️ TasteAI - AI-Powered Personalized Dining & Recommendation Engine

**TasteAI** is a personalized food discovery platform designed to revolutionize restaurant dining experiences. By pairing a **deterministic, math-driven vector recommendation engine** with a **conversational AI Dining Assistant powered by Google Gemini**, TasteAI helps users discover dishes perfectly matched to their unique taste preferences.

---

## ✨ Features

- 🎯 **8-Dimensional Taste Identity Quiz**: Scenario-based questionnaire that builds a personalized flavor vector across `Spice`, `Sweetness`, `Creaminess`, `Tanginess`, `Smokiness`, `Crunch`, `Adventure`, and `Portion Size`.
- ⚡ **Deterministic Recommendation Engine**: Math-based similarity matching (Euclidean distance & cosine metrics) providing transparent, reproducible recommendation scores and explainable match reasons without relying on LLM computation.
- 🤖 **AI Dining Assistant**: Integrated Google Gemini conversational waiter with full context awareness (current menu, user taste profile, active cart, and active page context). Supports tool calling for UI actions.
- 🌙 **Sleek Dark Mode UI**: Styled with Tailwind CSS v4, featuring glassmorphism, fluid micro-interactions, and vibrant primary accents (`#F97316`).
- 🖥️ **High-Density Desktop Grid**: Responsive menu grid supporting up to **7 columns in a row** on desktop screens (`2xl:grid-cols-7`).
- 🔍 **Granular Dish Details**: Displays comprehensive dish metadata including 8-dimensional dish flavor vectors, ingredients (badge pills), allergen safety alerts, dietary tags, and chef's notes.
- 💰 **Rupee Currency (₹)**: Native formatting and data handling in Indian Rupees across backend endpoints and frontend interfaces.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **Database & ORM**: SQLite + [SQLAlchemy ORM](https://www.sqlalchemy.org/)
- **Validation**: [Pydantic v2](https://docs.pydantic.dev/)
- **AI Integration**: Google Gemini API (`google-genai` SDK)

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/) (TypeScript)
- **Styling**: Vanilla CSS + [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Query Management**: TanStack [React Query](https://tanstack.com/query) + React Context API
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🏗️ Architecture & Philosophy

TasteAI strictly enforces a **separation of concerns**:
1. **Business Logic & Recommendations**: Executed entirely by backend Python services using deterministic linear algebra and vector space modeling.
2. **AI Dining Assistant**: Google Gemini handles explanation, conversation, and interactive assistance using structured context provided by backend API endpoints.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- Python (v3.11+)
- Google Gemini API Key

---

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Seed the database
python -m app.seed.seed_data

# Run backend server (runs on http://127.0.0.1:8001)
$env:PYTHONPATH = "."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
```

---

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

---

## 📡 API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/restaurant` | Fetch restaurant details |
| `GET` | `/api/v1/categories` | List all menu categories |
| `GET` | `/api/v1/dishes` | Fetch menu dishes (supports `category_id` filter) |
| `POST` | `/api/v1/users` | Register/create a new user session |
| `POST` | `/api/v1/taste-profile` | Submit taste quiz & generate profile vectors |
| `GET` | `/api/v1/taste-profile/{user_id}` | Fetch user's Taste Identity profile |
| `GET` | `/api/v1/recommendations/{user_id}` | Fetch top ranked dish recommendations |
| `GET` | `/api/v1/recommendations/{user_id}/dish/{dish_id}` | Fetch match score & explainability reasons for a dish |
| `POST` | `/api/v1/chat` | AI Dining Assistant chat interface (Gemini API) |

---

## 📂 Project Structure

```
innova_hack/
├── backend/
│   ├── app/
│   │   ├── ai/              # Gemini Assistant provider & prompt builders
│   │   ├── api/             # FastAPI Endpoint Routers
│   │   ├── database/        # SQLite DB connection setup
│   │   ├── models/          # SQLAlchemy Database Models
│   │   ├── repositories/    # Data Access Layer
│   │   ├── schemas/         # Pydantic Schemas
│   │   ├── seed/            # Seeding scripts
│   │   └── services/        # Taste Identity & Recommendation Engine
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Router & Root Layout
│   │   ├── features/        # Feature Modules (Chat, Landing, Onboarding, Profile, Restaurant)
│   │   ├── shared/          # UI Components, Axios API client, React Query hooks
│   │   └── index.css        # Tailwind theme tokens
├── context.md               # Detailed architectural context document
└── README.md                # Project documentation
```

---

## ❓ Common Setup & Environment Troubleshooting

If your team member or friend is having environment issues after cloning, check these step-by-step solutions:

### 1. `ModuleNotFoundError: No module named 'openai'` (or other dependencies)
Make sure all backend dependencies are installed inside the virtual environment:
```bash
cd backend
pip install -r requirements.txt
```

### 2. `ModuleNotFoundError: No module named 'app'`
This happens if Python cannot find the root `app` module package path. Always set `PYTHONPATH` or run Uvicorn as a module:
- **Windows (PowerShell)**:
  ```powershell
  cd backend
  $env:PYTHONPATH = "."
  python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
  ```
- **Linux / macOS**:
  ```bash
  cd backend
  PYTHONPATH=. python -m uvicorn app.main:app --host 0.0.0.0 --port 8001
  ```

### 3. Database is Empty / Restaurant 404 Error
If the database hasn't been initialized, run the seed script once:
```bash
cd backend
python -m app.seed.seed_data
```

### 4. Gemini AI Assistant Not Responding
Copy `backend/.env.example` to `backend/.env` and add your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 5. Frontend Cannot Connect to Backend (Network Error)
Make sure the backend is running on **port 8001** (or set `VITE_API_BASE_URL` in `frontend/.env` to match your backend port).

---

## 📄 License

This project was created for **Innova Hack 2026**. All rights reserved.
