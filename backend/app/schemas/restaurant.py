from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class RestaurantBase(BaseModel):
    name: str
    slug: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    logo: Optional[str] = None
    theme_color: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None
    hero_image: Optional[str] = None
    cover_image: Optional[str] = None
    city: Optional[str] = None
    cuisine: Optional[str] = None
    opening_hours: Optional[str] = None
    price_range: Optional[str] = None

class RestaurantOut(RestaurantBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

from app.schemas.category import CategoryOut
from app.schemas.dish import DishOut
from app.schemas.recommendation import DishRecommendation
from typing import List, Dict, Any

class RestaurantTheme(BaseModel):
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None

class RestaurantDetailOut(BaseModel):
    restaurant: RestaurantOut
    menu: List[DishOut]
    categories: List[CategoryOut]
    theme: RestaurantTheme
    metadata: Dict[str, Any]
    recommendations: Optional[List[DishRecommendation]] = None
