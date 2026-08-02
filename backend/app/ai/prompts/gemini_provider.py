import os
from typing import List, Dict, Any, Optional
from openai import OpenAI
from app.ai.prompts.base_provider import LLMProvider
from app.config.config import settings
import logging

logger = logging.getLogger(__name__)

class GeminiProvider(LLMProvider):
    def __init__(self):
        api_key = getattr(settings, "GEMINI_API_KEY", os.getenv("GEMINI_API_KEY"))
        if not api_key:
            logger.warning("GEMINI_API_KEY not found. LLM calls will fail.")
            
        self.client = OpenAI(
            base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
            api_key=api_key or "DUMMY_KEY_FOR_TESTS"
        )
        self.model_name = "gemini-2.5-flash"

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
            raise
