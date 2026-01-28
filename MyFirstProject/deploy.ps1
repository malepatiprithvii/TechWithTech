param(
    [Parameter(Mandatory=$true)]
    [string]$PublicIP,
    [string]$KeyFile = "frontend.pem",
    [string]$User = "ubuntu"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $KeyFile)) {
    Write-Error "Key file '$KeyFile' not found in current directory."
    exit 1
}

Write-Host "1. Preparing deployment package (skipping node_modules, .git)..." -ForegroundColor Cyan
# Create a tar.gz archive excluding heavy folders
# Windows 10/11 comes with tar.exe
try {
    tar --exclude "node_modules" --exclude ".git" --exclude "__pycache__" --exclude "venv" --exclude "deploy.tar.gz" -czf deploy.tar.gz .
}
catch {
    Write-Error "Failed to create archive. Ensure 'tar' is available or node_modules are ignored."
    exit 1
}

Write-Host "2. Uploading to AWS ($PublicIP)..." -ForegroundColor Cyan
# Strict host key checking disabled to avoid "Are you sure?" prompt blocking script
$SSH_OPTS = "-o StrictHostKeyChecking=no -i ""$KeyFile"""

try {
    scp -o StrictHostKeyChecking=no -i "$KeyFile" deploy.tar.gz "$User@$($PublicIP):~/"
}
catch {
    Write-Error "Failed to upload file. Check your IP address and ensure the Key File permissions are correct."
    Write-Host "On Windows, you might need to fix key permissions manually if this fails."
    exit 1
}

Write-Host "3. Deploying on Remote Server..." -ForegroundColor Cyan
$RemoteCommands = "
    # Install Docker if not exists
    if ! command -v docker &> /dev/null; then
        echo 'Installing Docker...'
        sudo apt-get update
        sudo apt-get install -y docker.io docker-compose
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -aG docker $USER
    fi

    # Unzip and Deploy
    echo 'Extracting files...'
    mkdir -p app
    tar -xzf deploy.tar.gz -C app
    cd app

    echo 'Setting API URL...'
    export REACT_APP_API_URL=http://$PublicIP:8000

    echo 'Building and Starting Containers...'
    # Use docker compose v2 without sudo (assuming user is in docker group)
    docker compose down
    docker compose up -d --build

    echo 'Deployment Complete!'
"

ssh -o StrictHostKeyChecking=no -i "$KeyFile" "$User@$PublicIP" $RemoteCommands

Write-Host "`nSUCCESS! Your app should be live at:" -ForegroundColor Green
Write-Host "Frontend: http://$PublicIP" -ForegroundColor Green
Write-Host "Backend:  http://$PublicIP:8000/docs" -ForegroundColor Green

Remove-Item deploy.tar.gz -ErrorAction SilentlyContinue
