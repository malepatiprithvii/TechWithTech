$GitUrl = "https://github.com/git-for-windows/git/releases/download/v2.52.0.windows.1/Git-2.52.0-64-bit.exe"
$InstallerPath = "$PWD\git-installer.exe"

Write-Host "Downloading Git installer..."
Invoke-WebRequest -Uri $GitUrl -OutFile $InstallerPath

Write-Host "Starting Git installer..."
Write-Host "Please accept the User Account Control (UAC) prompt and follow the installation steps."
Write-Host "You can keep all default settings (Just click 'Next' > 'Next' ... > 'Install')."

# Run the installer
Start-Process -FilePath $InstallerPath -Wait

Write-Host "Installation finished."
Write-Host "IMPORTANT: You may need to RESTART your terminal or IDE for the 'git' command to work."
Write-Host "After restarting, run: .\push_to_github.ps1"

# Cleanup
Remove-Item $InstallerPath -ErrorAction SilentlyContinue
