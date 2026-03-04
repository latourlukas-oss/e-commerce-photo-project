#!/bin/sh
# Start Next.js dev server. Uses port 3020 to avoid conflicts with other apps on 3010.
# Run from nextjs_space directory.
set -e
cd "$(dirname "$0")/.."
PORT=3020
echo ">>> Freeing port $PORT..."
lsof -ti :$PORT | xargs kill -9 2>/dev/null || true
sleep 1
echo ">>> Starting Peoples Print at http://localhost:$PORT"
echo ""
exec npx prisma generate && PORT=$PORT npx next dev -p $PORT
