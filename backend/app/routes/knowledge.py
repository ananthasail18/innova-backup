from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.metadata import Ingredient, DishIngredient, Allergen, DishAllergen, DishPairing
from app.models.notes import RestaurantNotes
from app.models.knowledge import KnowledgeDocument

router = APIRouter()

@router.get("/ingredients")
def get_ingredients(db: Session = Depends(get_db)):
    ingredients = db.query(Ingredient).all()
    return {"status": "success", "data": [{"id": i.id, "name": i.name} for i in ingredients]}

@router.get("/dishes/{dish_id}/ingredients")
def get_dish_ingredients(dish_id: str, db: Session = Depends(get_db)):
    dish_ingredients = db.query(DishIngredient).filter(DishIngredient.dish_id == dish_id).all()
    if not dish_ingredients:
        return {"status": "success", "data": []}
    
    ingredient_ids = [di.ingredient_id for di in dish_ingredients]
    ingredients = db.query(Ingredient).filter(Ingredient.id.in_(ingredient_ids)).all()
    return {"status": "success", "data": [{"id": i.id, "name": i.name} for i in ingredients]}

@router.get("/dishes/{dish_id}/allergens")
def get_dish_allergens(dish_id: str, db: Session = Depends(get_db)):
    dish_allergens = db.query(DishAllergen).filter(DishAllergen.dish_id == dish_id).all()
    if not dish_allergens:
        return {"status": "success", "data": []}
        
    allergen_ids = [da.allergen_id for da in dish_allergens]
    allergens = db.query(Allergen).filter(Allergen.id.in_(allergen_ids)).all()
    
    allergen_map = {a.id: a.name for a in allergens}
    result = []
    for da in dish_allergens:
        result.append({
            "id": da.allergen_id,
            "name": allergen_map.get(da.allergen_id),
            "severity": da.severity
        })
    return {"status": "success", "data": result}

@router.get("/dishes/{dish_id}/metadata")
def get_dish_metadata(dish_id: str, db: Session = Depends(get_db)):
    notes = db.query(RestaurantNotes).filter(RestaurantNotes.dish_id == dish_id).first()
    if not notes:
        return {"status": "success", "data": None}
    
    return {
        "status": "success", 
        "data": {
            "id": notes.id,
            "verified": notes.verified,
            "chef_notes": notes.chef_notes,
            "preparation_notes": notes.preparation_notes,
            "spice_calibration": notes.spice_calibration,
            "customization_options": notes.customization_options,
            "known_substitutions": notes.known_substitutions
        }
    }

@router.get("/dishes/{dish_id}/pairings")
def get_dish_pairings(dish_id: str, db: Session = Depends(get_db)):
    pairings = db.query(DishPairing).filter(DishPairing.dish_id == dish_id).all()
    return {
        "status": "success", 
        "data": [{
            "id": p.id,
            "paired_dish_id": p.paired_dish_id,
            "pairing_type": p.pairing_type,
            "reason": p.reason
        } for p in pairings]
    }

@router.get("/restaurant/knowledge")
def get_restaurant_knowledge(db: Session = Depends(get_db)):
    docs = db.query(KnowledgeDocument).all()
    return {
        "status": "success",
        "data": [{
            "id": d.id,
            "restaurant_id": d.restaurant_id,
            "title": d.title,
            "document_type": d.document_type,
            "content": d.content,
            "verified": d.verified
        } for d in docs]
    }
