import uuid
from sqlalchemy import Column, String, Float, Text, Numeric, Boolean, Integer, DateTime, func, ForeignKey
from sqlalchemy.orm import relationship
from app.database.base import Base

class Dish(Base):
    __tablename__ = "dishes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False, index=True)
    category_id = Column(String, ForeignKey("categories.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String, nullable=True)
    is_vegetarian = Column(Boolean, default=False)
    is_available = Column(Boolean, default=True)
    display_order = Column(Integer, default=0)

    # Taste Vectors (0.0 - 1.0)
    spice_level = Column(Numeric(4, 3), default=0.5)
    sweetness_level = Column(Numeric(4, 3), default=0.5)
    creaminess_level = Column(Numeric(4, 3), default=0.5)
    tanginess_level = Column(Float, default=0.5)
    masala_intensity_level = Column(Float, default=0.5)
    crunchiness_level = Column(Float, default=0.5)
    oiliness_level = Column(Float, default=0.5)
    saltiness_level = Column(Float, default=0.5)

    # JSON Metadata
    from sqlalchemy.dialects.sqlite import JSON
    ingredients = Column(JSON, default=list)
    allergens = Column(JSON, default=list)
    dietary_tags = Column(JSON, default=list)
    recommended_pairings = Column(JSON, default=list)

    # Text Metadata
    preparation_style = Column(String, nullable=True)
    chef_notes = Column(Text, nullable=True)
    serving_style = Column(String, nullable=True)
    recommended_temperature = Column(String, nullable=True)
    popularity_score = Column(Numeric(4, 3), default=0.0)

    # Timestamps
    from sqlalchemy import DateTime, func
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    restaurant = relationship("Restaurant", back_populates="dishes")
    category = relationship("Category", back_populates="dishes")
