from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.taste_profile import TasteProfileOut, QuizSubmission
from app.repositories.taste_profile import TasteProfileRepository
from app.services.taste_identity import TasteIdentityService

router = APIRouter()

from app.services.taste_dna_learning import TasteDNALearningService
from pydantic import BaseModel

class FeedbackEventRequest(BaseModel):
    user_id: str
    event_type: str  # e.g. POST_MEAL_FEEDBACK, ORDER_COMPLETED
    dimension_deltas: dict  # e.g. {"oiliness": -0.10, "spiciness": 0.05}
    event_description: str

@router.post("/taste-profile", response_model=dict, status_code=status.HTTP_201_CREATED)
def submit_quiz_and_generate_profile(submission: QuizSubmission, db: Session = Depends(get_db)):
    learning_service = TasteDNALearningService(db)
    db_profile = learning_service.initialize_from_quiz(submission)
    return {"status": "success", "data": TasteProfileOut.model_validate(db_profile).model_dump()}

@router.get("/taste-profile/{user_id}", response_model=dict)
@router.get("/taste-dna/{user_id}", response_model=dict)
def get_taste_dna(user_id: str, db: Session = Depends(get_db)):
    learning_service = TasteDNALearningService(db)
    profile = learning_service.get_or_create_dna(user_id)
    if not profile:
        return {"status": "success", "data": None}
    
    out_data = TasteProfileOut.model_validate(profile).model_dump()
    out_data["dna_matrix"] = profile.dna_matrix_json
    return {"status": "success", "data": out_data}

@router.post("/taste-dna/feedback", response_model=dict)
def record_taste_dna_feedback(request: FeedbackEventRequest, db: Session = Depends(get_db)):
    learning_service = TasteDNALearningService(db)
    updated_profile = learning_service.record_feedback_event(
        user_id=request.user_id,
        event_type=request.event_type,
        dimension_deltas=request.dimension_deltas,
        event_description=request.event_description
    )
    out_data = TasteProfileOut.model_validate(updated_profile).model_dump()
    out_data["dna_matrix"] = updated_profile.dna_matrix_json
    return {"status": "success", "data": out_data}

@router.put("/taste-profile/{user_id}", response_model=dict)
def update_taste_profile(user_id: str, submission: QuizSubmission, db: Session = Depends(get_db)):
    if submission.user_id != user_id:
        raise HTTPException(status_code=400, detail="User ID mismatch")
    
    learning_service = TasteDNALearningService(db)
    db_profile = learning_service.initialize_from_quiz(submission)
    return {"status": "success", "data": TasteProfileOut.model_validate(db_profile).model_dump()}
