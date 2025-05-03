from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from agents.fashion_app_agent import FashionAppAgent

router = APIRouter()
agent = FashionAppAgent()

class RecommendationRequest(BaseModel):
    input: str

@router.post("/recommend")
async def recommend_outfit(request: RecommendationRequest):
    try:
        result = agent.main(request.input)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
