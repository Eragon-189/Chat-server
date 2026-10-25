#!/usr/bin/env bash
set -eo pipefail
read -p "What is your domain? " domain
read -p "What is your AI API key? " api
read -p "What is your AI model? " apiPro
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
sudo apt install -y gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update -y
sudo apt -y upgrade
sudo apt install -y python3
sudo apt install -y python3-dotenv
sudo apt install -y python3-websockets
cat .env << EOF
HOST=0.0.0.0
PORT=8080
API=$api
APIPRO=$apiPro
EOF
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow OpenSSH
sudo ufw enable
sudo apt install -y caddy 
sudo tee /etc/caddy/Caddyfile <<EOF
$domain {
    reverse_proxy 127.0.0.1:8080
}
EOF
sudo systemctl start caddy
sudo systemctl restart caddy
python3 server/server.py & exit

