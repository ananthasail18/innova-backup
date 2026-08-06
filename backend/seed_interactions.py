import asyncio
from app.database.session import SessionLocal
from app.models.user_dish_interaction import UserDishInteraction
from app.models.user import User
from app.models.dish import Dish
from app.models.restaurant import Restaurant
from app.models.taste_profile import TasteProfile
import random
import uuid

def seed():
    from app.database.session import engine
    from app.database.base import Base
    
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Get a restaurant
    restaurant = db.query(Restaurant).first()
    if not restaurant:
        print("No restaurant found")
        return
        
    # Get some users
    users = db.query(User).all()
    if not users:
        print("No users found")
        return
        
    # Get some dishes
    dishes = db.query(Dish).filter(Dish.restaurant_id == restaurant.id).all()
    if not dishes:
        print("No dishes found")
        return

    # Delete existing interactions to avoid dupes on re-run
    db.query(UserDishInteraction).delete()
    db.commit()

    count = 0
    for user in users:
        profile = db.query(TasteProfile).filter(TasteProfile.user_id == user.id).first()
        if not profile:
            continue
            
        taste_dict = {
            "spice": float(profile.spice_preference or 0.5),
            "sweetness": float(profile.sweetness_preference or 0.5),
            "creaminess": float(profile.creaminess_preference or 0.5),
            "tanginess": float(profile.tanginess_preference or 0.5),
            "masala_intensity": float(profile.masala_intensity_preference or 0.5),
            "crunchiness": float(profile.crunch_preference or 0.5),
            "oiliness": float(profile.oiliness_preference or 0.5),
            "saltiness": float(profile.saltiness_preference or 0.5),
        }
        
        # Give each user 1-3 random dish interactions
        num_dishes = random.randint(1, min(3, len(dishes)))
        chosen_dishes = random.sample(dishes, num_dishes)
        
        for dish in chosen_dishes:
            interaction = UserDishInteraction(
                user_id=user.id,
                dish_id=dish.id,
                restaurant_id=restaurant.id,
                interaction_type="like",
                taste_snapshot=taste_dict
            )
            db.add(interaction)
            count += 1
            
    db.commit()
    print(f"Seeded {count} user dish interactions")
    
if __name__ == "__main__":
    seed()
