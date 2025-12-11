from package.agents.base import Agent
from typing import Dict, Tuple, Any, Callable

class AgentFactory:
    _agents:Dict[str, Tuple[Any, Any, Any, Any]] = {}

    @staticmethod
    def register(agent_name:str, description:str, system_prompt:Callable[[], str], DataModel=None, format=None):
        AgentFactory._agents[agent_name] = (description, system_prompt, DataModel, format)

    @staticmethod
    def checkout(agent_name:str):
        if agent_name not in AgentFactory._agents:
            raise ValueError(f"Agent {agent_name} not found")
        _, system_prompt, DataModel, format = AgentFactory._agents[agent_name]
        return Agent(
            agent_name=agent_name,
            system_prompt=system_prompt(),
            DataModel=DataModel,
            format=format
        )
    @staticmethod
    def list():
        return [{k:v[0]} for k, v in AgentFactory._agents.items()]

    @staticmethod
    def detail(agent_name:str):
        if agent_name not in AgentFactory._agents:
            raise ValueError(f"Agent {agent_name} not found")
        _, system_prompt, DataModel, format = AgentFactory._agents[agent_name]
        return {
            "agent_name": agent_name,
            "system_prompt": system_prompt(),
            "DataModel": DataModel.model_json_schema() if DataModel else None,
        }

"""
Example:
AgentFactory.register("customer-info-extractor", PromptObj, CustomerInfo, "json")

agent = AgentFactory.checkout("customer-info-extractor")
agent.model = <model from Model Factory>
"""