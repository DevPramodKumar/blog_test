#!/bin/bash
set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Must match appspec.yml destination
TEMP_PROJECT_PATH="/home/saas/temp-blog-platform"
PROJECT_PATH="/home/saas/app"
BLOG_BACKEND_PATH="$PROJECT_PATH/backend"
BLOG_FRONTEND_PATH="$PROJECT_PATH/frontend"
ECOSYSTEM_FILE="$PROJECT_PATH/pm2StartSaaSCommonBackend.config.js"
BLOG_BACKEND_APP_NAME="blog-backend"
BLOG_FRONTEND_APP_NAME="blog-frontend"

echo -e "${YELLOW}************** Blog Platform Deployment Start **************${NC}"

if [ ! -d "$TEMP_PROJECT_PATH" ]; then
  echo -e "${RED}ERROR: Temp deploy path not found: $TEMP_PROJECT_PATH${NC}"
  exit 1
fi

mkdir -p "$PROJECT_PATH"

echo -e "${YELLOW}Syncing files from $TEMP_PROJECT_PATH to $PROJECT_PATH ...${NC}"
rsync -avh --delete \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='node_modules' \
  --exclude='frontend/dist' \
  --exclude='hook_afterinstall.sh' \
  --exclude='hook_afterinstall_cleanup.sh' \
  --exclude='appspec.yml' \
  "$TEMP_PROJECT_PATH"/ "$PROJECT_PATH/"

echo -e "${GREEN}Rsync completed successfully.${NC}"

deploy_backend() {
  echo -e "${YELLOW}Deploying backend...${NC}"
  cd "$BLOG_BACKEND_PATH"
  npm install --production=false

  if pm2 describe "$BLOG_BACKEND_APP_NAME" >/dev/null 2>&1; then
    echo -e "${YELLOW}Reloading $BLOG_BACKEND_APP_NAME...${NC}"
    pm2 reload "$BLOG_BACKEND_APP_NAME" --update-env
  else
    echo -e "${YELLOW}Starting $BLOG_BACKEND_APP_NAME...${NC}"
    pm2 start "$ECOSYSTEM_FILE" --only "$BLOG_BACKEND_APP_NAME"
  fi
}

build_frontend() {
  echo -e "${YELLOW}Building frontend (served by Nginx from dist/)...${NC}"
  cd "$BLOG_FRONTEND_PATH"
  npm install --production=false
  npm run build

  # Frontend is NOT run on PM2 — Nginx serves /home/saas/app/frontend/dist
  if pm2 describe "$BLOG_FRONTEND_APP_NAME" >/dev/null 2>&1; then
    echo -e "${YELLOW}Removing $BLOG_FRONTEND_APP_NAME from PM2 (Nginx serves static build)...${NC}"
    pm2 delete "$BLOG_FRONTEND_APP_NAME"
  fi

  echo -e "${GREEN}Frontend build ready at $BLOG_FRONTEND_PATH/dist${NC}"

  if command -v nginx >/dev/null 2>&1; then
    if sudo -n nginx -t >/dev/null 2>&1; then
      sudo nginx -s reload
      echo -e "${GREEN}Nginx reloaded.${NC}"
    else
      echo -e "${YELLOW}Run manually: sudo nginx -t && sudo systemctl reload nginx${NC}"
    fi
  fi
}

if [ -d "$BLOG_BACKEND_PATH" ]; then
  deploy_backend
else
  echo -e "${RED}WARNING: Backend path not found: $BLOG_BACKEND_PATH${NC}"
fi

if [ -d "$BLOG_FRONTEND_PATH" ]; then
  build_frontend
else
  echo -e "${RED}WARNING: Frontend path not found: $BLOG_FRONTEND_PATH${NC}"
fi

pm2 save

echo -e "${GREEN}************** Deployment Complete **************${NC}"
