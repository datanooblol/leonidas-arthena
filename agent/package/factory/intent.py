from package.intents.base import Intent
from typing import Dict, Tuple, Any, Callable

class IntentFactory:
    _models:Dict[str, Tuple[Any, Any]] = {}

    @staticmethod
    def register(agent_name:str, description:str, system_prompt:Callable[[], str]):
        IntentFactory._models[agent_name] = (description, system_prompt)

    @staticmethod
    def checkout(agent_name:str):
        if agent_name not in IntentFactory._models:
            raise ValueError(f"Intent {agent_name} not found")
        _, system_prompt = IntentFactory._models[agent_name]
        return Intent(
            agent_name=agent_name,
            examples=system_prompt(),
        )
    @staticmethod
    def list():
        return [{k:v[0]} for k, v in IntentFactory._models.items()]

    @staticmethod
    def detail(agent_name:str):
        if agent_name not in IntentFactory._models:
            raise ValueError(f"Agent {agent_name} not found")
        description, _ = IntentFactory._models[agent_name]
        return {
            "agent_name": agent_name,
            "description": description
        }

"""
Example:
IntentFactory.register("query", PromptObj)

model = IntentFactory.checkout("query")
model.model = <model from Model Factory>
"""