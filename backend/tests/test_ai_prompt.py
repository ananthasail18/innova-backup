from app.ai.prompts.prompt_builder import PromptBuilder

def test_prompt_builder():
    builder = PromptBuilder()
    context = {
        "restaurant_name": "Spice Symphony",
        "menu_text": "--- Starters ---\n- Edamame ($5)",
        "recommendations_text": "1. Edamame (Match: 95%)",
        "profile_text": "Spice: 0.8",
        "page_context": "menu",
        "selected_dish_info": ""
    }
    
    prompt = builder.build_system_prompt(context)
    
    assert "Spice Symphony" in prompt
    assert "--- Starters ---" in prompt
    assert "1. Edamame (Match: 95%)" in prompt
    assert "Spice: 0.8" in prompt
    assert "NEVER calculate recommendations yourself" in prompt
