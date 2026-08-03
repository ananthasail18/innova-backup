import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, func
from app.database.base import Base

class RestaurantNotes(Base):
    __tablename__ = "restaurant_notes"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dish_id = Column(String, ForeignKey("dishes.id"), nullable=False, unique=True, index=True)
    verified = Column(Boolean, default=False)
    chef_notes = Column(Text, nullable=True)
    preparation_notes = Column(Text, nullable=True)
    spice_calibration = Column(Text, nullable=True)
    customization_options = Column(Text, nullable=True)
    known_substitutions = Column(Text, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
