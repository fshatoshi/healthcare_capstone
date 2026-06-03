# FastAPI entrypoint
# Run: uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload

from fastapi import FastAPI
from app.api import health_router, analysis_router, cv_router, ehr_router

app = FastAPI(
    title="HealthTrack AI Service",
    description="AI/ML microservice: anomaly detection, CV, EHR extraction",
    version="0.1.0"
)

app.include_router(health_router.router,   prefix="/health")
app.include_router(analysis_router.router, prefix="/analyze")
app.include_router(cv_router.router,       prefix="/cv")
app.include_router(ehr_router.router,      prefix="/ehr")

@app.get("/")
def root():
    return {"status": "HealthTrack AI Service running"}