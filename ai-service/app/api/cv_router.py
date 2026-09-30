"""Vision par ordinateur : non implémenté (placeholder pour que l'app démarre)."""
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/analyze")
def cv_analyze():
    raise HTTPException(status_code=501, detail="Analyse d'image non implémentée")
