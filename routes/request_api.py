from fastapi import APIRouter, BackgroundTasks
from models.request_model import APIRequestModel
from services.request_service import RequestModel
from services.history_service import save_history
from services.websocket_manager import manager
from datetime import datetime

router = APIRouter(prefix="/request", tags=["request"])

@router.post("/send")
async def send_request(request: APIRequestModel):
    response = await send_request(
        request.method,
        request.url,
        request.headers,
        request.params,
        request.body

    )
    data = {
        "method": request.method,
        "url": request.url,
        "headers": request.headers,
        "params": request.params,
        "body": request.body,
        "response": response
    }

    await save_history(data)
    await manager.broadcast({
        "type": "request",
        "data": data
    })
    return response