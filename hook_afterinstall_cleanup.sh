#!/bin/bash
set -euo pipefail

TEMP_PROJECT_PATH="/home/saas/temp-blog-platform"

if [ -d "$TEMP_PROJECT_PATH" ]; then
  rm -rf "$TEMP_PROJECT_PATH"
  echo "Cleaned up $TEMP_PROJECT_PATH"
fi
