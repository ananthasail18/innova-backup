import pytest
from app.database.session import SessionLocal
from app.services.taste_dna_learning import TasteDNALearningService
from app.schemas.taste_profile import QuizSubmission, QuizAnswer

def test_taste_dna_initialization():
    db = SessionLocal()
    try:
        service = TasteDNALearningService(db)
        sub = QuizSubmission(
            user_id="test_user_dna_1",
            answers=[
                QuizAnswer(question_id="q_paneer_butter", selected_option_id="opt_just_right"),
                QuizAnswer(question_id="q_desserts", selected_option_id="opt_always"),
                QuizAnswer(question_id="q_gobi_manchurian", selected_option_id="opt_spicy"),
            ]
        )
        profile = service.initialize_from_quiz(sub)
        
        assert profile.user_id == "test_user_dna_1"
        assert profile.confidence_score >= 0.50
        assert profile.dna_matrix_json is not None
        
        matrix = profile.dna_matrix_json
        assert "spice" in matrix
        assert matrix["spice"]["confidence"] >= 0.50
        assert len(matrix["recent_evolution"]) > 0
    finally:
        db.close()

def test_gradual_learning_incremental_update():
    db = SessionLocal()
    try:
        service = TasteDNALearningService(db)
        user_id = "test_user_dna_2"
        
        # Initialize
        sub = QuizSubmission(user_id=user_id, answers=[])
        profile = service.initialize_from_quiz(sub)
        initial_oil = profile.oiliness_preference
        initial_conf = profile.confidence_score
        
        # Record feedback "Too oily" (oiliness delta: -0.10)
        updated = service.record_feedback_event(
            user_id=user_id,
            event_type="POST_MEAL_FEEDBACK",
            dimension_deltas={"oiliness": -0.10},
            event_description="Order Feedback — Dish was too oily"
        )
        
        # Must change gradually (lerp), NEVER a massive jump
        new_oil = updated.oiliness_preference
        assert new_oil < initial_oil
        assert abs(new_oil - initial_oil) < 0.08  # smooth change
        
        # Confidence must increase
        assert updated.confidence_score >= initial_conf
        
        # Verify evolution timeline logged
        matrix = updated.dna_matrix_json
        assert matrix["recent_evolution"][0]["event"] == "Order Feedback — Dish was too oily"
    finally:
        db.close()
