# first we will start with routes thst we will use in most project
# here we will make routes of
#GET request
#POST request
#PUT request
#DELETE request
#Accept headers
#Accept body data
#Accept query parameters

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional,Dict,Any
from services.request_service import send_request
router = APIRouter(prefix="/request", tags=["API-request"])
# POst Method First
class APIRequest(BaseModel):
    method: str
    url: str
    headers: Optional[Dict[str, str]] = None
    params: Optional[Dict[str, str]] = None
    body: Optional[Dict[str,Any]] = None

@router.post("/send")
async def send_request(request: APIRequest):
    response = await send_request(
        method=request.method,
        url=request.url,
        headers=request.headers,
        params=request.params,
        body=request.body
    )
    return response


# post(url)
#