from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class RetrievedChunk(BaseModel):
    chunk_id: str
    content: str
    score: float
    document_title: str
    document_type: str
    source: str
    token_count: int
    updated_at: Optional[datetime] = None
    verification_status: str = "UNVERIFIED"

class RetrievalConfig(BaseModel):
    top_k: int = Field(default=3, ge=1)
    similarity_threshold: float = Field(default=0.70, ge=0.0, le=1.0)
    max_context_tokens: int = Field(default=2000, ge=100)

class RetrievalResult(BaseModel):
    query: str
    embedded_query: List[float]
    chunks: List[RetrievedChunk]
    latency_ms: float
    total_tokens: int
    context_size_bytes: int
