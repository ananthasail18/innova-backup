import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.database.base import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False)
    name = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)

    restaurant = relationship("Restaurant", back_populates="categories")
    dishes = relationship("Dish", back_populates="category")

    __table_args__ = (
        UniqueConstraint('restaurant_id', 'name', name='uix_restaurant_category_name'),
    )
