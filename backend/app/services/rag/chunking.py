import re
from typing import List, Dict

class ChunkingService:
    """
    Splits text into semantic chunks while respecting sentence boundaries.
    Targets chunks around 250-400 words with a 50-word overlap.
    """
    def __init__(self, target_words: int = 300, overlap_words: int = 50):
        self.target_words = target_words
        self.overlap_words = overlap_words

    def chunk_document(self, content: str) -> List[str]:
        # Simple sentence tokenizer using regex
        sentences = re.split(r'(?<=[.!?])\s+', content)
        chunks = []
        current_chunk_sentences = []
        current_word_count = 0
        
        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue
                
            words = sentence.split()
            word_count = len(words)
            
            # If a single sentence is huge, just add it directly (rare edge case)
            if word_count > self.target_words and current_word_count == 0:
                chunks.append(sentence)
                continue
                
            if current_word_count + word_count > self.target_words:
                chunks.append(" ".join(current_chunk_sentences))
                
                # Keep the last few sentences for overlap
                overlap_sentences = []
                overlap_count = 0
                for s in reversed(current_chunk_sentences):
                    s_words = len(s.split())
                    if overlap_count + s_words > self.overlap_words:
                        break
                    overlap_sentences.insert(0, s)
                    overlap_count += s_words
                    
                current_chunk_sentences = overlap_sentences
                current_word_count = overlap_count
                
            current_chunk_sentences.append(sentence)
            current_word_count += word_count
            
        if current_chunk_sentences:
            chunks.append(" ".join(current_chunk_sentences))
            
        return chunks
