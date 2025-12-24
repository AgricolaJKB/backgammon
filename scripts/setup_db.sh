#!/bin/bash
set -e

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

# Navigate to project root
cd "$PROJECT_ROOT"

echo "📂 Setting up database..."

# Create db directory
if [ ! -d "db" ]; then
    mkdir -p db
    echo "✅ Created db/ directory"
else
    echo "ℹ️  db/ directory already exists"
fi

# Run migrations/push
echo "🚀 Pushing schema to database..."
npm run db:push

echo "✅ Database setup complete!"
