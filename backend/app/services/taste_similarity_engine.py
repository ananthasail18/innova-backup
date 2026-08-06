from abc import ABC, abstractmethod
from typing import Dict, Any
import math

class TasteSimilarityEngine(ABC):
    @abstractmethod
    def calculate_similarity(self, profile1: Dict[str, float], profile2: Dict[str, float]) -> float:
        """
        Calculates similarity between two taste profiles.
        Returns a float between 0.0 and 1.0.
        """
        pass

class CosineSimilarityEngine(TasteSimilarityEngine):
    def calculate_similarity(self, profile1: Dict[str, float], profile2: Dict[str, float]) -> float:
        """
        Calculates cosine similarity between two taste profile dictionaries.
        Assumes keys match. Missing keys are treated as 0.0.
        """
        all_keys = set(profile1.keys()).union(set(profile2.keys()))
        
        dot_product = 0.0
        norm1 = 0.0
        norm2 = 0.0
        
        for key in all_keys:
            val1 = profile1.get(key, 0.0)
            val2 = profile2.get(key, 0.0)
            
            dot_product += val1 * val2
            norm1 += val1 * val1
            norm2 += val2 * val2
            
        if norm1 == 0.0 or norm2 == 0.0:
            return 0.0
            
        return dot_product / (math.sqrt(norm1) * math.sqrt(norm2))
