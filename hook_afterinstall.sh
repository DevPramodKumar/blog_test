#!/bin/bash
set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m'

# Must match appspec.yml destination
TEMP_PROJECT_PATH="/home/saas/temp-blog-platform"
PROJECT_PATH="/home/saas/app"
BLOG_BACKEND_PATH="$PROJECT_PATH/blog-backend"
BLOG_FRONTEND_PATH="$PROJECT_PATH/blog-frontend"
ECOSYSTEM_FILE="$PROJECT_PATH/blog-backend/pm2StartBlogPlatform.config.js"
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

deploy_frontend() {
  echo -e "${YELLOW}Deploying frontend...${NC}"
  cd "$BLOG_FRONTEND_PATH"
  npm install --production=false
  npm run build

  if pm2 describe "$BLOG_FRONTEND_APP_NAME" >/dev/null 2>&1; then
    echo -e "${YELLOW}Reloading $BLOG_FRONTEND_APP_NAME...${NC}"
    pm2 reload "$BLOG_FRONTEND_APP_NAME" --update-env
  else
    echo -e "${YELLOW}Starting $BLOG_FRONTEND_APP_NAME...${NC}"
    pm2 start "$ECOSYSTEM_FILE" --only "$BLOG_FRONTEND_APP_NAME"
  fi
}

if [ -d "$BLOG_BACKEND_PATH" ]; then
  deploy_backend
else
  echo -e "${RED}WARNING: Backend path not found: $BLOG_BACKEND_PATH${NC}"
fi

if [ -d "$BLOG_FRONTEND_PATH" ]; then
  deploy_frontend
else
  echo -e "${RED}WARNING: Frontend path not found: $BLOG_FRONTEND_PATH${NC}"
fi

pm2 save

echo -e "${GREEN}************** Deployment Complete **************${NC}"
