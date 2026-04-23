from pydantic import BaseModel, HttpUrl, Field
from typing import Optional, Dict, Any, List, Union, Literal

class APIRequestModel(BaseModel):
    method: Literal["GET", "POST", "PUT", "PATCH", "DELETE"]="GET"
    url: str
    headers: Dict[str, str] = Field(default_factory=dict)
    params: Dict[str, Union[str,list[str]]] = Field(default_factory=dict)
    body:Optional[Union[Dict[str,Any],List[Any],str]]=None
    description: Optional[str] = None


