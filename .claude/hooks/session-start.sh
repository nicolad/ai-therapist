#!/bin/bash
set -euo pipefail

# SessionStart hook for research-thera
# Installs dependencies and generates types to prevent TypeScript errors

echo '{"async": false}'

# Install dependencies
npm install

# Generate TypeScript types from GraphQL schema
# This is critical for preventing type mismatches when schema changes
npm run codegen

echo "✓ Session startup hook completed successfully"
