#!/bin/bash
set -e

# Add Swap if missing (prevents freezing on t3.micro)
if [ ! -f /swapfile ]; then
    echo "Creating 2GB swapfile..."
    sudo fallocate -l 2G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# Install Docker if missing
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
    sudo usermod -aG docker $USER
fi

# Install Docker Compose if missing
if ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo apt-get install -y docker-compose-v2 || sudo apt-get install -y docker-compose
fi

# Clean up old app
sudo rm -rf app
mkdir -p app

# Extract new version
echo "Extracting application..."
sudo tar -xf deploy.tar -C app
sudo chown -R ubuntu:ubuntu app

# Start services
cd app
echo "Starting Docker containers..."
sudo docker compose down || true
sudo docker compose up -d --build

# Cleanup
rm ~/deploy.tar
rm ~/setup.sh

echo "Deployment finished successfully!"
