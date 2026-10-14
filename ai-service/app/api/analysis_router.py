"""Routeur d'analyse : prédiction de risque cardiovasculaire (monté sous /analyze)."""
import pandas as pd
from fastapi import APIRouter, HTTPException

from app.models.ml.model_loader import get_model, model_ready, ModelNotLoadedError
from app.models.schemas.analysis_schema import PredictRequest, PredictResponse, RiskLevel

router = APIRouter()

_DISCLAIMER = (
    "Estimation statistique à visée préventive, sans valeur diagnostique. "
    "Toute décision clinique relève d'un médecin."
)

# Seuils de décision. Volontairement prudents : on préfère alerter à tort
# (AMBER) plutôt que manquer un patient à risque. Ajustables par un médecin/admin.
_THRESHOLD_RED = 0.70
_THRESHOLD_AMBER = 0.45


def _explain(req: PredictRequest) -> list[str]:
    """Facteurs aggravants lisibles (règles cliniques simples, pour la transparence)."""
    factors = []
    bmi = req.weight / ((req.height / 100) ** 2)
    if req.ap_hi >= 140 or req.ap_lo >= 90:
        factors.append(f"tension élevée ({req.ap_hi}/{req.ap_lo} mmHg)")
    if bmi >= 30:
        factors.append(f"IMC élevé ({bmi:.1f})")
    if req.cholesterol >= 2:
        factors.append("cholestérol au-dessus de la normale")
    if req.gluc >= 2:
        factors.append("glycémie au-dessus de la normale")
    if req.smoke == 1:
        factors.append("tabagisme")
    if req.active == 0:
        factors.append("sédentarité")
    if req.age_years >= 55:
        factors.append("âge > 55 ans")
    return factors


@router.post("/predict", response_model=PredictResponse)
def predict(req: PredictRequest) -> PredictResponse:
    try:
        bundle = get_model()
    except ModelNotLoadedError as e:
        raise HTTPException(status_code=503, detail=str(e))

    model = bundle["model"]
    features = bundle["features"]

    bmi = round(req.weight / ((req.height / 100) ** 2), 1)
    row = {
        "age_years": req.age_years, "gender": req.gender,
        "height": req.height, "weight": req.weight,
        "ap_hi": req.ap_hi, "ap_lo": req.ap_lo, "bmi": bmi,
        "cholesterol": req.cholesterol, "gluc": req.gluc,
        "smoke": req.smoke, "alco": req.alco, "active": req.active,
    }
    # DataFrame avec noms de colonnes dans l'ordre d'entraînement
    X = pd.DataFrame([row])[features]
    proba = float(model.predict_proba(X)[0][1])

    if proba >= _THRESHOLD_RED:
        level = RiskLevel.RED
    elif proba >= _THRESHOLD_AMBER:
        level = RiskLevel.AMBER
    else:
        level = RiskLevel.STABLE

    return PredictResponse(
        risk_level=level,
        probability=round(proba, 4),
        model_name=bundle.get("model_name", "unknown"),
        top_factors=_explain(req),
        disclaimer=_DISCLAIMER,
    )


@router.get("/model-info")
def model_info():
    if not model_ready():
        raise HTTPException(status_code=503, detail="Modèle non chargé")
    bundle = get_model()
    return {
        "model_name": bundle.get("model_name"),
        "features": bundle.get("features"),
        "dataset": bundle.get("dataset"),
        "thresholds": {"amber": _THRESHOLD_AMBER, "red": _THRESHOLD_RED},
    }
