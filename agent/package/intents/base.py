import numpy as np
import logging
from package.llms.base import ModelResponse
import time
from sklearn.metrics.pairwise import cosine_similarity
from typing import Any

class Intent:
    def __init__(self, agent_name, examples):
        self.agent_name = agent_name
        self.examples = examples['intent']
        self.model:Any = None
        self.logger = logging.getLogger(self.agent_name)

    # def _run(self, examples:list[str], content:str)->Any:
    #     response = cosine_similarity(
    #         self.model.run([content]),
    #         self.model.run(examples)
    #     )
    #     idx = np.argmax(response[0])
    #     logic = any(response[0]>0.6)
    #     score = response[0][idx]
    #     score = round(float(score),2)
    #     return dict(logic=logic, score=score)
    #     # return logic
    def _run(self, examples: list[str], content: str) -> dict:
        user_embedding = self.model.run([content])
        example_embeddings = self.model.run(examples)
        
        similarities = cosine_similarity(user_embedding, example_embeddings)[0]
        
        max_idx = np.argmax(similarities)
        max_score = float(similarities[max_idx])
        
        # Dynamic threshold based on score distribution
        mean_score = float(np.mean(similarities))
        std_score = float(np.std(similarities))
        
        # More robust logic
        is_match = (max_score > 0.6) and (max_score > mean_score + std_score)
        
        return {
            "logic": bool(is_match),
            "score": round(max_score, 3),
            "confidence": round(max_score - mean_score, 3),
            "best_example": examples[max_idx]
        }


    def run(self, content):
        """
        - return ModelResponse
        """
        start_time = time.time()
        response = self._run(self.examples, content)
        response_time_ms = int((time.time() - start_time) * 1000)
        return ModelResponse(
            model_id="",
            role="assistant",
            content=response,
            response_time_ms=response_time_ms,
        )