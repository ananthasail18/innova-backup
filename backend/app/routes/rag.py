from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.services.rag.indexing import IndexingService
from app.services.rag.providers import MockEmbeddingProvider, SqliteVectorStoreProvider, GeminiEmbeddingProvider
from app.services.rag.retrieval import RetrievalService
from app.schemas.rag import RetrievalConfig
from app.ai.context.builder import ContextBuilder
from app.ai.prompt.builder import PromptBuilder
from app.models.knowledge import KnowledgeDocument, KnowledgeChunk


router = APIRouter()

def get_indexing_service(db: Session = Depends(get_db)):
    embedding_provider = GeminiEmbeddingProvider()
    vector_store = SqliteVectorStoreProvider(db)
    return IndexingService(db, embedding_provider, vector_store)

@router.post("/index")
def index_knowledge(force: bool = Query(False), db: Session = Depends(get_db), service: IndexingService = Depends(get_indexing_service)):
    result = service.index_all_pending(force=force)
    return {"status": "success", "data": result, "message": "Indexing triggered successfully"}

@router.get("/status")
def get_status(db: Session = Depends(get_db)):
    total_docs = db.query(KnowledgeDocument).count()
    total_chunks = db.query(KnowledgeChunk).count()
    indexed_chunks = db.query(KnowledgeChunk).filter(KnowledgeChunk.embedding_status == "COMPLETED").count()
    pending_chunks = db.query(KnowledgeChunk).filter(KnowledgeChunk.embedding_status == "PENDING").count()
    
    return {"status": "success", "data": {
        "total_documents": total_docs,
        "total_chunks": total_chunks,
        "indexed_chunks": indexed_chunks,
        "pending_chunks": pending_chunks,
        "indexed_percentage": (indexed_chunks / total_chunks * 100) if total_chunks > 0 else 0
    }}

@router.get("/chunks")
def get_chunks(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    chunks = db.query(KnowledgeChunk).offset(skip).limit(limit).all()
    # Serialize manually for MVP
    data = []
    for c in chunks:
        data.append({
            "id": c.id,
            "title": c.title,
            "content": c.content,
            "chunk_index": c.chunk_index,
            "token_count": c.token_count,
            "embedding_status": c.embedding_status
        })
    return {"status": "success", "data": data}

@router.get("/search-preview")
def search_preview(q: str = Query(..., description="The search query"), db: Session = Depends(get_db), service: IndexingService = Depends(get_indexing_service)):
    # 1. Embed query
    query_vector = service.embedding_provider.generate_embedding(q)
    
    # 2. Search
    results = service.vector_store.search_similar(query_vector, top_k=3)
    return {"status": "success", "data": results, "message": "Search successful"}

@router.post("/retrieve")
def retrieve_knowledge(q: str = Query(..., description="The search query"), config: RetrievalConfig = None, db: Session = Depends(get_db)):
    vector_store = SqliteVectorStoreProvider(db)
    embedding_provider = GeminiEmbeddingProvider()
    retrieval_service = RetrievalService(vector_store, embedding_provider, config)
    
    result = retrieval_service.retrieve(q)
    return {"status": "success", "data": result.model_dump(), "message": "Retrieval successful"}

@router.get("/context-preview")
def context_preview(
    q: str = Query(..., description="The search query"), 
    user_id: str = "mock-user-1",
    restaurant_id: str = "rest-1",
    db: Session = Depends(get_db)
):
    context_builder = ContextBuilder(db)
    context = context_builder.build_context(
        user_id=user_id,
        restaurant_id=restaurant_id,
        page_context="menu",
        query=q
    )
    
    prompt_builder = PromptBuilder()
    prompt = prompt_builder.build_system_prompt(context)
    
    return {"status": "success", "data": {
        "context_object": context,
        "final_prompt": prompt
    }}
