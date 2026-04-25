from fastapi import APIRouter, Query
from services.history_service import get_history


router = APIRouter(prefix="/history", tags=["History"])

@router.get("/")
async def history(
    limit: int = Query(10, le=100),
    method: str | None = None
):
    return await get_history(limit, method)