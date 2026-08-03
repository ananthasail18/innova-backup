from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.repositories.restaurant import RestaurantRepository
from app.repositories.category import CategoryRepository
from app.repositories.dish import DishRepository
from app.schemas.restaurant import RestaurantOut, RestaurantDetailOut, RestaurantTheme
from app.schemas.dish import DishOut
from app.schemas.category import CategoryOut
from app.middleware.responses import success_response, ResponseEnvelope
from app.services.recommendation import RecommendationService

router = APIRouter()

@router.get("/restaurant", response_model=ResponseEnvelope[RestaurantOut])
def get_restaurant(db: Session = Depends(get_db)):
    repo = RestaurantRepository(db)
    restaurant = repo.get_first()
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    return success_response(data=restaurant)

@router.get("/restaurants/{slug}", response_model=ResponseEnvelope[RestaurantDetailOut])
@router.get("/restaurant/{slug}", response_model=ResponseEnvelope[RestaurantDetailOut])
def get_restaurant_by_slug(slug: str, user_id: str = None, db: Session = Depends(get_db)):
    repo = RestaurantRepository(db)
    restaurant = repo.get_by_slug(slug)
    if not restaurant:
        raise HTTPException(status_code=404, detail="Restaurant not found")
    
    cat_repo = CategoryRepository(db)
    categories = cat_repo.get_all_by_restaurant(restaurant.id)
    
    dish_repo = DishRepository(db)
    menu = dish_repo.get_all_by_restaurant(restaurant.id)
    
    metadata = {
        "city": restaurant.city,
        "cuisine": restaurant.cuisine,
        "description": restaurant.description,
        "opening_hours": restaurant.opening_hours,
        "price_range": restaurant.price_range,
    }
    
    theme = RestaurantTheme(
        primary_color=restaurant.primary_color,
        secondary_color=restaurant.secondary_color
    )
    
    recs = None
    if user_id:
        rec_service = RecommendationService(db)
        recs_data = rec_service.get_recommendations(user_id, restaurant_id=restaurant.id)
        recs = recs_data.recommendations
    
    detail = RestaurantDetailOut(
        restaurant=RestaurantOut.model_validate(restaurant),
        menu=[DishOut.model_validate(d) for d in menu],
        categories=[CategoryOut.model_validate(c) for c in categories],
        theme=theme,
        metadata=metadata,
        recommendations=recs
    )
    return success_response(data=detail)


