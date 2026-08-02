from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from app.database.session import get_db
from app.repositories.dish import DishRepository
from app.repositories.restaurant import RestaurantRepository
from app.schemas.dish import DishOut
from app.core.responses import success_response, ResponseEnvelope

router = APIRouter()

@router.get("/dishes", response_model=ResponseEnvelope[list[DishOut]])
def get_dishes(category_id: Optional[str] = None, db: Session = Depends(get_db)):
    rest_repo = RestaurantRepository(db)
    restaurant = rest_repo.get_first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    dish_repo = DishRepository(db)
    if category_id:
        dishes = dish_repo.get_by_category(category_id)
    else:
        dishes = dish_repo.get_all_by_restaurant(restaurant.id)
    return success_response(data=dishes)

@router.get("/dish/{id}", response_model=ResponseEnvelope[DishOut])
def get_dish(id: str, db: Session = Depends(get_db)):
    dish_repo = DishRepository(db)
    dish = dish_repo.get_by_id(id)
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    return success_response(data=dish)
