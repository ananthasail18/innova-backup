# TasteAI: AI System Design

## 1. Overview
The AI layer of TasteAI is not responsible for the core recommendation ranking (which is handled deterministically via cosine similarity). Instead, the LLM (Llama 3.1 70B via NVIDIA NIM) acts as an interface: generating human-readable explanations for recommendations and answering user queries about the menu.

## 2. Layered Prompt Construction
To ensure zero hallucination and high relevance, every prompt sent to the LLM is constructed dynamically by the backend using a layered approach.

### Layer 1: System Rules (Behavior Rules)
- **Role**: You are TasteAI, an expert culinary assistant at [Restaurant Name].
- **Constraints**:
  - NEVER invent dishes, ingredients, or allergens.
  - ONLY recommend items present in the provided JSON menu.
  - If you do not know the answer based on the provided context, state clearly that you do not know.
  - Do not take orders; direct the user to use the UI cart.
  - Keep responses concise (under 3 sentences unless asked for detail).

### Layer 2: Restaurant Context
Injected JSON representation of the menu and restaurant metadata.
```json
{
  "restaurant_name": "Spice Symphony",
  "available_menu": [
    {"name": "Spicy Tuna", "ingredients": ["tuna", "chili", "rice"], "dietary": ["pescatarian"]}
  ]
}
```

### Layer 3: Taste Identity Context
The user's parsed profile, translated into natural language for the LLM.
- *Example*: "The current user has a high preference for spicy and umami flavors, and a low tolerance for sweet savory dishes. They are allergic to peanuts."

### Layer 4: Session Context
What the user is currently doing in the UI.
- *Example*: "The user is currently viewing the 'Spicy Tuna' dish detail page. They have 1 'Edamame' in their cart."

### Layer 5: Community Context (Optional)
- *Example*: "Users with similar taste profiles highly rated the 'Dragon Roll'."

## 3. Tool Calling
For the MVP, tool calling (function calling) is **NOT** used by the LLM to execute actions (like adding to cart). The LLM is strictly read-only and conversational. Future iterations may allow the LLM to emit a structured JSON response to trigger UI actions (e.g., `{"action": "add_to_cart", "item_id": "123"}`).

## 4. Prompt Templates
The backend uses Jinja2 or standard Python string formatting for templates.

**Explanation Generation Prompt:**
```text
System: [System Rules]
Context: [Taste Identity Context]
Task: Generate a 1-sentence explanation of why the user will like the dish '{dish_name}'. Focus on these overlapping flavor traits: {overlapping_traits}.
```

## 5. Memory Strategy
- **Short-term Memory**: The last N (e.g., 5) conversational turns are stored in the frontend state or Redis cache and passed with every chat request.
- **Long-term Memory**: Managed entirely by the deterministic Taste Vector. The LLM does not need to "remember" the user across sessions; it simply reads the latest Taste Vector provided in Layer 3.

## 6. Hallucination Prevention
- **Grounding**: Strict RAG (Retrieval-Augmented Generation). The LLM is instructed to ONLY use the provided `Restaurant Context`.
- **Temperature Setting**: Kept extremely low (e.g., `0.1` or `0.2`) to prioritize deterministic, factual responses over creative storytelling.

## 7. Recommendation Explanation
When the deterministic engine scores a dish highly, it passes the top matching traits to the LLM.
- *Input*: User vector `{spicy: 0.9, umami: 0.8}` matched Dish vector `{spicy: 1.0, umami: 0.7}`. Overlapping traits: `spicy, umami`.
- *LLM Output*: "This dish is a perfect match for your love of intense spice and rich umami flavors."
