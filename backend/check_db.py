from app.database.session import SessionLocal
from app.models.taste_profile import TasteProfile
db = SessionLocal()
profiles = db.query(TasteProfile).all()
for p in profiles:
    print(f"Profile: {p.user_id}, {p.spice_preference}")
