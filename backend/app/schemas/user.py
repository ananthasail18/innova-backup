from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str = "Guest"
    email: Optional[EmailStr] = None

class UserCreate(UserBase):
    pass

class UserOut(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
