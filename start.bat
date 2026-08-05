@echo off
echo ==============================================
echo TasteAI Setup ^& Start Script
echo ==============================================

echo [1/3] Setting up Python Backend...
cd backend
if not exist ".venv" (
    echo Creating virtual environment...
    python -m venv .venv
)
call .venv\Scripts\activate.bat
echo Installing backend dependencies...
pip install -r requirements.txt

start "TasteAI Backend" cmd /c "title TasteAI Backend & call .venv\Scripts\activate.bat & set PYTHONPATH=. & python -m uvicorn app.main:app --host 0.0.0.0 --port 8001"
cd ..

echo [2/3] Setting up Node Frontend...
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
)

echo [3/3] Starting Frontend...
start "TasteAI Frontend" cmd /c "title TasteAI Frontend & npm run dev -- --host"
cd ..

echo ==============================================
echo TasteAI is running!
echo Backend: http://localhost:8001
echo Frontend: http://localhost:5173
echo To access on your phone, find your local IP and visit http://YOUR_IP:5173
echo ==============================================
pause
