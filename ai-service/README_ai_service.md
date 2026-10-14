# HealthTrack AI - Python AI Microservice

## Setup
1. Python 3.12+
2. python -m venv .venv
3. Windows: .venv\Scripts\Activate.ps1
4. pip install -r requirements.txt
5. uvicorn app.main:app --reload --port 8001
6. API at http://localhost:8001

## Models
Place trained model files in the models/ subdirectories.
Use the Jupyter notebooks in notebooks/ to train from scratch.