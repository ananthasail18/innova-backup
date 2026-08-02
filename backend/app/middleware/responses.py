from pydantic import BaseModel
from typing import Any, Optional, Generic, TypeVar

T = TypeVar("T")

class ResponseEnvelope(BaseModel, Generic[T]):
    status: str
    data: Optional[T] = None
    message: Optional[str] = None
    
def success_response(data: Any = None, message: str = "Success") -> ResponseEnvelope:
    return ResponseEnvelope(status="success", data=data, message=message)

def error_response(message: str, data: Any = None) -> ResponseEnvelope:
    return ResponseEnvelope(status="error", data=data, message=message)
