from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.chat import ChatMessageRequest, ChatResponse, ToolCallSchema
from app.ai.prompts.gemini_provider import GeminiProvider
from app.ai.prompts.context_builder import ContextBuilder
from app.ai.prompts.prompt_builder import PromptBuilder
from app.ai.prompts.tools import get_tool_definitions, ToolExecutor
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/chat", response_model=dict)
def process_chat(request: ChatMessageRequest, db: Session = Depends(get_db)):
    try:
        # 1. Build Context
        context_builder = ContextBuilder(db)
        context = context_builder.build_context(
            user_id=request.user_id,
            restaurant_id=request.restaurant_id,
            page_context=request.page_context,
            selected_dish_id=request.selected_dish_id
        )
        
        # 2. Build Prompt
        prompt_builder = PromptBuilder()
        system_prompt = prompt_builder.build_system_prompt(context)
        
        # 3. Assemble Messages
        messages = [{"role": "system", "content": system_prompt}]
        for msg in request.conversation_history:
            messages.append(msg)
            
        messages.append({"role": "user", "content": request.message})
        
        # 4. Call LLM
        provider = GeminiProvider()
        tools = get_tool_definitions()
        
        llm_response = provider.generate_completion(messages=messages, tools=tools)
        
        # 5. Process Tools
        tool_calls = []
        updated_ui_actions = []
        
        if llm_response.get("tool_calls"):
            for tc in llm_response["tool_calls"]:
                tool_calls.append(ToolCallSchema(
                    id=tc["id"],
                    name=tc["function"]["name"],
                    arguments=tc["function"]["arguments"]
                ))
                
            executor = ToolExecutor()
            updated_ui_actions = executor.execute(tool_calls)
            
        # 6. Format Response
        response_data = ChatResponse(
            message=llm_response.get("content"),
            tool_calls=tool_calls,
            updated_ui_actions=updated_ui_actions
        )
        
        return {"status": "success", "data": response_data.model_dump()}

    except Exception as e:
        logger.error(f"Error processing chat: {e}", exc_info=True)
        return {
            "status": "error", 
            "data": ChatResponse(
                message="I'm unable to answer that right now.",
                tool_calls=[],
                updated_ui_actions=[]
            ).model_dump()
        }
