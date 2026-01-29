$RemoteUrl = "https://github.com/malepatiprithvii/TechWithTech.git"

Write-Host "Checking for Git..."
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\Git\cmd\git.exe") {
        Write-Host "Git found at default location. Adding to PATH..."
        $env:Path = $env:Path + ";C:\Program Files\Git\cmd"
    } else {
        Write-Error "Git is not installed or not in your PATH. Please install Git for Windows (https://git-scm.com/download/win) and restart your terminal."
        exit 1
    }
}

Write-Host "Initializing Git repository..."
if (-not (Test-Path .git)) {
    git init
}

Write-Host "Adding files..."
git add .

Write-Host "Committing changes..."
git commit -m "Initial commit: Full stack FastAPI + React application"

Write-Host "Configuring remote..."
if ((git remote) -contains "origin") {
    git remote set-url origin $RemoteUrl
} else {
    git remote add origin $RemoteUrl
}

Write-Host "Pushing to GitHub..."
git branch -M main
git push -u origin main
