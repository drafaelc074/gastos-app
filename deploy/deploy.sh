
#!/usr/bin/env bash
set -Eeuo pipefail

cd /home/ubuntu/gastos-app

echo "==> Checking Git working tree"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: uncommitted changes found"
  exit 1
fi


echo "==> Updating repository"

DEPLOY_SHA="${1:-}"

if [[ ! "$DEPLOY_SHA" =~ ^[0-9a-fA-F]{40}$ ]]; then
  echo "ERROR: Valid 40-character commit SHA required"
  exit 1
fi

git fetch origin main

# Garantir que estamos implantando o commit atual da main
CURRENT_MAIN_SHA="$(git rev-parse origin/main)"

if [[ "$DEPLOY_SHA" != "$CURRENT_MAIN_SHA" ]]; then
  echo "ERROR: Deployment skipped."
  echo "Requested: $DEPLOY_SHA"
  echo "Current main: $CURRENT_MAIN_SHA"
  exit 1
fi

# Implantar exatamente o commit aprovado
git checkout --detach "$DEPLOY_SHA"

echo "==> Deploying commit: $DEPLOY_SHA"


echo "==> Starting Docker services"
docker compose up -d --build

echo "==> Checking backend health"
for i in $(seq 1 30); do
  if curl -fsS http://127.0.0.1:8000/health >/dev/null; then
    echo "Backend healthy"
    break
  fi

  if [[ "$i" -eq 30 ]]; then
    echo "ERROR: Backend healthcheck failed"
    exit 1
  fi

  sleep 2
done


echo "==> Checking frontend"

FRONTEND_READY=false

for i in $(seq 1 30); do
  if curl -fsS --max-time 5 \
    http://127.0.0.1:3000/login > /dev/null; then
    FRONTEND_READY=true
    echo "Frontend healthy"
    break
  fi

  sleep 2
done

if [[ "$FRONTEND_READY" != "true" ]]; then
  echo "ERROR: Frontend healthcheck failed"
  exit 1
fi


echo "==> Deployment successful"
git rev-parse --short HEAD
