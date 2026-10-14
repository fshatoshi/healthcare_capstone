"""Schémas Pydantic pour la prédiction de risque cardiovasculaire."""
from enum import Enum
from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    STABLE = "STABLE"     # vert
    AMBER = "AMBER"       # orange
    RED = "RED"           # rouge


class PredictRequest(BaseModel):
    """Mesures d'un patient. Bornes = garde-fous de validation (V-sécurité IA)."""
    age_years: float = Field(..., ge=1, le=120)
    gender: int = Field(..., ge=1, le=2, description="1=femme, 2=homme (codage du dataset)")
    height: float = Field(..., ge=120, le=220, description="cm")
    weight: float = Field(..., ge=30, le=300, description="kg")
    ap_hi: int = Field(..., ge=70, le=250, description="tension systolique (mmHg)")
    ap_lo: int = Field(..., ge=40, le=200, description="tension diastolique (mmHg)")
    cholesterol: int = Field(..., ge=1, le=3, description="1=normal, 2=élevé, 3=très élevé")
    gluc: int = Field(..., ge=1, le=3, description="1=normal, 2=élevé, 3=très élevé")
    smoke: int = Field(0, ge=0, le=1)
    alco: int = Field(0, ge=0, le=1)
    active: int = Field(1, ge=0, le=1)


class PredictResponse(BaseModel):
    risk_level: RiskLevel
    probability: float = Field(..., description="Probabilité estimée de maladie cardiovasculaire (0-1)")
    model_name: str
    top_factors: list[str] = Field(default_factory=list, description="Facteurs aggravants détectés")
    disclaimer: str
