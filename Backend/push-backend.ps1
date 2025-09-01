param(
  [string]$DockerUser = "$env:DOCKERHUB_USER",
  [string]$ImageName = "hotel-inventory-backend",
  [string]$Version = "0.0.1"
)

if (-not $DockerUser) { Write-Error "Provide -DockerUser or set DOCKERHUB_USER env var"; exit 1 }

$imageRepo = "$DockerUser/$ImageName"
if ($imageRepo -match ':') { Write-Error "Image name must not contain ':'"; exit 1 }
$fullTagLatest = "$imageRepo" + ":latest"
$fullTagVersion = "$imageRepo" + ":$Version"

Write-Host "[1/5] Building backend jar (skip tests)..." -ForegroundColor Cyan
Push-Location "$PSScriptRoot" | Out-Null
./mvnw -q -DskipTests clean package
if ($LASTEXITCODE -ne 0) { Write-Error "Maven build failed"; exit 2 }

Write-Host "[2/5] Building Docker image..." -ForegroundColor Cyan
docker build -t $fullTagLatest -t $fullTagVersion .
if ($LASTEXITCODE -ne 0) { Write-Error "Docker build failed"; exit 3 }

Write-Host "[3/5] Logging in to Docker Hub (will prompt if not already logged in)..." -ForegroundColor Cyan
try { docker info | Out-Null } catch { Write-Error "Docker daemon not running"; exit 4 }

# If not logged in, prompt (stdout suppressed)
docker login $DockerUser 2>$null | Out-Null

Write-Host "[4/5] Pushing $fullTagVersion" -ForegroundColor Cyan
docker push $fullTagVersion
if ($LASTEXITCODE -ne 0) { Write-Error "Push (version) failed"; exit 5 }

Write-Host "[5/5] Pushing $fullTagLatest" -ForegroundColor Cyan
docker push $fullTagLatest
if ($LASTEXITCODE -ne 0) { Write-Error "Push (latest) failed"; exit 6 }

Write-Host "Done. Image available as: $fullTagVersion" -ForegroundColor Green
Pop-Location | Out-Null
