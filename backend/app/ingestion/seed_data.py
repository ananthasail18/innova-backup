import logging
import random
from app.database.session import SessionLocal
from app.models.restaurant import Restaurant
from app.models.category import Category
from app.models.dish import Dish
from app.models.user import User
from app.models.taste_profile import TasteProfile
from app.models.community_signal import CommunitySignal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def seed():
    db = SessionLocal()
    try:
        if db.query(Restaurant).first():
            logger.info("Database already seeded. Cleaning up for Stage 3 reseeding...")
            db.query(CommunitySignal).delete()
            db.query(TasteProfile).delete()
            db.query(Dish).delete()
            db.query(Category).delete()
            db.query(Restaurant).delete()
            db.query(User).filter(User.name.startswith("Community User")).delete()
            db.commit()

        # 1. Restaurant
        restaurant = Restaurant(
            name="Spice Symphony",
            description="Modern Asian Fusion serving the best flavors in town.",
            theme_color="#ef4444"
        )
        db.add(restaurant)
        db.commit()
        db.refresh(restaurant)

        # 2. Categories
        categories_data = ["Starters", "Sushi Rolls", "Main Course", "Desserts", "Beverages"]
        categories = {}
        for idx, cat_name in enumerate(categories_data):
            category = Category(restaurant_id=restaurant.id, name=cat_name, sort_order=idx)
            db.add(category)
            db.commit()
            db.refresh(category)
            categories[cat_name] = category

        # 3. Dishes
        dishes_data = [
            {
                "category_id": categories["Starters"].id,
                "name": "Spicy Edamame",
                "description": "Steamed soybeans tossed in chili garlic sauce.",
                "price": 559.00,
                "image_url": "https://images.unsplash.com/photo-1625938144755-652e08e359b7?w=500&q=80",
                "is_vegetarian": True,
                "display_order": 1,
                "spice_level": 0.6,
                "sweetness_level": 0.2,
                "creaminess_level": 0.1,
                "tanginess_level": 0.4,
                "smokiness_level": 0.2,
                "crunchiness_level": 0.5,
                "adventure_level": 0.3,
                "portion_size": 0.3,
                "ingredients": ["Edamame", "Chili", "Garlic", "Soy Sauce"],
                "allergens": ["Soy"],
                "dietary_tags": ["Vegan", "Gluten-Free"],
                "preparation_style": "Steamed",
                "chef_notes": "Tossed fresh in wok with house chili oil.",
                "popularity_score": 0.75
            },
            {
                "category_id": categories["Starters"].id,
                "name": "Crispy Calamari",
                "description": "Lightly battered squid rings with yuzu aioli.",
                "price": 1039.00,
                "image_url": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80",
                "is_vegetarian": False,
                "display_order": 2,
                "spice_level": 0.2,
                "sweetness_level": 0.3,
                "creaminess_level": 0.6,
                "tanginess_level": 0.7,
                "smokiness_level": 0.1,
                "crunchiness_level": 0.9,
                "adventure_level": 0.4,
                "portion_size": 0.4,
                "ingredients": ["Squid", "Flour", "Yuzu", "Mayo"],
                "allergens": ["Seafood", "Gluten", "Egg"],
                "popularity_score": 0.85
            },
            {
                "category_id": categories["Sushi Rolls"].id,
                "name": "Dragon Roll",
                "description": "Eel, cucumber, and crab topped with avocado and sweet sauce.",
                "price": 1279.00,
                "image_url": "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&q=80",
                "is_vegetarian": False,
                "display_order": 1,
                "spice_level": 0.1,
                "sweetness_level": 0.7,
                "creaminess_level": 0.7,
                "tanginess_level": 0.2,
                "smokiness_level": 0.4,
                "crunchiness_level": 0.3,
                "adventure_level": 0.5,
                "portion_size": 0.6,
                "ingredients": ["Eel", "Crab", "Avocado", "Cucumber", "Rice"],
                "allergens": ["Seafood", "Gluten", "Soy"],
                "popularity_score": 0.90
            },
            {
                "category_id": categories["Sushi Rolls"].id,
                "name": "Spicy Tuna Crispy Rice",
                "description": "Pan-fried sushi rice topped with spicy tuna and jalapeño.",
                "price": 1160.00,
                "image_url": "https://images.unsplash.com/photo-1553621042-f6e147245754?w=500&q=80",
                "is_vegetarian": False,
                "display_order": 2,
                "spice_level": 0.8,
                "sweetness_level": 0.2,
                "creaminess_level": 0.4,
                "tanginess_level": 0.3,
                "smokiness_level": 0.2,
                "crunchiness_level": 0.8,
                "adventure_level": 0.6,
                "portion_size": 0.5,
                "ingredients": ["Tuna", "Rice", "Jalapeno", "Spicy Mayo"],
                "allergens": ["Seafood", "Egg", "Soy"],
                "popularity_score": 0.88,
                "chef_notes": "Rice is fried until perfectly golden."
            },
            {
                "category_id": categories["Sushi Rolls"].id,
                "name": "Avocado Mango Roll",
                "description": "Fresh avocado, sweet mango, and cucumber.",
                "price": 799.00,
                "image_url": "https://images.unsplash.com/photo-1615361200141-f45040f367be?w=500&q=80",
                "is_vegetarian": True,
                "display_order": 3,
                "spice_level": 0.0,
                "sweetness_level": 0.6,
                "creaminess_level": 0.7,
                "tanginess_level": 0.4,
                "smokiness_level": 0.0,
                "crunchiness_level": 0.2,
                "adventure_level": 0.2,
                "portion_size": 0.5,
                "ingredients": ["Avocado", "Mango", "Cucumber", "Rice"],
                "allergens": [],
                "dietary_tags": ["Vegan", "Gluten-Free"],
                "popularity_score": 0.65
            },
            {
                "category_id": categories["Main Course"].id,
                "name": "Miso Glazed Black Cod",
                "description": "Sustainably caught cod marinated in sweet saikyo miso.",
                "price": 2240.00,
                "image_url": "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=500&q=80",
                "is_vegetarian": False,
                "display_order": 1,
                "spice_level": 0.1,
                "sweetness_level": 0.7,
                "creaminess_level": 0.8,
                "tanginess_level": 0.3,
                "smokiness_level": 0.5,
                "crunchiness_level": 0.1,
                "adventure_level": 0.7,
                "portion_size": 0.7,
                "ingredients": ["Black Cod", "Saikyo Miso", "Mirin", "Sake"],
                "allergens": ["Seafood", "Soy"],
                "popularity_score": 0.95,
                "chef_notes": "Marinated for 72 hours."
            },
            {
                "category_id": categories["Main Course"].id,
                "name": "Pad Thai Noodles",
                "description": "Stir-fried rice noodles with tamarind, peanuts, and tofu.",
                "price": 1320.00,
                "image_url": "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500&q=80",
                "is_vegetarian": True,
                "display_order": 2,
                "spice_level": 0.4,
                "sweetness_level": 0.6,
                "creaminess_level": 0.2,
                "tanginess_level": 0.8,
                "smokiness_level": 0.3,
                "crunchiness_level": 0.6,
                "adventure_level": 0.3,
                "portion_size": 0.8,
                "ingredients": ["Rice Noodles", "Tofu", "Peanuts", "Tamarind", "Bean Sprouts"],
                "allergens": ["Peanuts", "Soy"],
                "popularity_score": 0.82
            },
            {
                "category_id": categories["Main Course"].id,
                "name": "Wagyu Beef Donburi",
                "description": "Premium wagyu beef over rice with an onsen egg.",
                "price": 2560.00,
                "image_url": "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=500&q=80",
                "is_vegetarian": False,
                "display_order": 3,
                "spice_level": 0.2,
                "sweetness_level": 0.5,
                "creaminess_level": 0.8,
                "tanginess_level": 0.2,
                "smokiness_level": 0.6,
                "crunchiness_level": 0.1,
                "adventure_level": 0.6,
                "portion_size": 0.8,
                "ingredients": ["Wagyu Beef", "Rice", "Egg", "Soy Sauce", "Onions"],
                "allergens": ["Egg", "Soy", "Gluten"],
                "popularity_score": 0.89
            },
            {
                "category_id": categories["Desserts"].id,
                "name": "Matcha Tiramisu",
                "description": "Classic tiramisu infused with premium Kyoto matcha.",
                "price": 719.00,
                "image_url": "https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?w=500&q=80",
                "is_vegetarian": True,
                "display_order": 1,
                "spice_level": 0.0,
                "sweetness_level": 0.7,
                "creaminess_level": 0.9,
                "tanginess_level": 0.1,
                "smokiness_level": 0.0,
                "crunchiness_level": 0.1,
                "adventure_level": 0.5,
                "portion_size": 0.4,
                "popularity_score": 0.78
            },
            {
                "category_id": categories["Desserts"].id,
                "name": "Yuzu Cheesecake",
                "description": "Creamy cheesecake with a refreshing Japanese citrus glaze.",
                "price": 760.00,
                "image_url": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80",
                "is_vegetarian": True,
                "display_order": 2,
                "spice_level": 0.0,
                "sweetness_level": 0.8,
                "creaminess_level": 0.9,
                "tanginess_level": 0.8,
                "smokiness_level": 0.0,
                "crunchiness_level": 0.3,
                "adventure_level": 0.4,
                "portion_size": 0.5,
                "popularity_score": 0.84
            },
            {
                "category_id": categories["Beverages"].id,
                "name": "Lychee Martini",
                "description": "Vodka, lychee liqueur, and fresh lychee juice.",
                "price": 960.00,
                "image_url": "https://images.unsplash.com/photo-1556881286-fc6915169721?w=500&q=80",
                "is_vegetarian": True,
                "display_order": 1,
                "spice_level": 0.0,
                "sweetness_level": 0.8,
                "creaminess_level": 0.0,
                "tanginess_level": 0.4,
                "smokiness_level": 0.0,
                "crunchiness_level": 0.0,
                "adventure_level": 0.5,
                "portion_size": 0.2,
                "popularity_score": 0.80
            },
            {
                "category_id": categories["Beverages"].id,
                "name": "Sencha Green Tea",
                "description": "Hot, premium Japanese green tea.",
                "price": 320.00,
                "image_url": "https://images.unsplash.com/photo-1627492275576-1f140026e643?w=500&q=80",
                "is_vegetarian": True,
                "display_order": 2,
                "spice_level": 0.0,
                "sweetness_level": 0.1,
                "creaminess_level": 0.0,
                "tanginess_level": 0.1,
                "smokiness_level": 0.2,
                "crunchiness_level": 0.0,
                "adventure_level": 0.1,
                "portion_size": 0.3,
                "popularity_score": 0.60
            }
        ]

        inserted_dishes = []
        for d_data in dishes_data:
            dish = Dish(restaurant_id=restaurant.id, **d_data)
            db.add(dish)
            inserted_dishes.append(dish)
        db.commit()

        # 4. Community Users and Signals
        for i in range(15):
            user = User(name=f"Community User {i+1}", email=f"user{i+1}@taste.ai")
            db.add(user)
            db.commit()
            db.refresh(user)

            profile = TasteProfile(
                user_id=user.id,
                spice_preference=random.uniform(0.1, 0.9),
                sweetness_preference=random.uniform(0.1, 0.9),
                creaminess_preference=random.uniform(0.1, 0.9),
                tanginess_preference=random.uniform(0.1, 0.9),
                smokiness_preference=random.uniform(0.1, 0.9),
                crunch_preference=random.uniform(0.1, 0.9),
                adventure_level=random.uniform(0.1, 0.9),
                portion_preference=random.uniform(0.1, 0.9),
                confidence_score=random.uniform(0.7, 0.9)
            )
            db.add(profile)
            
            user_dishes = random.sample(inserted_dishes, random.randint(3, 5))
            for d in user_dishes:
                signal = CommunitySignal(
                    user_id=user.id,
                    dish_id=d.id,
                    ordered=True,
                    finished=True,
                    liked=True,
                    rating=random.randint(4, 5),
                    would_reorder=random.choice([True, False])
                )
                db.add(signal)
        
        db.commit()
        logger.info("Seeding complete for Stage 3!")

    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed()
