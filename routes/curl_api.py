# here we have to convert api into curl command
# then parser itt it format to easily identify
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional,Dict,Any

from services.curl_service import generate_curl, parse_curl

router = APIRouter(
    prefix="/request",
    tags=["API-request"],
)
class Curl_Generate_Url(BaseModel):
    method: str
    url: str
    headers: Optional[Dict[str, str]] = None
    body: Optional[Any] = None

class Curl_Parse(BaseModel):
    curl_command: str

@router.post("/generate-url", response_model=Curl_Generate_Url)
def generate_curl_generate(request: Curl_Generate_Url):
    return generate_curl(
        method = request.method,
        url = request.url,
        headers = request.headers,
        body = request.body,
        params = request.params
    )
@router.get("/parse")
def parse_curl_generate(request: Curl_Parse):
    return parse_curl(request.curl_command)
