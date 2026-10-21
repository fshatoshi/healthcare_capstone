# CardioGuard AI - Project Roadmap

Progress tracker for the S5 Innovation project (CardioGuard AI).
Last updated: 2026-10-21

## Done

### Baseline (existing app)
- Cross-platform app: React Native / Expo (mobile) + Spring Boot 3 / Java 21 (REST API).
- Data stores: MongoDB, Redis, MinIO. JWT authentication. Full Docker Compose setup.

### Innovation - Local AI
- Real locally trained model for cardiovascular risk: scikit-learn Gradient Boosting (ROC-AUC ~0.80), exported as .joblib, metrics saved in metrics.json.
- Independent FastAPI microservice with the /analyze/predict endpoint. No external paid API (the former Gemini mock was removed).
- Spring endpoints /ai/cardio-risk and /ai/history. Each analysis is persisted and mapped to a risk level (STABLE / MODERATE / CRITICAL).

### Innovation - Security
- Tamper-evident access log: SHA-256 hash-chained ledger with an integrity-verification endpoint.
- UEBA anomaly detection on access patterns (phase 1).
- OWASP fixes: broken access control, data exposure, correct 401 vs 403 semantics.

### Mobile integration and fixes
- EHR import end-to-end: Records hub -> EHR Import -> extracted vitals preview -> confirm and save (issue #4, PR #7).
- Trend chart on the dashboard (heart rate, glucose, blood pressure) rendered with react-native-svg (issue #5).
- Login now returns 401 on invalid credentials instead of 500, and 403 on access denied (issue #9, PR #10).
- Records tab always opens the hub, so EHR Import stays reachable (issue #12).

### Project hygiene
- Renamed HealthTrack AI -> CardioGuard AI across the app UI, app.json, package.json and README (PR #11).
- Added a .gitattributes to fix the CRLF line-ending issue that was blocking pulls.
- GitHub governance: Kanban board (Todo / In Progress / In Review / Done), automations, golden rule (issue -> branch -> PR "Closes #N" -> merge -> Done), collaborator invited for peer-review.

## In progress
- #6: display the AI risk score on the dashboard from the real /ai/cardio-risk model (today the badge is still computed from a static threshold).

## To do next

### Sprint 3 - Robustness and Security
- Wire the dashboard to the real AI model (close #6).
- Rate limiting on sensitive endpoints (/auth, /ai).
- Input validation (Bean Validation on the DTOs).
- Check for zero hardcoded secrets (everything through .env).
- Remaining vulnerabilities (V05, V06) and HTTPS / TLS.
- UEBA phase 2 (Isolation Forest) and a mobile screen for the access log.

### Sprint 4 - Cloud and Industrialization
- Finalize the Docker containerization.
- CI/CD pipeline with GitHub Actions (build and test on push to main).
- Public deployment to an accessible environment.
