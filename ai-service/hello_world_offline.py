"""
CardioGuard AI - Hello World (100% hors ligne).

Prouve que le stack IA local fonctionne sans internet :
  1. ingestion du dataset local (data/raw/cardio_train.csv)
  2. entrainement d'un Gradient Boosting (en memoire, rien n'est ecrase)
  3. evaluation sur un jeu de test (AUC, accuracy)
  4. prediction du risque sur des patients exemples, avec leur profil detaille

Usage :
    cd ai-service
    python hello_world_offline.py
"""
import os, time
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, roc_auc_score

HERE = os.path.dirname(os.path.abspath(__file__))
CSV = os.path.join(HERE, "data", "raw", "cardio_train.csv")
FEATURES = ["age_years","gender","height","weight","ap_hi","ap_lo",
            "bmi","cholesterol","gluc","smoke","alco","active"]
AMBER, RED = 0.45, 0.70
CHOL = {1: "normal", 2: "au-dessus", 3: "bien au-dessus"}
GLUC = {1: "normale", 2: "au-dessus", 3: "bien au-dessus"}

def level(p):
    return "RED (critique)" if p >= RED else "AMBER (a surveiller)" if p >= AMBER else "STABLE"

def factors(s, bmi):
    """Facteurs aggravants lisibles (memes regles que l'API /analyze/predict)."""
    f = []
    if s["ap_hi"] >= 140 or s["ap_lo"] >= 90: f.append(f"tension elevee ({s['ap_hi']}/{s['ap_lo']} mmHg)")
    if bmi >= 30: f.append(f"IMC eleve ({bmi})")
    if s["cholesterol"] >= 2: f.append("cholesterol au-dessus de la normale")
    if s["gluc"] >= 2: f.append("glycemie au-dessus de la normale")
    if s["smoke"] == 1: f.append("tabagisme")
    if s["active"] == 0: f.append("sedentarite")
    if s["age_years"] >= 55: f.append("age > 55 ans")
    return f

print("=" * 64)
print("CardioGuard AI - demo IA locale (hors ligne)")
print("=" * 64)

# 1) Ingestion
print(f"\n[1] Lecture du dataset local : {CSV}")
df = pd.read_csv(CSV, sep=";")
print(f"    {len(df)} lignes brutes chargees (aucun appel reseau).")
df = df.drop(columns=["id"])
df["age_years"] = (df["age"] / 365.25).round(1)
df = df.drop(columns=["age"])
df = df[(df.ap_hi.between(70, 250)) & (df.ap_lo.between(40, 200)) & (df.ap_hi >= df.ap_lo)]
df = df[(df.height.between(120, 220)) & (df.weight.between(30, 200))]
df["bmi"] = (df.weight / (df.height / 100) ** 2).round(1)
df = df[df.bmi.between(12, 60)]
print(f"    {len(df)} lignes apres nettoyage (tensions/taille/poids aberrants retires).")

# 2) Entrainement (en memoire)
X, y = df[FEATURES], df["cardio"]
Xtr, Xte, ytr, yte = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
print("\n[2] Entrainement du Gradient Boosting (local)...")
t0 = time.time()
model = GradientBoostingClassifier(random_state=42)
model.fit(Xtr, ytr)
print(f"    entraine en {time.time()-t0:.1f}s sur {len(Xtr)} patients, teste sur {len(Xte)}.")

# 3) Evaluation
proba = model.predict_proba(Xte)[:, 1]
pred = (proba >= 0.5).astype(int)
print("\n[3] Evaluation sur le jeu de test :")
print(f"    accuracy = {accuracy_score(yte, pred):.4f}")
print(f"    ROC-AUC  = {roc_auc_score(yte, proba):.4f}")

# 4) Prediction sur des patients exemples (profil + facteurs)
print("\n[4] Analyse de patients (constantes -> risque cardiovasculaire) :")
samples = [
    {"nom":"Jeune actif, constantes normales",
     "age_years":30,"gender":1,"height":175,"weight":70,"ap_hi":118,"ap_lo":76,
     "cholesterol":1,"gluc":1,"smoke":0,"alco":0,"active":1},
    {"nom":"Quinquagenaire, facteurs moderes",
     "age_years":52,"gender":1,"height":168,"weight":82,"ap_hi":138,"ap_lo":88,
     "cholesterol":2,"gluc":1,"smoke":0,"alco":0,"active":1},
    {"nom":"Senior multi-facteurs",
     "age_years":62,"gender":2,"height":170,"weight":95,"ap_hi":160,"ap_lo":100,
     "cholesterol":3,"gluc":3,"smoke":1,"alco":1,"active":0},
]
for i, s in enumerate(samples, 1):
    bmi = round(s["weight"]/((s["height"]/100)**2), 1)
    s["bmi"] = bmi
    row = pd.DataFrame([{k: s[k] for k in FEATURES}])[FEATURES]
    p = float(model.predict_proba(row)[0][1])
    sexe = "homme" if s["gender"] == 2 else "femme"
    print(f"\n  Patient {i} : {s['nom']}")
    print(f"    age {s['age_years']} ans | {sexe} | {s['height']} cm | {s['weight']} kg | IMC {bmi}")
    print(f"    tension {s['ap_hi']}/{s['ap_lo']} mmHg | cholesterol {CHOL[s['cholesterol']]} | glycemie {GLUC[s['gluc']]}")
    print(f"    tabac {'oui' if s['smoke'] else 'non'} | alcool {'oui' if s['alco'] else 'non'} | activite {'oui' if s['active'] else 'non'}")
    print(f"    --> probabilite de risque : {p:.2%}   =>   {level(p)}")
    fs = factors(s, bmi)
    print(f"    facteurs aggravants : {', '.join(fs) if fs else 'aucun'}")

print("\nOK : IA locale fonctionnelle, sans aucune connexion internet.")
print("=" * 64)
