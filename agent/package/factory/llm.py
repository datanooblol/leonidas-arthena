from typing import Dict, Any, Tuple

class LLMFactory:
    _models:Dict[str, Tuple[Any, Any]] = {}

    @staticmethod
    def register(model_name, LLMObject, model_id):
        LLMFactory._models[model_name] = (LLMObject, model_id)

    @staticmethod
    def checkout(model_name):
        if model_name not in LLMFactory._models:
            raise ValueError(f"Model '{model_name}' not registered")
        LLMObject, model_id = LLMFactory._models[model_name]
        return LLMObject(model_id=model_id)
    
    @staticmethod
    def list():
        return list(LLMFactory._models.keys())


"""
Example:
LLMFactory.register("nova-micro", BedrockNova, "us.amazon.nova-micro-v1:0")

llm = LLMFactory.checkout("nova-micro")
"""