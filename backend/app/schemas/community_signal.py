from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class CommunitySignalBase(BaseModel):
    user_id: str
    dish_id: str
    ordered: bool = False
    finished: bool = False
    liked: bool = False
    rating: Optional[int] = None
    would_reorder: bool = False
    feedback_text: Optional[str] = None

class CommunitySignalCreate(CommunitySignalBase):
    pass

class CommunitySignalOut(CommunitySignalBase):
    id: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
