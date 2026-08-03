import uuid
from sqlalchemy import Column, String, Integer, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database.base import Base

class Ingredient(Base):
    __tablename__ = "ingredients"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    
    aliases = relationship("IngredientAlias", back_populates="ingredient", cascade="all, delete-orphan")

class IngredientAlias(Base):
    __tablename__ = "ingredient_aliases"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    ingredient_id = Column(String, ForeignKey("ingredients.id"), nullable=False, index=True)
    alias = Column(String, nullable=False)
    
    ingredient = relationship("Ingredient", back_populates="aliases")

class DishIngredient(Base):
    __tablename__ = "dish_ingredients"
    dish_id = Column(String, ForeignKey("dishes.id"), primary_key=True)
    ingredient_id = Column(String, ForeignKey("ingredients.id"), primary_key=True)

class Allergen(Base):
    __tablename__ = "allergens"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)

class DishAllergen(Base):
    __tablename__ = "dish_allergens"
    dish_id = Column(String, ForeignKey("dishes.id"), primary_key=True)
    allergen_id = Column(String, ForeignKey("allergens.id"), primary_key=True)
    severity = Column(String, nullable=True)

class DietaryTag(Base):
    __tablename__ = "dietary_tags"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)

class DishDietaryTag(Base):
    __tablename__ = "dish_dietary_tags"
    dish_id = Column(String, ForeignKey("dishes.id"), primary_key=True)
    tag_id = Column(String, ForeignKey("dietary_tags.id"), primary_key=True)

class DishPairing(Base):
    __tablename__ = "dish_pairings"
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    dish_id = Column(String, ForeignKey("dishes.id"), nullable=False, index=True)
    paired_dish_id = Column(String, ForeignKey("dishes.id"), nullable=False)
    pairing_type = Column(String, nullable=False) # MAIN, SIDE, BEVERAGE, DESSERT
    reason = Column(String, nullable=True)
