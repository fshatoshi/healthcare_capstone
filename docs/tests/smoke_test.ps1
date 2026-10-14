# =====================================================================
#  HealthTrack AI - Test de bout en bout (smoke test)
#  Auteur : François Zogbelemou
#
#  Prérequis :
#    docker compose up -d --build backend
#    docker compose --profile ai up -d --build ai-service
#
#  Lancement (PowerShell, à la racine du projet) :
#    ./docs/tests/smoke_test.ps1
#
#  Le script cree des comptes de test, promeut un medecin et un admin
#  via MongoDB, puis exerce toute la chaine et affiche PASS / FAIL.
# =====================================================================

param([int]$Port = 8090)   # port hote du backend (voir BACKEND_PORT dans .env)
$ErrorActionPreference = "Stop"
$base = "http://localhost:$Port/api/v1"
$ai   = "http://localhost:8001"
$pass = 0; $fail = 0
$rid = Get-Random -Maximum 99999   # suffixe unique pour rejouer le script

function Ok($m)  { Write-Host "  [PASS] $m" -ForegroundColor Green; $script:pass++ }
function Ko($m)  { Write-Host "  [FAIL] $m" -ForegroundColor Red;   $script:fail++ }
function Step($m){ Write-Host "`n== $m" -ForegroundColor Cyan }

function Api($method,$url,$bodyObj,$token) {
    $headers = @{}
    if ($token) { $headers["Authorization"] = "Bearer $token" }
    $args = @{ Uri=$url; Method=$method; Headers=$headers; ContentType="application/json" }
    if ($bodyObj -ne $null) { $args["Body"] = ($bodyObj | ConvertTo-Json -Compress) }
    return Invoke-RestMethod @args
}

# Promotion d'un role via mongosh dans le conteneur (l'inscription force PATIENT)
function Promote($email,$role) {
    docker compose exec -T mongodb mongosh -u healthtrack -p changeme `
      --authenticationDatabase admin healthtrackdb --quiet `
      --eval "db.users.updateOne({email:'$email'},{`$set:{role:'$role'}})" | Out-Null
}

Write-Host "HealthTrack AI - smoke test (run #$rid)" -ForegroundColor Yellow

# ---------------------------------------------------------------------
Step "1. Disponibilite du backend"
try { $r = Invoke-RestMethod "$base/auth/ping"; Ok "ping backend : $r" } catch { Ko "backend injoignable ($_)" ; Write-Host "Le backend doit tourner. Abandon." ; exit 1 }

Step "2. Disponibilite du service IA"
try { $h = Invoke-RestMethod "$ai/health"; if ($h.model_loaded) { Ok "IA OK, modele charge" } else { Ko "IA repond mais modele NON charge" } }
catch { Ko "service IA injoignable - les analyses utiliseront le repli ($_)" }

# ---------------------------------------------------------------------
Step "3. Securite V01 - le role est force a PATIENT"
$patEmail = "pat$rid@test.ma"
$reg = Api POST "$base/auth/register" @{ email=$patEmail; password="Test1234"; firstName="Awa"; lastName="Diallo"; role="ADMIN"; dob="1965-04-12"; language="fr" }
if ($reg.role -eq "PATIENT") { Ok "role renvoye = PATIENT (ADMIN demande ignore)" } else { Ko "role = $($reg.role) (attendu PATIENT)" }
if (-not $reg.PSObject.Properties.Name.Contains("password")) { Ok "V02 - aucun mot de passe dans la reponse" } else { Ko "V02 - le mot de passe est expose" }
$patToken = $reg.token; $patId = $reg.userId

Step "4. Saisie et lecture de mesures (patient)"
Api POST "$base/patient/records" @{ type="VITALS"; heartRate=78; bloodPressure="120/80"; bloodGlucose=95.0; source="MANUAL" } $patToken | Out-Null
Api POST "$base/patient/records" @{ type="SLEEP"; sleepDuration=7.5; sleepQuality=80; source="MANUAL" } $patToken | Out-Null
$recs = Api GET "$base/patient/records" $null $patToken
if ($recs.Count -ge 2) { Ok "$($recs.Count) mesures enregistrees et relues" } else { Ko "mesures non relues (count=$($recs.Count))" }

# ---------------------------------------------------------------------
Step "5. Compte medecin (promotion via MongoDB)"
$docEmail = "doc$rid@test.ma"
$docReg = Api POST "$base/auth/register" @{ email=$docEmail; password="Test1234"; firstName="Karim"; lastName="Benani"; role="PATIENT"; dob="1980-01-01"; language="fr" }
Promote $docEmail "DOCTOR"
$docLogin = Api POST "$base/auth/login" @{ email=$docEmail; password="Test1234" }
if ($docLogin.role -eq "DOCTOR") { Ok "medecin promu et reconnecte (role DOCTOR)" } else { Ko "promotion medecin KO (role=$($docLogin.role))" }
$docToken = $docLogin.token

