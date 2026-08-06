from pydantic import BaseModel
from typing import List, Optional
from app.schemas.dish import DishOut

class RecommendationReason(BaseModel):
    type: str  # e.g., 'taste_match', 'community', 'popularity'
    text: str

class DishRecommendation(BaseModel):
    dish: DishOut
    score: float
    confidence: float
    reasons: List[RecommendationReason]
    community_liked_count: int = 0

class RecommendationResponse(BaseModel):
    user_id: str
    recommendations: List[DishRecommendation]
