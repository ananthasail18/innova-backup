from typing import Optional
from datetime import datetime
from pydantic import BaseModel, ConfigDict

class RestaurantBase(BaseModel):
    name: str
    description: Optional[str] = None
    logo_url: Optional[str] = None
    theme_color: Optional[str] = None

class RestaurantOut(RestaurantBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
