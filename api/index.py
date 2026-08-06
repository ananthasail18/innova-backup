import os
import sys
import shutil

# 1. Setup ephemeral SQLite database for Vercel
# Vercel functions only have write access in /tmp
# We copy the bundled tasteai.db to /tmp on cold start so the app works and can be tested
db_src = os.path.join(os.path.dirname(__file__), '..', 'backend', 'tasteai.db')
db_dest = '/tmp/tasteai.db'

# Always copy on cold start to ensure we have the latest seeded data
if os.path.exists(db_src):
    shutil.copy2(db_src, db_dest)

# Override the database URL so the backend uses the /tmp database
os.environ["DATABASE_URL"] = f"sqlite:///{db_dest}"

# 2. Add backend to sys.path so imports work
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend')
sys.path.append(backend_path)

# 3. Export the FastAPI app for Vercel
from app.main import app
