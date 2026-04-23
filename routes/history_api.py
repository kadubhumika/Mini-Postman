from fastapi import APIRouter, Query
from services.history_service import get_history


router = APIRouter(prefix="/history", tags=["History"])

@router.get("/") # You could add response_model=List[HistoryResponse] here
async def history(limit: int = Query(default=20, le=100)):

    return await get_history(limit=limit)
