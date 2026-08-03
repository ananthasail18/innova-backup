from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.recommendation import RecommendationResponse, DishRecommendation
from app.services.recommendation import RecommendationService

router = APIRouter()

@router.get("/recommendations/{user_id}", response_model=dict)
def get_recommendations(user_id: str, restaurant_id: str = None, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    response = service.get_recommendations(user_id, restaurant_id=restaurant_id)
    return {"status": "success", "data": response.model_dump()}

@router.get("/recommendations/{user_id}/top", response_model=dict)
def get_top_recommendations(user_id: str, restaurant_id: str = None, limit: int = 3, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    response = service.get_recommendations(user_id, restaurant_id=restaurant_id)
    response.recommendations = response.recommendations[:limit]
    return {"status": "success", "data": response.model_dump()}

@router.get("/recommendations/{user_id}/dish/{dish_id}", response_model=dict)
def get_dish_recommendation(user_id: str, dish_id: str, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    response = service.get_recommendations(user_id)
    for rec in response.recommendations:
        if rec.dish.id == dish_id:
            return {"status": "success", "data": rec.model_dump()}
    raise HTTPException(status_code=404, detail="Recommendation not found for dish")


