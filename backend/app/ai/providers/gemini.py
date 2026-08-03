import os
from typing import List, Dict, Any, Optional
from openai import OpenAI
from app.ai.providers.base import LLMProvider
from app.config.config import settings
import logging

logger = logging.getLogger(__name__)

class GeminiProvider(LLMProvider):
    def __init__(self):
        # We assume settings.GEMINI_API_KEY is available or os.environ has it
        api_key = getattr(settings, "GEMINI_API_KEY", os.getenv("GEMINI_API_KEY"))
        if not api_key:
            logger.warning("GEMINI_API_KEY not found. LLM calls will fail.")
            
        if api_key and api_key.startswith("gsk_"):
            base_url = "https://api.groq.com/openai/v1"
            model_name = "llama-3.3-70b-versatile"
        else:
            base_url = "https://generativelanguage.googleapis.com/v1beta/openai/"
            model_name = "gemini-2.5-flash"

        self.api_key = api_key
        self.client = OpenAI(
            base_url=base_url,
            api_key=api_key or "DUMMY_KEY_FOR_TESTS"
        )
        self.model_name = model_name

    def generate_completion(
        self,
        messages: List[Dict[str, Any]],
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.7,
        max_tokens: int = 1000
    ) -> Dict[str, Any]:
        
        params = {
            "model": self.model_name,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
        }
        if tools:
            params["tools"] = tools

        try:
            response = self.client.chat.completions.create(**params)
            choice = response.choices[0].message
            
            result = {
                "content": choice.content,
                "tool_calls": []
            }
            
            if choice.tool_calls:
                for tc in choice.tool_calls:
                    result["tool_calls"].append({
                        "id": tc.id,
                        "function": {
                            "name": tc.function.name,
                            "arguments": tc.function.arguments
                        }
                    })
                    
            return result
            
        except Exception as e:
            logger.error(f"GeminiProvider error: {e}")
            # Return a friendly instruction message if the API key is missing or invalid
            error_str = str(e)
            if "API key" in error_str or "INVALID_ARGUMENT" in error_str or not self.api_key or self.api_key == "DUMMY_KEY_FOR_TESTS":
                return {
                    "content": "👋 Hi! To enable the AI Dining Assistant, please create a `.env` file inside the `backend/` folder and add: `GEMINI_API_KEY=your_actual_api_key`. Once set, restart the backend server and I'll be ready to help!",
                    "tool_calls": []
                }
            raise

