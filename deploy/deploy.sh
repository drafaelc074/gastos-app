
#!/usr/bin/env bash
set -Eeuo pipefail

cd /home/ubuntu/gastos-app

echo "==> Checking Git working tree"
if [[ -n "$(git status --porcelain)" ]]; then
  echo "ERROR: uncommitted changes found"
  exit 1
fi

echo "==> Updating repository"
git pull --ff-only origin main

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
curl -fsS -o /dev/null http://127.0.0.1:3000/login

echo "==> Deployment successful"
git rev-parse --short HEAD
