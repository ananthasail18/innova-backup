import os
import sys

from app.database.session import SessionLocal
from app.models.restaurant import Restaurant
from app.models.knowledge import KnowledgeDocument, KnowledgeChunk
from app.services.rag.chunking import ChunkingService

def seed_knowledge():
    db = SessionLocal()
    
    # Get the first restaurant
    restaurant = db.query(Restaurant).first()
    if not restaurant:
        print("No restaurant found. Cannot seed knowledge.")
        return
        
    # Check if already seeded
    if db.query(KnowledgeDocument).count() > 0:
        print("Knowledge documents already exist.")
        return
        
    docs_data = [
        ("Spice Customization", "POLICY", "We allow spice levels to be adjusted from 1 (mild) to 5 (very spicy) on most wok dishes. Sushi cannot be adjusted. Please let your server know if you have a low tolerance for heat."),
        ("Jain Options", "POLICY", "We offer a special Jain menu. Garlic and onion can be omitted from most stir-fries. Please ask for the separate Jain menu upon arrival."),
        ("Allergy Guidance", "FAQ", "We use peanut oil in our fryers. Cross-contamination with gluten is possible. We do our best to accommodate celiac disease, but our kitchen is not 100% gluten-free."),
        ("Preparation Time", "FAQ", "Average ticket time is 15-20 minutes. Wagyu Beef Donburi may take up to 25 minutes. Sushi rolls are typically served within 10 minutes."),
        ("Kids Menu & Spice Guidance", "GUIDE", "We do not have a dedicated kids menu, but we recommend the Avocado Mango Roll and the Edamame without chili for children. We can also prepare plain noodles upon request."),
        ("Beverage Pairing Guide", "GUIDE", "For spicy dishes, we highly recommend the Lychee Martini to cut the heat. For rich dishes like Black Cod, Sencha Green Tea provides a perfect palate cleanser."),
        ("Customization Policy", "POLICY", "We accept most substitutions for allergies, but we politely decline substitutions that alter the fundamental flavor profile of our signature dishes. Extra sauces will incur a small fee.")
    ]
    
    chunking_service = ChunkingService()
    
    for title, doc_type, content in docs_data:
        doc = KnowledgeDocument(
            restaurant_id=restaurant.id,
            title=title,
            document_type=doc_type,
            content=content,
            verified=True
        )
        db.add(doc)
        db.commit()
        db.refresh(doc)
        
        # Generate chunks
        chunks_text = chunking_service.chunk_document(content)
        for i, chunk_text in enumerate(chunks_text):
            token_count = len(chunk_text.split())
            chunk = KnowledgeChunk(
                document_id=doc.id,
                restaurant_id=restaurant.id,
                title=doc.title,
                content=chunk_text,
                chunk_index=i,
                token_count=token_count,
                embedding_status="PENDING"
            )
            db.add(chunk)
        
    db.commit()
    print("Successfully seeded Knowledge Documents and Chunks!")

if __name__ == "__main__":
    seed_knowledge()
