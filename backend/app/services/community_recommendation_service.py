from sqlalchemy.orm import Session
from typing import List, Dict, Any, Tuple
from collections import defaultdict
from app.models.user_dish_interaction import UserDishInteraction
from app.models.taste_profile import TasteProfile
from app.models.dish import Dish
from app.services.taste_similarity_engine import TasteSimilarityEngine
from app.schemas.community_recommendations import (
    CommunityRecommendationResponse,
    CommunityDishRecommendation,
    CommunityExplanation
)
from app.schemas.dish import DishOut

class CommunityRecommendationService:
    def __init__(self, db: Session, similarity_engine: TasteSimilarityEngine):
        self.db = db
        self.similarity_engine = similarity_engine

    def _extract_taste_dict(self, profile: TasteProfile) -> Dict[str, float]:
        """Helper to extract taste preferences into a flat dictionary."""
        return {
            "spice": float(profile.spice_preference or 0.5),
            "sweetness": float(profile.sweetness_preference or 0.5),
            "creaminess": float(profile.creaminess_preference or 0.5),
            "tanginess": float(profile.tanginess_preference or 0.5),
            "masala_intensity": float(profile.masala_intensity_preference or 0.5),
            "crunchiness": float(profile.crunch_preference or 0.5),
            "oiliness": float(profile.oiliness_preference or 0.5),
            "saltiness": float(profile.saltiness_preference or 0.5),
        }

    def get_community_recommendations(self, restaurant_id: str, user_id: str) -> CommunityRecommendationResponse:
        # 1. Get the requesting user's taste profile
        user_profile = self.db.query(TasteProfile).filter(TasteProfile.user_id == user_id).first()
        if not user_profile:
            return CommunityRecommendationResponse(community_size=0, average_community_similarity=0.0, recommendations=[])
            
        user_taste_dict = self._extract_taste_dict(user_profile)

        # 2. Get all interactions for this restaurant by other users
        interactions = self.db.query(UserDishInteraction).filter(
            UserDishInteraction.restaurant_id == restaurant_id,
            UserDishInteraction.user_id != user_id
        ).all()

        if not interactions:
            return CommunityRecommendationResponse(community_size=0, average_community_similarity=0.0, recommendations=[])

        # 3. Filter interactions by similarity threshold (> 0.80)
        # To avoid redundant calculations, map user_id -> similarity
        user_similarities = {}
        for interaction in interactions:
            other_user_id = interaction.user_id
            if other_user_id not in user_similarities:
                # Use the taste snapshot from the interaction if available, otherwise fallback
                # In a real scenario, we use the snapshot to reflect their taste AT THE TIME they liked it
                snapshot = interaction.taste_snapshot
                if not snapshot:
                    # Fallback to current profile if snapshot missing for some reason
                    other_profile = self.db.query(TasteProfile).filter(TasteProfile.user_id == other_user_id).first()
                    if other_profile:
                        snapshot = self._extract_taste_dict(other_profile)
                    else:
                        snapshot = {}

                sim = self.similarity_engine.calculate_similarity(user_taste_dict, snapshot)
                user_similarities[other_user_id] = sim

        # Filter interactions where similarity > 0.80
        similar_interactions = [
            i for i in interactions if user_similarities.get(i.user_id, 0.0) > 0.80
        ]

        if not similar_interactions:
            return CommunityRecommendationResponse(community_size=0, average_community_similarity=0.0, recommendations=[])

        # 4. Aggregate by dish
        dish_stats = defaultdict(lambda: {"count": 0, "total_similarity": 0.0})
        unique_similar_users = set()

        for interaction in similar_interactions:
            sim = user_similarities[interaction.user_id]
            unique_similar_users.add(interaction.user_id)
            dish_stats[interaction.dish_id]["count"] += 1
            dish_stats[interaction.dish_id]["total_similarity"] += sim

        # 5. Fetch dish objects and build recommendations
        dish_ids = list(dish_stats.keys())
        dishes = self.db.query(Dish).filter(Dish.id.in_(dish_ids), Dish.is_available == True).all()
        dish_map = {dish.id: dish for dish in dishes}

        recommendations = []
        for dish_id, stats in dish_stats.items():
            dish = dish_map.get(dish_id)
            if not dish:
                continue
                
            count = stats["count"]
            avg_sim = stats["total_similarity"] / count
            
            # Simple scoring mechanism: count weighted by average similarity
            community_score = count * avg_sim
            
            explanation = CommunityExplanation(
                chosen_by=count,
                average_similarity=round(avg_sim, 2),
                reason=f"Chosen by {count} users with a {int(avg_sim * 100)}% TasteDNA similarity."
            )
            
            recommendations.append(
                CommunityDishRecommendation(
                    dish=DishOut.model_validate(dish),
                    community_score=round(community_score, 2),
                    explanation=explanation
                )
            )

        # Sort recommendations by community score descending
        recommendations.sort(key=lambda x: x.community_score, reverse=True)

        overall_avg_sim = sum(user_similarities[uid] for uid in unique_similar_users) / len(unique_similar_users) if unique_similar_users else 0.0

        return CommunityRecommendationResponse(
            community_size=len(unique_similar_users),
            average_community_similarity=round(overall_avg_sim, 2),
            recommendations=recommendations
        )
