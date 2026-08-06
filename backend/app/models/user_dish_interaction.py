import uuid
from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.base import Base

class UserDishInteraction(Base):
    __tablename__ = "user_dish_interactions"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    dish_id = Column(String, ForeignKey("dishes.id"), nullable=False, index=True)
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False, index=True)
    
    # E.g., 'like', 'order'
    interaction_type = Column(String, nullable=False, default="like")
    
    # Store the TasteDNA snapshot at the time of interaction
    taste_snapshot = Column(JSON, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    dish = relationship("Dish")
    restaurant = relationship("Restaurant")
