import uuid
from sqlalchemy import Column, String, Boolean, Integer, Text, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database.base import Base

class CommunitySignal(Base):
    __tablename__ = "community_signals"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    dish_id = Column(String, ForeignKey("dishes.id"), nullable=False, index=True)
    
    ordered = Column(Boolean, default=False)
    finished = Column(Boolean, default=False)
    liked = Column(Boolean, default=False)
    rating = Column(Integer, nullable=True)
    would_reorder = Column(Boolean, default=False)
    feedback_text = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Depending on how the relationship is structured on the other sides, you might want back_populates here.
    # For now, this serves the recommendation engine perfectly.
