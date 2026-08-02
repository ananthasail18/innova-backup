from app.ai.prompts.tools import ToolExecutor
from app.schemas.chat import ToolCallSchema

def test_tool_executor_highlight():
    executor = ToolExecutor()
    tool_calls = [
        ToolCallSchema(id="1", name="highlightDish", arguments={"dish_id": "123"})
    ]
    actions = executor.execute(tool_calls)
    
    assert len(actions) == 1
    assert actions[0]["action"] == "HIGHLIGHT_DISH"
    assert actions[0]["payload"]["dish_id"] == "123"

def test_tool_executor_add_to_cart():
    executor = ToolExecutor()
    tool_calls = [
        ToolCallSchema(id="2", name="addToCart", arguments={"dish_id": "456", "quantity": 2})
    ]
    actions = executor.execute(tool_calls)
    
    assert len(actions) == 1
    assert actions[0]["action"] == "ADD_TO_CART"
    assert actions[0]["payload"]["dish_id"] == "456"
    assert actions[0]["payload"]["quantity"] == 2
