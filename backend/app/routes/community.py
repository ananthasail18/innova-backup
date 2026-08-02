from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.recommendation import RecommendationService, cosine_similarity
from app.models.taste_profile import TasteProfile

router = APIRouter()

@router.get("/community/similar-users/{user_id}", response_model=dict)
def get_similar_users(user_id: str, limit: int = 5, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    user_profile = db.query(TasteProfile).filter(TasteProfile.user_id == user_id).first()
    if not user_profile:
        return {"status": "success", "data": []}
        
    user_vector = service._get_taste_vector(user_profile)
    
    other_profiles = db.query(TasteProfile).filter(TasteProfile.user_id != user_id).all()
    
    similar_users = []
    for p in other_profiles:
        other_vec = service._get_taste_vector(p)
        sim = cosine_similarity(user_vector, other_vec)
        if sim > 0.82:
            similar_users.append({
                "user_id": p.user_id,
                "similarity": sim
            })
            
    similar_users.sort(key=lambda x: x["similarity"], reverse=True)
    
    return {"status": "success", "data": similar_users[:limit]}

@router.get("/community/recommendations/{user_id}", response_model=dict)
def get_community_recommendations(user_id: str, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    response = service.get_recommendations(user_id)
    community_recs = [
        rec for rec in response.recommendations 
        if any(r.type == "community" for r in rec.reasons)
    ]
    response.recommendations = community_recs
    return {"status": "success", "data": response.model_dump()}
