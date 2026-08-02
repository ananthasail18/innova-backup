from typing import Dict, List, Tuple
from app.schemas.taste_profile import QuizSubmission, TasteProfileCreate

# Initial baseline
BASELINE = 0.5

# Delta mapping for quiz answers
# question_id -> { option_id -> [(dimension, delta)] }
QUIZ_MAPPING: Dict[str, Dict[str, List[Tuple[str, float]]]] = {
    "q_paneer_butter": {
        "opt_too_spicy": [("spice_preference", -0.2), ("creaminess_preference", 0.1)],
        "opt_just_right": [("spice_preference", 0.1), ("creaminess_preference", 0.2)],
        "opt_too_mild": [("spice_preference", 0.3), ("creaminess_preference", -0.1)]
    },
    "q_desserts": {
        "opt_never": [("sweetness_preference", -0.3)],
        "opt_sometimes": [("sweetness_preference", 0.1)],
        "opt_always": [("sweetness_preference", 0.4)]
    },
    "q_gobi_manchurian": {
        "opt_mild": [("spice_preference", -0.2), ("crunch_preference", 0.1)],
        "opt_medium": [("spice_preference", 0.1), ("crunch_preference", 0.2)],
        "opt_spicy": [("spice_preference", 0.4), ("crunch_preference", 0.3)]
    },
    "q_adventure": {
        "opt_familiar": [("adventure_level", -0.3)],
        "opt_sometimes": [("adventure_level", 0.1)],
        "opt_love_new": [("adventure_level", 0.4)]
    },
    "q_sauce": {
        "opt_rich_cheesy": [("creaminess_preference", 0.4), ("tanginess_preference", -0.1)],
        "opt_zesty_tangy": [("tanginess_preference", 0.4), ("creaminess_preference", -0.1)],
        "opt_smoky_bbq": [("smokiness_preference", 0.4), ("tanginess_preference", 0.1)]
    },
    "q_crunch": {
        "opt_not_really": [("crunch_preference", -0.3)],
        "opt_okay": [("crunch_preference", 0.1)],
        "opt_must_have": [("crunch_preference", 0.4)]
    },
    "q_portion": {
        "opt_light": [("portion_preference", -0.3)],
        "opt_standard": [("portion_preference", 0.1)],
        "opt_feast": [("portion_preference", 0.4)]
    },
    "q_smoked": {
        "opt_pass": [("smokiness_preference", -0.3)],
        "opt_sounds_good": [("smokiness_preference", 0.1)],
        "opt_need_it": [("smokiness_preference", 0.4)]
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
            "smokiness_preference": BASELINE,
            "crunch_preference": BASELINE,
            "adventure_level": BASELINE,
            "portion_preference": BASELINE,
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
