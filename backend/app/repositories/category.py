from sqlalchemy.orm import Session
from app.models.category import Category

class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_by_restaurant(self, restaurant_id: str) -> list[Category]:
        return self.db.query(Category).filter(Category.restaurant_id == restaurant_id).order_by(Category.sort_order).all()
