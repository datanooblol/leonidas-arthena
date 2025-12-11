from fastapi import APIRouter
from pydantic import BaseModel
from package.factory.llm import LLMFactory
from package.factory.intent import IntentFactory

router = APIRouter(prefix="/intent", tags=["Intent"])

class IntentRequest(BaseModel):
    """Request model for intent classifier"""
    model_id: str
    content: str

@router.get("/")
async def list_available_intent_classifiers():
    """Get all agents"""
    return IntentFactory.list()

@router.get("/{intent_name}")
async def get_intent_classifier_detail(intent_name: str):
    """Get agent by id"""
    return IntentFactory.detail(intent_name)

@router.post("/{intent_name}")
async def call_agent(
    intent_name: str, 
    intent_request: IntentRequest
):
    """Run agent by id"""
    model = IntentFactory.checkout(intent_name)
    model.model = LLMFactory.checkout(intent_request.model_id)
    return model.run(intent_request.content)