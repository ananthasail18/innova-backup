import json
from typing import Dict, Any, List
from app.schemas.chat import ToolCallSchema

class ToolExecutor:
    def execute(self, tool_calls: List[ToolCallSchema]) -> List[Dict[str, Any]]:
        """
        Takes the requested tool calls from the LLM, validates them,
        and translates them into UI Actions for the frontend to execute.
        Since these are primarily UI manipulations, the backend acts as a router/validator.
        """
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
            else:
                # Unknown tool
                pass
                
        return ui_actions

