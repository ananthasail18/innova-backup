from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "TasteAI"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = "sqlite:///./tasteai.db"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    # AI Providers
    GEMINI_API_KEY: str | None = None
    NVIDIA_API_KEY: str | None = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
