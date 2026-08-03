import logging
from sqlalchemy.orm import Session
from app.models.knowledge import KnowledgeDocument, KnowledgeChunk
from app.services.rag.chunking import ChunkingService
from app.services.rag.providers import EmbeddingProvider, VectorStoreProvider

logger = logging.getLogger(__name__)

class IndexingService:
    def __init__(self, db: Session, embedding_provider: EmbeddingProvider, vector_store: VectorStoreProvider):
        self.db = db
        self.chunking_service = ChunkingService()
        self.embedding_provider = embedding_provider
        self.vector_store = vector_store
        self.model_name = "mock-embedding-ada-002"
        self.provider_name = "mock"

    def clear_index(self, restaurant_id: str):
        """Clears all chunks and embeddings for a restaurant."""
        logger.info(f"Clearing index for restaurant {restaurant_id}")
        # Delete chunks; embeddings are CASCADE deleted.
        self.db.query(KnowledgeChunk).filter(KnowledgeChunk.restaurant_id == restaurant_id).delete()
        self.db.commit()

    def index_all_pending(self, force: bool = False):
        """Finds all un-indexed chunks and generates embeddings. If force is True, re-chunks everything."""
        if force:
            # We assume a single restaurant MVP for now, so clear all chunks
            self.db.query(KnowledgeChunk).delete()
            self.db.commit()
            
            # Re-chunk all documents
            docs = self.db.query(KnowledgeDocument).all()
            for doc in docs:
                chunks = self.chunking_service.chunk_document(doc.content)
                for i, content in enumerate(chunks):
                    token_count = len(content.split())
                    chunk = KnowledgeChunk(
                        document_id=doc.id,
                        restaurant_id=doc.restaurant_id,
                        title=doc.title,
                        content=content,
                        chunk_index=i,
                        token_count=token_count,
                        embedding_status="PENDING"
                    )
                    self.db.add(chunk)
            self.db.commit()

        # Find all pending chunks
        pending_chunks = self.db.query(KnowledgeChunk).filter(KnowledgeChunk.embedding_status == "PENDING").all()
        if not pending_chunks:
            return {"processed": 0, "chunks": 0}

        chunk_ids = []
        texts = []
        
        for chunk in pending_chunks:
            chunk_ids.append(chunk.id)
            # Add metadata to semantic search text
            text_to_embed = f"Title: {chunk.title}\n\n{chunk.content}"
            texts.append(text_to_embed)
            
        # Generate embeddings
        logger.info(f"Generating embeddings for {len(texts)} chunks...")
        embeddings = self.embedding_provider.batch_generate(texts)
        
        # Store in Vector DB
        logger.info("Storing vectors...")
        self.vector_store.store_embeddings(chunk_ids, embeddings, self.model_name, self.provider_name)
        
        # Mark as completed
        for chunk in pending_chunks:
            chunk.embedding_status = "COMPLETED"
            chunk.embedding_model = self.model_name
            
        self.db.commit()
        
        return {
            "processed": len(set([c.document_id for c in pending_chunks])),
            "chunks": len(pending_chunks)
        }
