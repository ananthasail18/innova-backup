from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class DimensionContributions(BaseModel):
    quiz: float = 0.35
    feedback: float = 0.25
    orders: float = 0.25
    recommendations: float = 0.15

class TasteDNADimensionDetail(BaseModel):
    value: float = Field(0.5, ge=0.0, le=1.0)
    confidence: float = Field(0.55, ge=0.0, le=1.0)
    last_updated: str = Field(default_factory=lambda: datetime.utcnow().strftime("%Y-%m-%d"))
    sources: List[str] = Field(default_factory=lambda: ["Onboarding Quiz"])
    contributions: DimensionContributions = Field(default_factory=DimensionContributions)

class TasteDNAMatrix(BaseModel):
    spice: TasteDNADimensionDetail
    sweetness: TasteDNADimensionDetail
    creaminess: TasteDNADimensionDetail
    tanginess: TasteDNADimensionDetail
    masala_intensity: TasteDNADimensionDetail
    crunchiness: TasteDNADimensionDetail
    oiliness: TasteDNADimensionDetail
    saltiness: TasteDNADimensionDetail
    overall_confidence: float = 0.55
    completion_percentage: float = 100.0
    recent_evolution: List[Dict[str, Any]] = Field(default_factory=list)
