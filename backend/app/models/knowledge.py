import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, Integer, ForeignKey, func
from app.database.base import Base

class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    document_type = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    verified = Column(Boolean, default=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    document_id = Column(String, ForeignKey("knowledge_documents.id"), nullable=False, index=True)
    restaurant_id = Column(String, ForeignKey("restaurants.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    chunk_index = Column(Integer, default=0)
    token_count = Column(Integer, default=0)
    embedding_model = Column(String, nullable=True)
    embedding_status = Column(String, default="PENDING") # PENDING, COMPLETED, FAILED
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
class KnowledgeEmbedding(Base):
    __tablename__ = "knowledge_embeddings"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    chunk_id = Column(String, ForeignKey("knowledge_chunks.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    embedding_vector = Column(Text, nullable=False) # Store JSON array string
    vector_dimensions = Column(Integer, nullable=False)
    embedding_model = Column(String, nullable=False)
    embedding_provider = Column(String, nullable=False, default="mock")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
