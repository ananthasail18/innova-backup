from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.repositories.category import CategoryRepository
from app.repositories.restaurant import RestaurantRepository
from app.schemas.category import CategoryOut
from app.middleware.responses import success_response, ResponseEnvelope

router = APIRouter()

from typing import Optional

@router.get("/categories", response_model=ResponseEnvelope[list[CategoryOut]])
def get_categories(restaurant_id: Optional[str] = None, db: Session = Depends(get_db)):
    target_restaurant_id = restaurant_id
    if not target_restaurant_id:
        rest_repo = RestaurantRepository(db)
        restaurant = rest_repo.get_first()
        if not restaurant:
            raise HTTPException(status_code=404, detail="Restaurant not found")
        target_restaurant_id = restaurant.id
    
    cat_repo = CategoryRepository(db)
    categories = cat_repo.get_all_by_restaurant(target_restaurant_id)
    return success_response(data=categories)


