from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.session import get_db
from app.services.recommendation import RecommendationService, cosine_similarity
from app.models.taste_profile import TasteProfile
from app.models.community_signal import CommunitySignal

router = APIRouter()

class LikeDishRequest(BaseModel):
    user_id: str
    dish_id: str
    liked: bool
    would_reorder: bool = False

@router.post("/community/like", response_model=dict)
def like_dish(request: LikeDishRequest, db: Session = Depends(get_db)):
    from app.models.dish import Dish
    from app.models.taste_profile import TasteProfile
    from app.services.taste_dna_learning import TasteDNALearningService

    # Upsert community signal
    existing = db.query(CommunitySignal).filter(
        CommunitySignal.user_id == request.user_id,
        CommunitySignal.dish_id == request.dish_id
    ).first()

    if existing:
        existing.liked = request.liked
        existing.would_reorder = request.would_reorder
    else:
        signal = CommunitySignal(
            user_id=request.user_id,
            dish_id=request.dish_id,
            liked=request.liked,
            would_reorder=request.would_reorder
        )
        db.add(signal)

    db.commit()

    # If liked, nudge Taste DNA toward this dish's flavor profile
    if request.liked:
        dish = db.query(Dish).filter(Dish.id == request.dish_id).first()
        user_profile = db.query(TasteProfile).filter(TasteProfile.user_id == request.user_id).first()

        if dish and user_profile:
            # Compute deltas: dish dimension - user preference (positive = nudge toward dish)
            DISH_TO_PREF = {
                "spice":            ("spice_level",            "spice_preference"),
                "sweetness":        ("sweetness_level",        "sweetness_preference"),
                "creaminess":       ("creaminess_level",       "creaminess_preference"),
                "tanginess":        ("tanginess_level",        "tanginess_preference"),
                "masala_intensity": ("masala_intensity_level", "masala_intensity_preference"),
                "crunchiness":      ("crunchiness_level",      "crunch_preference"),
                "oiliness":         ("oiliness_level",         "oiliness_preference"),
                "saltiness":        ("saltiness_level",        "saltiness_preference"),
            }

            deltas = {}
            for dim_key, (dish_col, pref_col) in DISH_TO_PREF.items():
                dish_val = float(getattr(dish, dish_col) or 0.5)
                user_val = float(getattr(user_profile, pref_col) or 0.5)
                diff = dish_val - user_val
                # Only nudge if there's a meaningful difference (>0.05)
                if abs(diff) > 0.05:
                    # Scale: nudge 30% of the gap toward the dish
                    deltas[dim_key] = round(diff * 0.30, 3)

            if deltas:
                learning_service = TasteDNALearningService(db)
                learning_service.record_feedback_event(
                    user_id=request.user_id,
                    event_type="POST_MEAL_FEEDBACK",
                    dimension_deltas=deltas,
                    event_description=f"Liked {dish.name}"
                )

    return {"status": "success", "data": {"message": "Signal recorded"}}


@router.get("/community/similar-users/{user_id}", response_model=dict)
def get_similar_users(user_id: str, limit: int = 5, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    user_profile = db.query(TasteProfile).filter(TasteProfile.user_id == user_id).first()
    if not user_profile:
        return {"status": "success", "data": []}
        
    user_vector = service._get_taste_vector(user_profile)
    
    other_profiles = db.query(TasteProfile).filter(TasteProfile.user_id != user_id).all()
    
    similar_users = []
    for p in other_profiles:
        other_vec = service._get_taste_vector(p)
        sim = cosine_similarity(user_vector, other_vec)
        if sim > 0.70:
            similar_users.append({
                "user_id": p.user_id,
                "similarity": sim
            })
            
    similar_users.sort(key=lambda x: x["similarity"], reverse=True)
    
    return {"status": "success", "data": similar_users[:limit]}

@router.get("/community/recommendations/{user_id}", response_model=dict)
def get_community_recommendations(user_id: str, db: Session = Depends(get_db)):
    service = RecommendationService(db)
    response = service.get_recommendations(user_id)
    community_recs = [
        rec for rec in response.recommendations 
        if any(r.type == "community" for r in rec.reasons)
    ]
    response.recommendations = community_recs
@router.get("/community/explore/{user_id}", response_model=dict)
def get_community_explore(user_id: str, restaurant_id: str = None, db: Session = Depends(get_db)):
    """Returns dishes liked by users with similar taste profiles, with counts."""
    service = RecommendationService(db)
    user_profile = db.query(TasteProfile).filter(TasteProfile.user_id == user_id).first()
    if not user_profile:
        return {"status": "success", "data": []}

    user_vector = service._get_taste_vector(user_profile)

    # Find similar users
    other_profiles = db.query(TasteProfile).filter(TasteProfile.user_id != user_id).all()
    similar_user_ids = []
    similarity_map = {}
    for p in other_profiles:
        sim = cosine_similarity(user_vector, service._get_taste_vector(p))
        if sim > 0.70:
            similar_user_ids.append(p.user_id)
            similarity_map[p.user_id] = sim

    if not similar_user_ids:
        return {"status": "success", "data": []}

    # Get their liked signals
    signals = db.query(CommunitySignal).filter(
        CommunitySignal.user_id.in_(similar_user_ids),
        CommunitySignal.liked == True
    ).all()

    # Aggregate: dish_id -> {count, similarity_sum, user_ids}
    from collections import defaultdict
    from app.models.dish import Dish
    from app.schemas.dish import DishOut

    dish_stats = defaultdict(lambda: {"count": 0, "sim_sum": 0.0, "liker_ids": []})
    for signal in signals:
        dish_stats[signal.dish_id]["count"] += 1
        dish_stats[signal.dish_id]["sim_sum"] += similarity_map.get(signal.user_id, 0)
        dish_stats[signal.dish_id]["liker_ids"].append(signal.user_id)

    if not dish_stats:
        return {"status": "success", "data": []}

    # Fetch dish objects
    dish_ids = list(dish_stats.keys())
    query = db.query(Dish).filter(Dish.id.in_(dish_ids), Dish.is_available == True)
    if restaurant_id:
        query = query.filter(Dish.restaurant_id == restaurant_id)
    dishes = query.all()

    results = []
    for dish in dishes:
        stats = dish_stats[dish.id]
        avg_sim = stats["sim_sum"] / stats["count"] if stats["count"] > 0 else 0
        results.append({
            "dish": DishOut.model_validate(dish).model_dump(),
            "liked_by_count": stats["count"],
            "avg_similarity": round(avg_sim * 100),
        })

    # Sort by liked_by_count descending
    results.sort(key=lambda x: x["liked_by_count"], reverse=True)
    return {"status": "success", "data": results}

