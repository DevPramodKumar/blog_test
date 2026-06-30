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

  sleep 2

  BACKEND_PORT=5000
  if [ -f "$BLOG_BACKEND_PATH/.env" ]; then
    BACKEND_PORT=$(grep -E '^PORT=' "$BLOG_BACKEND_PATH/.env" | cut -d= -f2 | tr -d '[:space:]')
    BACKEND_PORT=${BACKEND_PORT:-5000}
  fi

  if curl -sf "http://127.0.0.1:${BACKEND_PORT}/api/health" >/dev/null; then
    echo -e "${GREEN}Backend health check passed on port ${BACKEND_PORT}.${NC}"
  else
    echo -e "${RED}ERROR: Backend not responding on http://127.0.0.1:${BACKEND_PORT}/api/health${NC}"
    echo -e "${RED}Check: pm2 logs $BLOG_BACKEND_APP_NAME --lines 30${NC}"
    exit 1
  fi
}

build_frontend() {
  echo -e "${YELLOW}Building frontend (served by Nginx from dist/)...${NC}"
  cd "$BLOG_FRONTEND_PATH"
  npm install --production=false
  npm run build

  fix_nginx_permissions

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

# Nginx runs as www-data — must traverse /home/saas/... and read dist/
fix_nginx_permissions() {
  echo -e "${YELLOW}Fixing file permissions for Nginx (www-data)...${NC}"

  SAAS_HOME="/home/saas"

  if getent group saas >/dev/null 2>&1; then
    sudo usermod -aG saas www-data 2>/dev/null || true
  fi

  chmod o+x "$SAAS_HOME" 2>/dev/null || true
  chmod o+x "$PROJECT_PATH"
  chmod o+x "$BLOG_FRONTEND_PATH"

  if [ -d "$BLOG_FRONTEND_PATH/dist" ]; then
    chown -R saas:saas "$BLOG_FRONTEND_PATH/dist" 2>/dev/null || true
    chmod -R g+rX "$BLOG_FRONTEND_PATH/dist"
    chmod -R o+rX "$BLOG_FRONTEND_PATH/dist"
  else
    echo -e "${RED}WARNING: dist/ not found at $BLOG_FRONTEND_PATH/dist${NC}"
  fi

  echo -e "${GREEN}Permissions updated for Nginx static file access.${NC}"
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
