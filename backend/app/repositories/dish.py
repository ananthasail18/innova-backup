from sqlalchemy.orm import Session
from app.models.dish import Dish

class DishRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_by_restaurant(self, restaurant_id: str) -> list[Dish]:
        return self.db.query(Dish).filter(Dish.restaurant_id == restaurant_id).order_by(Dish.display_order).all()

    def get_by_category(self, category_id: str) -> list[Dish]:
        return self.db.query(Dish).filter(Dish.category_id == category_id).order_by(Dish.display_order).all()

    def get_by_id(self, dish_id: str) -> Dish | None:
        return self.db.query(Dish).filter(Dish.id == dish_id).first()
