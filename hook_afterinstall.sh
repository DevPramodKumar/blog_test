#!/bin/bash
set -euo pipefail

# === Color codes ===
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

TEMP_PROJECT_PATH="/home/saas/temp-saas-common-backend"
PROJECT_PATH="/home/saas/app"
BLOG_BACKEND_PATH="$PROJECT_PATH/blog-backend"
BLOG_FRONTEND_PATH="$PROJECT_PATH/blog-frontend"
ECOSYSTEM_FILE="/home/saas/app/saas-common-backend/pm2StartSaaSCommonBackend.config.js"
BLOG_BACKEND_APP_NAME="blog-backend"
BLOG_FRONTEND_APP_NAME="blog-frontend"

echo -e "${YELLOW}************** Backend Deployment Start **************${NC}"

rsync -avh --delete \
  --exclude='.git' \
  --exclude='.env' \
  --exclude='hook_afterinstall.sh' \
  --exclude='hook_afterinstall_cleanup.sh' \
  --exclude='appspec.yml' \
  --exclude='node_modules' \
  "$TEMP_PROJECT_PATH"/ "$PROJECT_PATH/"

if find "$SCHOOL_BACKEND_PATH/" -type f \
   -not -path "*/node_modules/*" \
   -not -path "*/yarn.lock" \
   -daystart -mtime 0 | grep -q .; then

    cd "$SCHOOL_BACKEND_PATH/"

    yarn

    cd "$PROJECT_PATH/"

    if pm2 status "$SCHOOL_BACKEND_APP_NAME" | grep -q "online"; then
        echo -e "${YELLOW}♻️ '$SCHOOL_BACKEND_APP_NAME' is running. Reloading...${NC}"
        pm2 reload "$SCHOOL_BACKEND_APP_NAME"
    else
        echo -e "${YELLOW}🚀 '$SCHOOL_BACKEND_APP_NAME' is not running. Starting...${NC}"
        pm2 start "$ECOSYSTEM_FILE" --only "$SCHOOL_BACKEND_APP_NAME"
        pm2 save
    fi
fi

if find "$ONBOARDING_BACKEND_PATH/" -type f \
   -not -path "*/node_modules/*" \
   -not -path "*/yarn.lock" \
   -daystart -mtime 0 | grep -q .; then

    cd "$ONBOARDING_BACKEND_PATH/"

    yarn

    cd "$PROJECT_PATH/"

    if pm2 status "$ONBOARDING_BACKEND_APP_NAME" | grep -q "online"; then
        echo -e "${YELLOW}♻️ '$ONBOARDING_BACKEND_APP_NAME' is running. Reloading...${NC}"
        pm2 reload "$ONBOARDING_BACKEND_APP_NAME"
    else
        echo -e "${YELLOW}🚀 '$ONBOARDING_BACKEND_APP_NAME' is not running. Starting...${NC}"
        pm2 start "$ECOSYSTEM_FILE" --only "$ONBOARDING_BACKEND_APP_NAME"
        pm2 save
    fi
fi

if find "$INVENTORY_BACKEND_PATH/" -type f \
   -not -path "*/node_modules/*" \
   -not -path "*/yarn.lock" \
   -daystart -mtime 0 | grep -q .; then

    cd "$INVENTORY_BACKEND_PATH/"

    yarn
    yarn db:migrate || echo -e "${YELLOW}⚠️ db:migrate failed (check DATABASE_URL)${NC}"

    cd "$PROJECT_PATH/"
    if pm2 status "$INVENTORY_BACKEND_APP_NAME" | grep -q "online"; then
        echo -e "${YELLOW}♻️ '$INVENTORY_BACKEND_APP_NAME' is running. Reloading...${NC}"
        pm2 reload "$INVENTORY_BACKEND_APP_NAME"
    else
        echo -e "${YELLOW}🚀 '$INVENTORY_BACKEND_APP_NAME' is not running. Starting...${NC}"
        pm2 start "$ECOSYSTEM_FILE" --only "$INVENTORY_BACKEND_APP_NAME"
        pm2 save
    fi
fi
