"""Chargement paresseux du modèle de risque cardiovasculaire (singleton)."""
import os
from functools import lru_cache
from pathlib import Path
import joblib

# ai-service/app/models/ml/model_loader.py -> racine ai-service = parents[3]
_DEFAULT = Path(__file__).resolve().parents[3] / "models" / "cardio_risk_model.joblib"
MODEL_PATH = Path(os.getenv("MODEL_PATH", str(_DEFAULT)))


class ModelNotLoadedError(RuntimeError):
    pass


@lru_cache(maxsize=1)
def get_model():
    """Retourne le bundle {model, features, model_name, ...}. Chargé une seule fois."""
    if not MODEL_PATH.exists():
        raise ModelNotLoadedError(
            f"Modèle introuvable : {MODEL_PATH}. "
            f"Lancer d'abord 'python train_cardio.py'."
        )
    return joblib.load(MODEL_PATH)


def model_ready() -> bool:
    try:
        get_model()
        return True
    except Exception:
        return False
