from typing import Dict, List, Tuple
from app.schemas.taste_profile import QuizSubmission, TasteProfileCreate

# Initial baseline
BASELINE = 0.5

# Delta mapping for quiz answers
# question_id -> { option_id -> [(dimension, delta)] }
QUIZ_MAPPING: Dict[str, Dict[str, List[Tuple[str, float]]]] = {
    "q_spice": {
        "opt_too_mild": [("spice_preference", -0.4)],
        "opt_just_right": [("spice_preference", 0.0)],
        "opt_too_spicy": [("spice_preference", 0.4)]
    },
    "q_sweetness": {
        "opt_never": [("sweetness_preference", -0.4)],
        "opt_sometimes": [("sweetness_preference", 0.0)],
        "opt_always": [("sweetness_preference", 0.4)]
    },
    "q_creaminess": {
        "opt_no_cream": [("creaminess_preference", -0.4)],
        "opt_some_cream": [("creaminess_preference", 0.0)],
        "opt_very_creamy": [("creaminess_preference", 0.4)]
    },
    "q_tanginess": {
        "opt_no_tang": [("tanginess_preference", -0.4)],
        "opt_some_tang": [("tanginess_preference", 0.0)],
        "opt_very_tangy": [("tanginess_preference", 0.4)]
    },
    "q_masala": {
        "opt_light_masala": [("masala_intensity_preference", -0.4)],
        "opt_med_masala": [("masala_intensity_preference", 0.0)],
        "opt_heavy_masala": [("masala_intensity_preference", 0.4)]
    },
    "q_crunch": {
        "opt_not_really": [("crunch_preference", -0.4)],
        "opt_okay": [("crunch_preference", 0.0)],
        "opt_must_have": [("crunch_preference", 0.4)]
    },
    "q_oiliness": {
        "opt_low_oil": [("oiliness_preference", -0.4)],
        "opt_med_oil": [("oiliness_preference", 0.0)],
        "opt_high_oil": [("oiliness_preference", 0.4)]
    },
    "q_saltiness": {
        "opt_low_salt": [("saltiness_preference", -0.4)],
        "opt_med_salt": [("saltiness_preference", 0.0)],
        "opt_high_salt": [("saltiness_preference", 0.4)]
    }
}

class TasteIdentityService:
    @staticmethod
    def generate_profile(submission: QuizSubmission) -> TasteProfileCreate:
        # Start at baseline
        profile = {
            "spice_preference": BASELINE,
            "sweetness_preference": BASELINE,
            "creaminess_preference": BASELINE,
            "tanginess_preference": BASELINE,
            "masala_intensity_preference": BASELINE,
            "crunch_preference": BASELINE,
            "oiliness_preference": BASELINE,
            "saltiness_preference": BASELINE,
        }
        
        # Apply deltas based on answers
        answered_questions = 0
        for answer in submission.answers:
            question = QUIZ_MAPPING.get(answer.question_id)
            if question:
                deltas = question.get(answer.selected_option_id, [])
                for dimension, delta in deltas:
                    if dimension in profile:
                        profile[dimension] += delta
                answered_questions += 1
                
        # Clamp between 0.0 and 1.0
        for dim in profile:
            profile[dim] = max(0.0, min(1.0, profile[dim]))
            
        return TasteProfileCreate(
            user_id=submission.user_id,
            **profile
        )
