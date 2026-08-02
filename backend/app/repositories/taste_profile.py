from sqlalchemy.orm import Session
from app.models.taste_profile import TasteProfile
from app.schemas.taste_profile import TasteProfileCreate

class TasteProfileRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user_id(self, user_id: str) -> TasteProfile:
        return self.db.query(TasteProfile).filter(TasteProfile.user_id == user_id).first()

    def create_or_update(self, profile: TasteProfileCreate, confidence_score: float = 0.8, onboarding_completed: bool = True) -> TasteProfile:
        db_profile = self.get_by_user_id(profile.user_id)
        if db_profile:
            for key, value in profile.model_dump().items():
                setattr(db_profile, key, value)
            db_profile.confidence_score = confidence_score
            db_profile.onboarding_completed = onboarding_completed
        else:
            db_profile = TasteProfile(
                **profile.model_dump(),
                confidence_score=confidence_score,
                onboarding_completed=onboarding_completed
            )
            self.db.add(db_profile)
            
        self.db.commit()
        self.db.refresh(db_profile)
        return db_profile
