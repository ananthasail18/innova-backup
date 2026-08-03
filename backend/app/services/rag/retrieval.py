import time
from typing import List
from app.services.rag.providers import VectorStoreProvider, EmbeddingProvider
from app.schemas.rag import RetrievedChunk, RetrievalResult, RetrievalConfig

class RetrievalService:
    def __init__(self, vector_store: VectorStoreProvider, embedding_provider: EmbeddingProvider, config: RetrievalConfig = None):
        self.vector_store = vector_store
        self.embedding_provider = embedding_provider
        self.config = config or RetrievalConfig()

    def retrieve(self, query: str) -> RetrievalResult:
        start_time = time.time()
        
        # 1. Embed query
        query_vector = self.embedding_provider.generate_embedding(query)
        
        # 2. Vector search
        # Request more than top_k so we can safely deduplicate
        raw_results = self.vector_store.search_similar(query_vector, top_k=self.config.top_k * 2)
        
        # 3. Filter and deduplicate
        unique_chunks = []
        seen_titles = set()
        total_tokens = 0
        context_size_bytes = 0
        
        for res in raw_results:
            if res["score"] < self.config.similarity_threshold:
                continue
                
            # Prevent overly duplicated or extremely similar chunks by title 
            # (simple deduping mechanism)
            if res["title"] in seen_titles:
                continue
                
            if total_tokens + res["token_count"] > self.config.max_context_tokens:
                # Stop if we hit context limits
                break
                
            chunk = RetrievedChunk(
                chunk_id=res["chunk_id"],
                content=res["content"],
                score=res["score"],
                document_title=res["title"],
                document_type=res["document_type"],
                source=res["source"],
                token_count=res["token_count"],
                updated_at=res["updated_at"],
                verification_status=res["verification_status"]
            )
            
            unique_chunks.append(chunk)
            seen_titles.add(res["title"])
            total_tokens += res["token_count"]
            context_size_bytes += len(res["content"].encode('utf-8'))
            
            if len(unique_chunks) >= self.config.top_k:
                break
                
        latency = (time.time() - start_time) * 1000
        
        return RetrievalResult(
            query=query,
            embedded_query=query_vector,
            chunks=unique_chunks,
            latency_ms=latency,
            total_tokens=total_tokens,
            context_size_bytes=context_size_bytes
        )
