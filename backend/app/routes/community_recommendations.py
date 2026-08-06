from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.community_recommendation_service import CommunityRecommendationService
from app.services.taste_similarity_engine import CosineSimilarityEngine
from app.schemas.community_recommendations import CommunityRecommendationResponse

router = APIRouter()

@router.get("/restaurants/{restaurant_id}/community-recommendations", response_model=dict)
def get_community_recommendations_for_restaurant(restaurant_id: str, user_id: str, db: Session = Depends(get_db)):
    engine = CosineSimilarityEngine()
    service = CommunityRecommendationService(db, engine)
    
    response = service.get_community_recommendations(restaurant_id, user_id)
    
    return {"status": "success", "data": response.model_dump()}
