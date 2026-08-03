import uuid
from sqlalchemy import Column, String, Text, DateTime, func
from sqlalchemy.orm import relationship
from app.database.base import Base

class Restaurant(Base):
    __tablename__ = "restaurants"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, index=True)
    slug = Column(String, unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)
    logo = Column(String, nullable=True)
    theme_color = Column(String, nullable=True)
    primary_color = Column(String, nullable=True)
    secondary_color = Column(String, nullable=True)
    hero_image = Column(String, nullable=True)
    cover_image = Column(String, nullable=True)
    city = Column(String, nullable=True)
    cuisine = Column(String, nullable=True)
    opening_hours = Column(String, nullable=True)
    price_range = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    categories = relationship("Category", back_populates="restaurant", cascade="all, delete")
    dishes = relationship("Dish", back_populates="restaurant", cascade="all, delete")
