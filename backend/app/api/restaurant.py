from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.repositories.restaurant import RestaurantRepository
from app.schemas.restaurant import RestaurantOut
from app.core.responses import success_response, ResponseEnvelope

router = APIRouter()

@router.get("/restaurant", response_model=ResponseEnvelope[RestaurantOut])
def get_restaurant(db: Session = Depends(get_db)):
    repo = RestaurantRepository(db)
    restaurant = repo.get_first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return success_response(data=restaurant)
