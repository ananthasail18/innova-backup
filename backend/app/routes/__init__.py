from app.routes.restaurant import router as restaurant_router
from app.routes.categories import router as categories_router
from app.routes.dishes import router as dishes_router
from app.routes.users import router as users_router
from app.routes.taste_profile import router as taste_profile_router
from app.routes.recommendations import router as recommendations_router
from app.routes.community import router as community_router
from app.routes.chat import router as chat_router
from app.routes.health import router as health_router

__all__ = [
    "restaurant_router",
    "categories_router",
    "dishes_router",
    "users_router",
    "taste_profile_router",
    "recommendations_router",
    "community_router",
    "chat_router",
    "health_router",
]
