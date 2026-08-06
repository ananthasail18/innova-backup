from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models here to ensure they are registered with Base.metadata
from app.models.user import User
from app.models.restaurant import Restaurant
from app.models.category import Category
from app.models.dish import Dish
from app.models.taste_profile import TasteProfile
from app.models.community_signal import CommunitySignal
from app.models.knowledge import KnowledgeDocument, KnowledgeChunk, KnowledgeEmbedding
from app.models.metadata import Ingredient, DishIngredient, Allergen, DishAllergen, DishPairing
from app.models.notes import RestaurantNotes
from app.models.user_dish_interaction import UserDishInteraction
