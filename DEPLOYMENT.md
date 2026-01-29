# Deployment Guide

## Automated Deployment (GitHub Actions)
The project is configured to automatically deploy to AWS EC2 whenever changes are pushed to the `main` branch.

### Prerequisites
1. **EC2 Instance**: Ubuntu server with ports 80 and 8000 open.
2. **GitHub Secrets**:
   - `EC2_HOST`: Public IP of the instance
   - `EC2_USERNAME`: `ubuntu`
   - `EC2_KEY`: Content of the `.pem` private key

### Manual Deployment
If you need to deploy manually from your local machine:
1. Ensure you have the `.pem` key file in the project root.
2. Run the deployment script:
   ```powershell
   .\deploy.ps1 -PublicIP "YOUR_EC2_IP"
   ```

## Architecture
- **Frontend**: React (served via Nginx)
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (Docker container)

## Troubleshooting
- If deployment fails on memory limits, the automated workflow builds the frontend on the GitHub runner before uploading.
- Ensure your Security Group allows inbound traffic on ports 80 (Frontend) and 8000 (Backend API).
