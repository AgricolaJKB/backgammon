#!/bin/bash
# SCRIPT TO START ON PRODUCTION SERVER

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/.."

# Navigate to project root
cd "$PROJECT_ROOT"
echo "🚀 Starting production server..."

npm run preview