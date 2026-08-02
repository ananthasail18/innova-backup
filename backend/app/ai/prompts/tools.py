import json
from typing import List, Dict, Any
from app.schemas.chat import ToolCallSchema

def get_tool_definitions() -> List[Dict[str, Any]]:
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

class ToolExecutor:
    def execute(self, tool_calls: List[ToolCallSchema]) -> List[Dict[str, Any]]:
        ui_actions = []
        for tc in tool_calls:
            name = tc.name
            args = tc.arguments
            if isinstance(args, str):
                try:
                    args = json.loads(args)
                except:
                    args = {}
                    
            if name == "highlightDish":
                ui_actions.append({
                    "action": "HIGHLIGHT_DISH",
                    "payload": {"dish_id": args.get("dish_id")}
                })
            elif name == "openDish":
                ui_actions.append({
                    "action": "NAVIGATE",
                    "payload": {"path": f"/dish/{args.get('dish_id')}"}
                })
            elif name == "compareDishes":
                ui_actions.append({
                    "action": "COMPARE_DISHES",
                    "payload": {
                        "dish1_id": args.get("dish1_id"),
                        "dish2_id": args.get("dish2_id")
                    }
                })
            elif name == "addToCart":
                ui_actions.append({
                    "action": "ADD_TO_CART",
                    "payload": {
                        "dish_id": args.get("dish_id"),
                        "quantity": args.get("quantity", 1)
                    }
                })
        return ui_actions
