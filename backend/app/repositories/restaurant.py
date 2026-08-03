from sqlalchemy.orm import Session
from app.models.restaurant import Restaurant

class RestaurantRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_first(self) -> Restaurant | None:
        return self.db.query(Restaurant).first()

    def get_by_slug(self, slug: str) -> Restaurant | None:
        return self.db.query(Restaurant).filter(Restaurant.slug == slug).first()

