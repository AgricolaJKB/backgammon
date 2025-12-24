#!/bin/bash

# Configuration - CHANGE THESE
REMOTE_USER="root"
REMOTE_HOST="your-server.com"
REMOTE_DIR="/path/to/your/app"

echo "🔌 Establishing secure tunnel to $REMOTE_HOST..."
echo "🚀 Starting Drizzle Studio on remote server..."
echo "👉 Once started, open http://localhost:4983 in your browser"

# This command:
# 1. Creates an SSH tunnel forwarding local port 4983 to remote port 4983
# 2. Connects to the server
# 3. Changes directory to the app
# 4. Runs drizzle-kit studio
ssh -L 4983:127.0.0.1:4983 $REMOTE_USER@$REMOTE_HOST "cd $REMOTE_DIR && npm run db:studio"
