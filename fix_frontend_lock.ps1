$ErrorActionPreference = "Stop"

Write-Host "Step 1: Navigating to frontend directory..." -ForegroundColor Cyan
Push-Location frontend

Write-Host "Step 2: Cleaning up existing dependencies..." -ForegroundColor Cyan
# Remove node_modules if it exists
if (Test-Path "node_modules") {
    Write-Host "  Deleting node_modules folder (this may take a moment)..."
    # Using cmd /c rmdir for faster deletion on Windows compared to Remove-Item
    cmd /c "rmdir /s /q node_modules"
}

# Remove package-lock.json if it exists
if (Test-Path "package-lock.json") {
    Write-Host "  Deleting package-lock.json..."
    Remove-Item -Path "package-lock.json" -Force
}

Write-Host "Step 3: Regenerating lockfile (npm install)..." -ForegroundColor Cyan
npm install

Write-Host "Step 4: Returning to project root..." -ForegroundColor Cyan
Pop-Location

Write-Host "Step 5: Committing and pushing changes..." -ForegroundColor Cyan
# Check if there are changes to commit
if ((git status --porcelain frontend/package-lock.json) -ne $null) {
    git add frontend/package-lock.json
    git commit -m "Fix frontend lockfile sync for CI"
    git push
    Write-Host "Success! Frontend lockfile has been refreshed and pushed." -ForegroundColor Green
} else {
    Write-Host "No changes detected in package-lock.json. Nothing to push." -ForegroundColor Yellow
}
