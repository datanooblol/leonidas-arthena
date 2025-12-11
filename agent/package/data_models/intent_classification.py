from pydantic import BaseModel, Field

class Intent(BaseModel):
    intent: str = Field(..., description="The intent of the user's message")
    confidence: float = Field(..., description="The confidence score of the intent")