Step "6. Workflow medecin : liste, assignation, lecture dossier"
$unassigned = Api GET "$base/doctor/patients?assigned=false" $null $docToken
if ($unassigned | Where-Object { $_.id -eq $patId }) { Ok "patient visible dans les non-assignes" } else { Ko "patient absent des non-assignes" }
Api POST "$base/doctor/patient/$patId/assign" $null $docToken | Out-Null
Ok "patient assigne au medecin"
$docRecs = Api GET "$base/doctor/patient/$patId/records" $null $docToken
if ($docRecs.Count -ge 2) { Ok "le medecin lit le dossier du patient assigne" } else { Ko "lecture dossier KO" }

Step "7. Securite V03 - un autre medecin ne doit PAS lire ce dossier"
$doc2Email = "doc2$rid@test.ma"
Api POST "$base/auth/register" @{ email=$doc2Email; password="Test1234"; firstName="Sara"; lastName="Alaoui"; role="PATIENT"; dob="1985-01-01"; language="fr" } | Out-Null
Promote $doc2Email "DOCTOR"
$doc2 = Api POST "$base/auth/login" @{ email=$doc2Email; password="Test1234" }
try { Api GET "$base/doctor/patient/$patId/records" $null $doc2.token | Out-Null; Ko "V03 - acces autorise a tort (faille ouverte)" }
catch { if ($_.Exception.Response.StatusCode.value__ -eq 403) { Ok "V03 - acces refuse (403) comme attendu" } else { Ko "V03 - refus mais code inattendu ($($_.Exception.Response.StatusCode.value__))" } }

# ---------------------------------------------------------------------
Step "8. Messagerie patient <-> medecin"
Api POST "$base/chat/patient/messages/text" @{ content="Bonjour docteur, jai une question." } $patToken | Out-Null
$docMsgs = Api GET "$base/chat/doctor/$patId/messages" $null $docToken
if ($docMsgs.Count -ge 1) { Ok "message recu cote medecin" } else { Ko "message non recu" }

# ---------------------------------------------------------------------
Step "9. Analyse IA (risque cardiovasculaire)"
$risk = Api POST "$base/patient/ai/cardio-risk" @{ ageYears=60; gender=2; height=170; weight=95; apHi=160; apLo=100; cholesterol=3; gluc=3; smoke=1; alco=1; active=0 } $patToken
if ($risk.riskLevel -eq "CRITICAL") { Ok "risque = CRITICAL (confiance $([math]::Round($risk.confidence,2)))" }
elseif ($risk.riskLevel) { Ok "analyse renvoyee : $($risk.riskLevel) (repli IA possible)" }
else { Ko "pas de resultat d'analyse" }
if ($risk.validationStatus -eq "PENDING") { Ok "resultat en attente de validation medicale" } else { Ko "statut inattendu ($($risk.validationStatus))" }

# ---------------------------------------------------------------------
Step "10. Journal d'acces infalsifiable"
$log = Api GET "$base/patient/access-log" $null $patToken
$aiEntry = $log | Where-Object { $_.action -eq "AI_ANALYSIS" }
$readEntry = $log | Where-Object { $_.action -eq "READ_RECORDS" }
if ($aiEntry) { Ok "entree AI_ANALYSIS presente" } else { Ko "entree AI_ANALYSIS absente" }
if ($readEntry) { Ok "entree READ_RECORDS presente (acces medecin trace)" } else { Ko "entree READ_RECORDS absente" }
$verify = Api GET "$base/patient/access-log/verify" $null $patToken
if ($verify.valid) { Ok "chaine du journal integre (valid=true, $($verify.totalEntries) entrees)" } else { Ko "chaine cassee : $($verify.brokenAtSeq)" }

# ---------------------------------------------------------------------
Step "11. Supervision admin (detection d'anomalies)"
$admEmail = "adm$rid@test.ma"
Api POST "$base/auth/register" @{ email=$admEmail; password="Test1234"; firstName="Root"; lastName="Admin"; role="PATIENT"; dob="1970-01-01"; language="fr" } | Out-Null
Promote $admEmail "ADMIN"
$adm = Api POST "$base/auth/login" @{ email=$admEmail; password="Test1234" }
try { $an = Api GET "$base/admin/security/anomalies?windowMinutes=1440" $null $adm.token; Ok "endpoint anomalies accessible a l'admin ($($an.Count) alerte(s))" }
catch { Ko "endpoint anomalies KO ($_)" }
try { Api GET "$base/admin/security/anomalies" $null $patToken | Out-Null; Ko "un PATIENT accede a la supervision (faille)" }
catch { if ($_.Exception.Response.StatusCode.value__ -eq 403) { Ok "acces admin refuse au patient (403)" } else { Ko "refus mais code inattendu" } }

# ---------------------------------------------------------------------
Write-Host "`n=====================================================" -ForegroundColor Yellow
Write-Host ("RESULTAT : {0} PASS / {1} FAIL" -f $pass, $fail) -ForegroundColor ($(if ($fail -eq 0){"Green"}else{"Red"}))
Write-Host "=====================================================" -ForegroundColor Yellow
