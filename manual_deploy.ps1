$ErrorActionPreference = "Stop"

# Configuration
$pemFile = "C:\Users\charv\OneDrive\Desktop\MyFirstProject\NewPair.pem"
$hostIp = "98.130.120.50"
$user = "ubuntu"

Write-Host "1. Checking prerequisites..." -ForegroundColor Cyan
if (-not (Test-Path $pemFile)) {
    Write-Error "Key file not found at $pemFile"
}

Write-Host "2. Building Frontend..." -ForegroundColor Cyan
Set-Location frontend
$env:CI = "false"
$env:REACT_APP_API_URL = "http://${hostIp}:8000"
cmd /c "npm install"
cmd /c "npm run build"
if ($LASTEXITCODE -ne 0) { Write-Error "Frontend build failed"; exit 1 }
Set-Location ..

Write-Host "3. Creating deployment package..." -ForegroundColor Cyan
# Use tar without compression to avoid gzip issues
$tarPath = "C:\Program Files\Git\usr\bin\tar.exe"
if (-not (Test-Path $tarPath)) {
    $tarPath = "tar"
}
# Create uncompressed tar
& $tarPath --exclude='node_modules' --exclude='.git' --exclude='.github' -cf deploy.tar .

Write-Host "4. Uploading to Server..." -ForegroundColor Cyan
$sshArgs = @("-i", $pemFile, "-o", "StrictHostKeyChecking=no")

# Upload tar
Write-Host "Uploading deploy.tar..."
& scp @sshArgs deploy.tar "${user}@${hostIp}:~/deploy.tar"
if ($LASTEXITCODE -ne 0) { Write-Error "SCP deploy.tar failed"; exit 1 }

# Upload setup script
Write-Host "Uploading setup.sh..."
& scp @sshArgs setup.sh "${user}@${hostIp}:~/setup.sh"
if ($LASTEXITCODE -ne 0) { Write-Error "SCP setup.sh failed"; exit 1 }

Write-Host "5. Executing Remote Setup..." -ForegroundColor Cyan
& ssh @sshArgs "${user}@${hostIp}" "chmod +x ~/setup.sh && ~/setup.sh"

Write-Host "Deployment Complete! Check http://${hostIp}" -ForegroundColor Green
