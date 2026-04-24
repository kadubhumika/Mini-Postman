# routes/request_routes.py
from fastapi import APIRouter
from models.request_model import APIRequestModel
from services.request_service import RequestModel
from services.history_service import save_history
from services.websocket_manager import manager
from urllib.parse import urlparse

router = APIRouter(prefix="/request", tags=["Request"])

@router.post("/send")
async def send_api(request: APIRequestModel):
    parsed = urlparse(str(request.url))
    base_url = f"{parsed.scheme}://{parsed.netloc}"
    endpoint = parsed.path or "/"

    client = RequestModel(base_url=base_url, headers=request.headers)

    method = request.method.upper()

    if method == "GET":
        response = await client.get(endpoint, params=request.params)
    elif method == "POST":
        response = await client.post(endpoint, body=request.body)
    elif method == "PUT":
        response = await client.put(endpoint, body=request.body)
    elif method == "DELETE":
        response = await client.delete(endpoint)
    else:
        return {"error": "Unsupported method"}

    data = {
        "method": method,
        "url": str(request.url),
        "headers": request.headers,
        "params": request.params,
        "body": request.body,
        "response": response
    }

    await save_history(data)

    await manager.broadcast({
        "type": "API_RESPONSE",
        "data": data
    })

    return response