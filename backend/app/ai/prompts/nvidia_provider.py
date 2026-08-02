import os
from typing import List, Dict, Any, Optional
from openai import OpenAI
from app.ai.prompts.base_provider import LLMProvider
from app.config.config import settings
import logging

logger = logging.getLogger(__name__)

class NvidiaProvider(LLMProvider):
    def __init__(self):
        api_key = getattr(settings, "NVIDIA_API_KEY", os.getenv("NVIDIA_API_KEY"))
        if not api_key:
            logger.warning("NVIDIA_API_KEY not found.")
            
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key or "DUMMY_KEY"
        )
        self.model_name = "meta/llama-3.1-70b-instruct"

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
            return {
                "content": choice.content,
                "tool_calls": choice.tool_calls or []
            }
        except Exception as e:
            logger.error(f"NvidiaProvider error: {e}")
            raise
