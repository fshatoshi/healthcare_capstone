# HealthTrack AI - Spring Boot Backend

## Setup from Spring Initializr
1. Go to https://start.spring.io
2. Project: Gradle - Groovy | Language: Java | Boot: 3.3.x
3. Group: com.healthtrack | Artifact: backend | Java: 21
4. Dependencies: Spring Web, Data MongoDB, Security, Validation,
   Spring Reactive Web, Data Redis, Lombok
5. Click GENERATE, download zip
6. Extract the zip, then copy ONLY these into this folder:
   - gradlew
   - gradlew.bat
   - settings.gradle  (overwrite the one here)
   - gradle/ folder
   (do NOT copy src/ or build.gradle - this folder already has them)

## Run
1. docker-compose up mongodb redis -d
2. gradlew.bat bootRun
3. API at http://localhost:8080