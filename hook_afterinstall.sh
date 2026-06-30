#!/bin/bash
set -euo pipefail

TEMP_PROJECT_PATH="/home/saas/temp-blog-platform"
PROJECT_PATH="/home/saas/app"
BACKEND_PATH="$PROJECT_PATH/backend"
FRONTEND_PATH="$PROJECT_PATH/frontend"
ECOSYSTEM_FILE="$PROJECT_PATH/pm2StartSaaSCommonBackend.config.js"

echo "==> Syncing files..."
mkdir -p "$PROJECT_PATH"
rsync -avh --delete \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='node_modules' \
  --exclude='frontend/dist' \
  --exclude='hook_afterinstall.sh' \
  --exclude='hook_afterinstall_cleanup.sh' \
  --exclude='appspec.yml' \
  "$TEMP_PROJECT_PATH"/ "$PROJECT_PATH/"

echo "==> Backend: npm install + PM2 start..."
cd "$BACKEND_PATH"
npm install
pm2 delete blog-backend 2>/dev/null || true
pkill -f "$BACKEND_PATH/src/server.js" 2>/dev/null || true
sleep 2
pm2 start "$ECOSYSTEM_FILE" --only blog-backend

echo "==> Frontend: npm install + build..."
cd "$FRONTEND_PATH"
npm install
npm run build

echo "==> Frontend: nginx read permissions..."
chmod o+x /home/saas /home/saas/app "$FRONTEND_PATH" 2>/dev/null || true
chmod -R o+rX "$FRONTEND_PATH/dist"

pm2 save
echo "==> Deployment complete."
