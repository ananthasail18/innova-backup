from fastapi import Request
from fastapi.responses import JSONResponse
from app.middleware.responses import error_response
from app.config.logging import logger

async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=error_response(message="An unexpected error occurred").model_dump()
    )
