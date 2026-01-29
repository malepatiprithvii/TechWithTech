$ErrorActionPreference = "Stop"

Write-Host "Checking for any remaining uncommitted changes..." -ForegroundColor Cyan

# Add all changes (including previous fixes for login, branding, and workflow)
git add .

# Commit if there are changes
if ((git status --porcelain) -ne $null) {
    Write-Host "Committing remaining changes..." -ForegroundColor Yellow
    git commit -m "Final sync: Update login logic, branding, and workflow"
} else {
    Write-Host "No new changes to commit." -ForegroundColor Green
}

# Push everything
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push

Write-Host "All changes are now on GitHub!" -ForegroundColor Green
