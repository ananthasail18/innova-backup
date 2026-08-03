from pydantic import BaseModel
from typing import Optional, Literal

class SessionIntent(BaseModel):
    meal_size: Optional[Literal["Small", "Medium", "Large"]] = None
    meal_goal: Optional[Literal["Snack", "Main Course", "Light Meal", "Heavy Meal"]] = None
    sharing: Optional[bool] = False
    budget_preference: Optional[Literal["Low", "Medium", "High"]] = None
    dietary_filter: Optional[Literal["Vegetarian", "Vegan", "Jain", "None"]] = None
    health_mode: Optional[bool] = False
    
    # Temporary max thresholds (e.g. "I don't want anything oily today")
    temporary_max_oiliness: Optional[float] = None
    temporary_max_masala: Optional[float] = None
    temporary_max_spice: Optional[float] = None
