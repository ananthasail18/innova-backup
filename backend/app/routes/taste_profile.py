from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.taste_profile import TasteProfileOut, QuizSubmission
from app.repositories.taste_profile import TasteProfileRepository
from app.services.taste_identity import TasteIdentityService

router = APIRouter()

@router.post("/taste-profile", response_model=dict, status_code=status.HTTP_201_CREATED)
def submit_quiz_and_generate_profile(submission: QuizSubmission, db: Session = Depends(get_db)):
    profile_create = TasteIdentityService.generate_profile(submission)
    answered_count = len(submission.answers)
    confidence = min(0.9, answered_count / 8.0)
    
    repo = TasteProfileRepository(db)
    db_profile = repo.create_or_update(
        profile_create, 
        confidence_score=confidence, 
        onboarding_completed=True
    )
    
    return {"status": "success", "data": TasteProfileOut.model_validate(db_profile).model_dump()}

@router.get("/taste-profile/{user_id}", response_model=dict)
def get_taste_profile(user_id: str, db: Session = Depends(get_db)):
    repo = TasteProfileRepository(db)
    profile = repo.get_by_user_id(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Taste Profile not found")
    return {"status": "success", "data": TasteProfileOut.model_validate(profile).model_dump()}

@router.put("/taste-profile/{user_id}", response_model=dict)
def update_taste_profile(user_id: str, submission: QuizSubmission, db: Session = Depends(get_db)):
    if submission.user_id != user_id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    
    profile_create = TasteIdentityService.generate_profile(submission)
    answered_count = len(submission.answers)
    confidence = min(0.9, answered_count / 8.0)
    
    repo = TasteProfileRepository(db)
    db_profile = repo.create_or_update(
        profile_create, 
        confidence_score=confidence, 
        onboarding_completed=True
    )
    
    return {"status": "success", "data": TasteProfileOut.model_validate(db_profile).model_dump()}
