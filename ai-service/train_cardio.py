"""
Entraînement du modèle de risque cardiovasculaire.

Dataset : Cardiovascular Disease (Kaggle, sulianova), 70 000 patients.
Placer cardio_train.csv dans ai-service/data/raw/ (séparateur ';').

Usage :
    cd ai-service
    pip install -r requirements.txt      # ou : pip install scikit-learn pandas joblib
    python train_cardio.py

Produit : models/cardio_risk_model.joblib  et  models/metrics.json
"""
import json, os, warnings, joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import (accuracy_score, recall_score, precision_score,
                             f1_score, roc_auc_score, confusion_matrix)
warnings.filterwarnings("ignore")

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, "data", "raw", "cardio_train.csv")
OUT  = os.path.join(HERE, "models")

def load_clean():
    df = pd.read_csv(SRC, sep=";")
    n0 = len(df)
    df = df.drop(columns=["id"])
    df["age_years"] = (df["age"] / 365.25).round(1)
    df = df.drop(columns=["age"])
    # Tensions plausibles + systolique >= diastolique (le dataset contient des aberrations)
    df = df[(df.ap_hi.between(70, 250)) & (df.ap_lo.between(40, 200)) & (df.ap_hi >= df.ap_lo)]
    df = df[(df.height.between(120, 220)) & (df.weight.between(30, 200))]
    df["bmi"] = (df.weight / (df.height / 100) ** 2).round(1)
    df = df[df.bmi.between(12, 60)]
    return df, n0, len(df)

FEATURES = ["age_years","gender","height","weight","ap_hi","ap_lo",
            "bmi","cholesterol","gluc","smoke","alco","active"]

def main():
    df, n0, n1 = load_clean()
    X, y = df[FEATURES], df["cardio"]
    Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

    candidates = {
        "logreg": Pipeline([("scaler", StandardScaler()),
                            ("clf", LogisticRegression(max_iter=1000, class_weight="balanced"))]),
        "random_forest": RandomForestClassifier(n_estimators=300, max_depth=8,
                            class_weight="balanced", random_state=42, n_jobs=-1),
        "grad_boost": GradientBoostingClassifier(random_state=42),
    }

    results, fitted = [], {}
    for name, mdl in candidates.items():
        mdl.fit(Xtr, ytr)
        proba = mdl.predict_proba(Xte)[:, 1]
        pred = (proba >= 0.5).astype(int)
        m = dict(model=name,
                 accuracy=round(accuracy_score(yte, pred), 4),
                 recall=round(recall_score(yte, pred), 4),
                 precision=round(precision_score(yte, pred), 4),
                 f1=round(f1_score(yte, pred), 4),
                 roc_auc=round(roc_auc_score(yte, proba), 4),
                 confusion_matrix=confusion_matrix(yte, pred).tolist())
        results.append(m); fitted[name] = mdl
        print(f"{name:14s} acc={m['accuracy']} recall={m['recall']} auc={m['roc_auc']}")

    # On privilégie l'AUC (pouvoir de discrimination). En clinique, penser aussi
    # au rappel : ne pas rater de patients réellement à risque (faux négatifs).
    best = max(results, key=lambda r: r["roc_auc"])
    best_model = fitted[best["model"]]
    print("\nMeilleur modèle :", best["model"])

    os.makedirs(OUT, exist_ok=True)
    joblib.dump({"model": best_model, "features": FEATURES,
                 "model_name": best["model"], "target": "cardio",
                 "dataset": "cardiovascular-disease (Kaggle sulianova)"},
                os.path.join(OUT, "cardio_risk_model.joblib"))
    json.dump({"rows_raw": n0, "rows_clean": n1, "dropped": n0 - n1,
               "features": FEATURES, "chosen_model": best["model"], "results": results},
              open(os.path.join(OUT, "metrics.json"), "w"), indent=2)
    print("Modèle et métriques écrits dans", OUT)

if __name__ == "__main__":
    main()
