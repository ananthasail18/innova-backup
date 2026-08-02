from pydantic import BaseModel, ConfigDict

class CategoryBase(BaseModel):
    name: str
    sort_order: int

class CategoryOut(CategoryBase):
    id: str
    restaurant_id: str
    
    model_config = ConfigDict(from_attributes=True)
