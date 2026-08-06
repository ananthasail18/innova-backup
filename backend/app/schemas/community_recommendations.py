from pydantic import BaseModel
from typing import List
from app.schemas.dish import DishOut

class CommunityExplanation(BaseModel):
    chosen_by: int
    average_similarity: float
    reason: str

class CommunityDishRecommendation(BaseModel):
    dish: DishOut
    community_score: float
    explanation: CommunityExplanation

class CommunityRecommendationResponse(BaseModel):
    community_size: int
    average_community_similarity: float
    recommendations: List[CommunityDishRecommendation]
