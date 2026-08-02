from sqlalchemy.orm import Session
from app.models.restaurant import Restaurant

class RestaurantRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_first(self) -> Restaurant | None:
        return self.db.query(Restaurant).first()
