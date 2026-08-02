from fastapi import APIRouter
from app.core.responses import success_response, ResponseEnvelope

router = APIRouter()

@router.get("/health", response_model=ResponseEnvelope)
def health_check():
    return success_response(data={"status": "ok"}, message="System is healthy")
