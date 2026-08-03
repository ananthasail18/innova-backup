from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel, Field, ConfigDict

class DishBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_vegetarian: bool = False
    is_available: bool = True
    display_order: int = 0
    restaurant_id: str
    category_id: str

    spice_level: float = 0.5
    sweetness_level: float = 0.5
    creaminess_level: float = 0.5
    tanginess_level: float = Field(0.5, ge=0.0, le=1.0)
    masala_intensity_level: float = Field(0.5, ge=0.0, le=1.0)
    crunchiness_level: float = Field(0.5, ge=0.0, le=1.0)
    oiliness_level: float = Field(0.5, ge=0.0, le=1.0)
    saltiness_level: float = Field(0.5, ge=0.0, le=1.0)
    ingredients: List[str] = []
    allergens: List[str] = []
    dietary_tags: List[str] = []
    recommended_pairings: List[str] = []

    preparation_style: Optional[str] = None
    chef_notes: Optional[str] = None
    serving_style: Optional[str] = None
    recommended_temperature: Optional[str] = None
    popularity_score: float = 0.0

class DishOut(DishBase):
    id: str
    

    model_config = ConfigDict(from_attributes=True)
