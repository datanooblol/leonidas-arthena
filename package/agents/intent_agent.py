"""
Intent classification module using sentence transformers and cosine similarity.

This module provides utilities for multi-intent classification based on semantic
similarity using pre-trained sentence transformer models.
"""

import numpy as np
from collections import defaultdict
from sentence_transformers import SentenceTransformer

# Global model instance
model = SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')


def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    """
    Calculate cosine similarity between two vectors.
    
    Args:
        a: First vector
        b: Second vector
        
    Returns:
        Cosine similarity score between -1 and 1
    """
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))


def embed_text(text: str) -> np.ndarray:
    """
    Convert text to embedding vector using the global model.
    
    Args:
        text: Input text to embed
        
    Returns:
        Embedding vector as numpy array
    """
    return model.encode(text)


class MultiIntentClassifier:
    """
    Multi-intent classifier using semantic similarity.
    
    This classifier stores example texts for different intents and predicts
    the most likely intent for new text based on cosine similarity.
    """
    
    def __init__(self, embed_fn=embed_text):
        """
        Initialize the classifier.
        
        Args:
            embed_fn: Function to convert text to embeddings
        """
        self.embed_fn = embed_fn
        self.vectors = []
        self.labels = []

    def add_examples(self, intent: str, examples: list[str]) -> None:
        """
        Add training examples for a specific intent.
        
        Args:
            intent: Intent label
            examples: List of example texts for this intent
        """
        vectors = self.embed_fn(examples)
        self.vectors.extend(vectors)
        self.labels.extend([intent] * len(examples))

    def predict(self, text: str, top_k: int = 5, threshold: float = 0.75) -> tuple[str, dict]:
        """
        Predict the most likely intent for given text.
        
        Args:
            text: Input text to classify
            top_k: Number of top matches to consider
            threshold: Minimum confidence threshold
            
        Returns:
            Tuple of (predicted_intent, intent_scores_dict)
            Returns "unknown_intent" if no intent meets threshold
        """
        query = self.embed_fn(text)

        # Compute cosine similarity for each stored vector
        similarities = np.array([
            cosine_similarity(query, vector)
            for vector in self.vectors
        ])

        # Get top-k matches
        top_indices = np.argsort(-similarities)[:top_k]

        # Aggregate scores by intent
        intent_similarities = defaultdict(list)
        for idx in top_indices:
            intent_similarities[self.labels[idx]].append(similarities[idx])

        # Compute max score per intent with count bonus
        intent_scores = {}
        for intent, scores in intent_similarities.items():
            max_score = float(np.max(scores))
            count_bonus = len(scores) * 0.01  # 1% bonus per occurrence
            intent_scores[intent] = max_score + count_bonus

        # Find best intent above threshold
        best_intent = None
        best_score = 0.0
        for intent, score in intent_scores.items():
            if score >= threshold and score > best_score:
                best_intent = intent
                best_score = score

        if best_intent is None:
            return "unknown_intent", intent_scores

        return best_intent, intent_scores