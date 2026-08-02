from typing import List, Dict, Any

def get_tool_definitions() -> List[Dict[str, Any]]:
    """
    Returns the JSON schemas for the tools available to the LLM.
    These use the standard OpenAI function calling format.
    """
    return [
        {
            "type": "function",
            "function": {
                "name": "highlightDish",
                "description": "Highlights a specific dish in the UI, drawing the user's attention to it.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "dish_id": {
                            "type": "string",
                            "description": "The ID of the dish to highlight."
                        }
                    },
                    "required": ["dish_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "openDish",
                "description": "Navigates the user to the detailed view of a specific dish.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "dish_id": {
                            "type": "string",
                            "description": "The ID of the dish to open."
                        }
                    },
                    "required": ["dish_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "compareDishes",
                "description": "Triggers a side-by-side visual comparison of two dishes in the UI.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "dish1_id": {
                            "type": "string",
                            "description": "The ID of the first dish."
                        },
                        "dish2_id": {
                            "type": "string",
                            "description": "The ID of the second dish."
                        }
                    },
                    "required": ["dish1_id", "dish2_id"]
                }
            }
        },
        {
            "type": "function",
            "function": {
                "name": "addToCart",
                "description": "Adds a specific dish to the user's cart.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "dish_id": {
                            "type": "string",
                            "description": "The ID of the dish to add."
                        },
                        "quantity": {
                            "type": "integer",
                            "description": "The quantity to add.",
                            "default": 1
                        }
                    },
                    "required": ["dish_id"]
                }
            }
        }
    ]
