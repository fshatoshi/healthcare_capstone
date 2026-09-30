"""Extraction EHR : non implémentée côté IA (placeholder). L'extraction actuelle
est faite côté backend Spring. Placeholder pour que l'app démarre."""
from fastapi import APIRouter, HTTPException

router = APIRouter()


@router.post("/extract")
def ehr_extract():
    raise HTTPException(status_code=501, detail="Extraction EHR non implémentée côté IA")
