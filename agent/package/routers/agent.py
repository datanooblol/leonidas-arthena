from fastapi import APIRouter
from pydantic import BaseModel
from package.factory.agent import AgentFactory
from package.factory.llm import LLMFactory

router = APIRouter(prefix="/agent", tags=["Agent"])

class AgentRequest(BaseModel):
    """Request model for agent"""
    model_id: str
    content: str

@router.get("/")
async def list_available_agents():
    """Get all agents"""
    return AgentFactory.list()

@router.get("/{agent_name}")
async def get_agent_detail(agent_name: str):
    """Get agent by id"""
    return AgentFactory.detail(agent_name)

@router.post("/{agent_name}")
async def call_agent(
    agent_name: str, 
    agent_request: AgentRequest
):
    """Run agent by id"""
    model = AgentFactory.checkout(agent_name)
    model.model = LLMFactory.checkout(agent_request.model_id)
    return model.run(agent_request.content)