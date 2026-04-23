from pydantic import BaseModel
from typing import Optional, Dict, Any

class CurlGenerate(BaseModel):
    method: str
    url: str
    headers: Optional[Dict[str, str]]=None
    body: Optional[Any]=None

class CurlParse(BaseModel):
    command_url:str