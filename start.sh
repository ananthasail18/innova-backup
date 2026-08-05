#!/bin/bash
echo "=============================================="
echo "TasteAI Setup & Start Script (Mac/Linux)"
echo "=============================================="

echo "[1/3] Setting up Python Backend..."
cd backend
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi
source .venv/bin/activate
echo "Installing backend dependencies..."
pip install -r requirements.txt

# Start backend in background
export PYTHONPATH="."
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!
cd ..

echo "[2/3] Setting up Node Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo "[3/3] Starting Frontend..."
# Start frontend in foreground
npm run dev -- --host

# Trap Ctrl+C to kill background processes
trap "kill $BACKEND_PID" EXIT
