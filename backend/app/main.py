from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.config import settings
from app.middleware.exceptions import global_exception_handler
from app.config.logging import logger

def create_app() -> FastAPI:
    app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

    # CORS
    if settings.BACKEND_CORS_ORIGINS:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    # Exception Handling
    app.add_exception_handler(Exception, global_exception_handler)

    # Routers
    from app.routes.health import router as health_router
    from app.routes.restaurant import router as restaurant_router
    from app.routes.categories import router as categories_router
    from app.routes.dishes import router as dishes_router
    from app.routes.users import router as users_router
    from app.routes.taste_profile import router as taste_profile_router
    from app.routes.recommendations import router as recommendations_router
    from app.routes.community import router as community_router
    from app.routes.chat import router as chat_router
    
    app.include_router(health_router, prefix="", tags=["health"])
    app.include_router(restaurant_router, prefix=settings.API_V1_STR, tags=["restaurant"])
    app.include_router(categories_router, prefix=settings.API_V1_STR, tags=["categories"])
    app.include_router(dishes_router, prefix=settings.API_V1_STR, tags=["dishes"])
    app.include_router(users_router, prefix=settings.API_V1_STR, tags=["users"])
    app.include_router(taste_profile_router, prefix=settings.API_V1_STR, tags=["taste_profile"])
    app.include_router(recommendations_router, prefix=settings.API_V1_STR, tags=["recommendations"])
    app.include_router(community_router, prefix=settings.API_V1_STR, tags=["community"])
    app.include_router(chat_router, prefix=settings.API_V1_STR, tags=["chat"])
    
    logger.info("Application startup complete.")

    return app

app = create_app()
