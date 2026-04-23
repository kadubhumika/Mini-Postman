from fastapi import APIRouter
from pip._internal import req

from models.curl_model import CurlGenerate, CurlParse
from services.curl_service import generate_curl, parse_url

router = APIRouter(prefix="/curl", tags=["Curl"])

@router.post("/generate")
def generate(req: CurlGenerate):
    return generate_curl(**req.dict())

# In services/curl_service.py
@router.get("/parse")
def parse_curl(curl_command: str):
    # Logic to extract parts...
    return parse_curl(req.curl_command)
