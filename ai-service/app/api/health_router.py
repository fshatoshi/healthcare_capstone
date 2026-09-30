"""Contrôle de vie/prêt du service (monté sous /health)."""
from fastapi import APIRouter
from app.models.ml.model_loader import model_ready

router = APIRouter()


@router.get("")
def health():
    return {"status": "ok", "model_loaded": model_ready()}
