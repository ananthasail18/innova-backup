import json
import random
import math
from abc import ABC, abstractmethod
from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.knowledge import KnowledgeEmbedding

class EmbeddingProvider(ABC):
    @abstractmethod
    def generate_embedding(self, text: str) -> List[float]:
        pass

    @abstractmethod
    def batch_generate(self, texts: List[str]) -> List[List[float]]:
        pass

class MockEmbeddingProvider(EmbeddingProvider):
    """
    Generates deterministic fake vectors.
    """
    def __init__(self, dimensions: int = 1536):
        self.dimensions = dimensions

    def generate_embedding(self, text: str) -> List[float]:
        # Pseudo-deterministic based on text length for MVP
        base_val = (len(text) % 100) / 100.0
        return [base_val + (random.random() * 0.01) for _ in range(self.dimensions)]

    def batch_generate(self, texts: List[str]) -> List[List[float]]:
        return [self.generate_embedding(t) for t in texts]


import os
import httpx
from app.config.config import settings
import random

class GeminiEmbeddingProvider(EmbeddingProvider):
    """
    Generates semantic vectors using Gemini's text-embedding-004 via direct REST API.
    """
    def __init__(self):
        self.api_key = getattr(settings, "GEMINI_API_KEY", os.getenv("GEMINI_API_KEY"))
        self.model_name = "text-embedding-004"
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/{self.model_name}:embedContent?key={self.api_key}"

    def generate_embedding(self, text: str) -> List[float]:
        if not self.api_key or self.api_key == "DUMMY_KEY_FOR_TESTS":
            # fallback mock
            base_val = (len(text) % 100) / 100.0
            return [base_val + (random.random() * 0.01) for _ in range(768)]
            
        try:
            payload = {
                "model": f"models/{self.model_name}",
                "content": {
                    "parts": [{"text": text}]
                }
            }
            with httpx.Client() as client:
                response = client.post(self.url, json=payload, timeout=10.0)
                response.raise_for_status()
                data = response.json()
                return data["embedding"]["values"]
        except Exception as e:
            print("Embedding Error:", e)
            base_val = (len(text) % 100) / 100.0
            return [base_val + (random.random() * 0.01) for _ in range(768)]

    def batch_generate(self, texts: List[str]) -> List[List[float]]:
        # For simplicity in MVP, just generate one by one
        return [self.generate_embedding(t) for t in texts]


class VectorStoreProvider(ABC):
    @abstractmethod
    def store_embeddings(self, chunk_ids: List[str], embeddings: List[List[float]], model: str, provider: str = "mock"):
        pass
        
    @abstractmethod
    def clear_restaurant(self, restaurant_id: str):
        pass

    @abstractmethod
    def search_similar(self, query_embedding: List[float], top_k: int = 5) -> List[Dict]:
        pass

class SqliteVectorStoreProvider(VectorStoreProvider):
    """
    MVP Vector Store that saves vectors as JSON arrays in SQLite.
    """
    def __init__(self, db: Session):
        self.db = db

    def store_embeddings(self, chunk_ids: List[str], embeddings: List[List[float]], model: str, provider: str = "mock"):
        for chunk_id, vector in zip(chunk_ids, embeddings):
            emb_record = KnowledgeEmbedding(
                chunk_id=chunk_id,
                embedding_vector=json.dumps(vector),
                vector_dimensions=len(vector),
                embedding_model=model,
                embedding_provider=provider
            )
            self.db.add(emb_record)
        self.db.commit()

    def clear_restaurant(self, restaurant_id: str):
        pass

    def search_similar(self, query_embedding: List[float], top_k: int = 5) -> List[Dict]:
        from app.models.knowledge import KnowledgeChunk
        # Fetch all embeddings for MVP (in a real vector DB, this happens in-engine)
        all_embeddings = self.db.query(KnowledgeEmbedding).all()
        
        results = []
        for emb in all_embeddings:
            vector = json.loads(emb.embedding_vector)
            
            # Cosine similarity
            dot_product = sum(a * b for a, b in zip(query_embedding, vector))
            norm_a = math.sqrt(sum(a * a for a in query_embedding))
            norm_b = math.sqrt(sum(b * b for b in vector))
            
            if norm_a == 0 or norm_b == 0:
                similarity = 0
            else:
                similarity = dot_product / (norm_a * norm_b)
                
            results.append((similarity, emb.chunk_id))
            
        results.sort(key=lambda x: x[0], reverse=True)
        top_results = results[:top_k]
        
        # Hydrate with chunk data
        hydrated = []
        for score, chunk_id in top_results:
            chunk = self.db.query(KnowledgeChunk).filter(KnowledgeChunk.id == chunk_id).first()
            if chunk:
                from app.models.knowledge import KnowledgeDocument
                doc = self.db.query(KnowledgeDocument).filter(KnowledgeDocument.id == chunk.document_id).first()
                
                hydrated.append({
                    "score": score,
                    "chunk_id": chunk.id,
                    "title": chunk.title,
                    "content": chunk.content,
                    "token_count": chunk.token_count,
                    "document_id": chunk.document_id,
                    "document_type": doc.document_type if doc else "UNKNOWN",
                    "verification_status": "VERIFIED" if (doc and doc.verified) else "UNVERIFIED",
                    "updated_at": chunk.updated_at,
                    "source": f"Restaurant DB (Doc ID: {chunk.document_id})"
                })
        return hydrated
