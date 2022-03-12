#!/bin/bash
PROJECT_NAME="melody"
HOST="melody"
FRONTEND_DIR="/var/www/html/public"

echo "Uploading"
rsync --files-from=rsync-files -r --delete . $HOST:$FRONTEND_DIR || exit 2

# echo "Restarting process"
# ssh $HOST pm2 reload frontend || exit 4
# ssh $HOST pm2 reload backend || exit 4

echo "DONE"