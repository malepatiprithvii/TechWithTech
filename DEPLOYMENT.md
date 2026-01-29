# Deployment Guide for AWS EC2

This guide will help you deploy your full-stack application (FastAPI + React + PostgreSQL) to an AWS EC2 instance using the provided automation script.

## Prerequisites
1.  **AWS Instance**: You should have an EC2 instance running (Ubuntu 22.04 recommended).
2.  **Key File**: Ensure `frontend.pem` is in this project folder.
3.  **Public IP**: Copy the Public IPv4 address of your instance from the AWS Console.

## Automated Deployment (Recommended)

I have created a PowerShell script `deploy.ps1` that handles everything for you:
1.  Zips your code (ignoring `node_modules`).
2.  Uploads it to your server.
3.  Installs Docker (if missing).
4.  Starts your application.

### How to Run
Open a PowerShell terminal in this folder and run:

```powershell
./deploy.ps1 -PublicIP <YOUR_INSTANCE_IP>
```

*Example:*
```powershell
./deploy.ps1 -PublicIP 54.123.45.67
```

**Note on Key Permissions:**
If you get a "Permission denied" or "Unprotected private key file" error, you need to restrict access to `frontend.pem`.
On Windows, you can run these commands in PowerShell to fix it:

```powershell
# Reset permissions
icacls frontend.pem /reset
# Grant read access to current user only
icacls frontend.pem /grant:r "$($env:USERNAME):R"
# Remove inheritance
icacls frontend.pem /inheritance:r
```

## Manual Deployment

If the script doesn't work for you, follow these manual steps:

1.  **Connect to your Instance**:
    ```bash
    ssh -i "frontend.pem" ubuntu@<YOUR-IP>
    ```

2.  **Install Docker**:
    ```bash
    sudo apt-get update
    sudo apt-get install -y docker.io docker-compose
    sudo usermod -aG docker $USER
    # You might need to exit and reconnect
    ```

3.  **Transfer Files**:
    Use SCP to upload your files (zip them first to save time).
    ```powershell
    scp -i "frontend.pem" deploy.tar.gz ubuntu@<YOUR-IP>:~/
    ```

4.  **Run Application**:
    ```bash
    tar -xzf deploy.tar.gz
    export REACT_APP_API_URL=http://<YOUR-IP>:8000
    docker-compose up -d --build
    ```
