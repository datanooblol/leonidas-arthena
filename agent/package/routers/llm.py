from fastapi import APIRouter
from package.factory.llm import LLMFactory

router = APIRouter(prefix="/llm", tags=["LLMs"])

@router.get("/")
async def list_available_llms():
    """Get all llms"""
    return LLMFactory.list()