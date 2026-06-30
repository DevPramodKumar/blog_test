#!/bin/bash
# Fix Nginx permission denied when serving from /home/saas/app/frontend/dist
# Run once on server as root: sudo bash scripts/fix-nginx-permissions.sh

set -euo pipefail

SAAS_HOME="/home/saas"
PROJECT_PATH="/home/saas/app"
FRONTEND_DIST="/home/saas/app/frontend/dist"

if [ "$(id -u)" -ne 0 ]; then
  echo "Run as root: sudo bash scripts/fix-nginx-permissions.sh"
  exit 1
fi

echo "=== Adding www-data to saas group ==="
usermod -aG saas www-data

echo "=== Fixing directory traverse permissions ==="
chmod o+x "$SAAS_HOME"
chmod o+x "$PROJECT_PATH"
chmod o+x "/home/saas/app/frontend"

echo "=== Fixing dist read permissions ==="
if [ -d "$FRONTEND_DIST" ]; then
  chown -R saas:saas "$FRONTEND_DIST"
  chmod -R g+rX "$FRONTEND_DIST"
  chmod -R o+rX "$FRONTEND_DIST"
else
  echo "WARNING: $FRONTEND_DIST not found — run npm run build first"
fi

echo "=== Reloading Nginx ==="
nginx -t && systemctl reload nginx

echo ""
echo "Done. Test as www-data:"
echo "  sudo -u www-data cat $FRONTEND_DIST/index.html | head -1"
