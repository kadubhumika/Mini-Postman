# routes/curl_routes.py
from fastapi import APIRouter
from models.curl_model import CurlGenerate, CurlParse
from services.curl_service import generate_curl, parse_url

router = APIRouter(prefix="/curl", tags=["Curl"])

@router.post("/generate")
def generate(req: CurlGenerate):
    return generate_curl(**req.dict())

@router.post("/parse")
def parse(req: CurlParse):
    return parse_url(req.curl_command)