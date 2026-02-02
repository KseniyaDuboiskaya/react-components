#!/bin/bash

# Restart Storybook with HMR Fix
# This script clears caches and restarts Storybook to enable hot reload

set -e

echo "🔥 Restarting Storybook with HMR enabled..."
echo ""

# Step 1: Kill existing Storybook
echo "Step 1: Checking for running Storybook processes..."
if lsof -i :6006 > /dev/null 2>&1; then
    echo "Found Storybook running on port 6006"
    echo "Killing process..."
    lsof -ti :6006 | xargs kill -9 2>/dev/null || true
    echo "✅ Process killed"
else
    echo "No Storybook process running on port 6006"
fi
echo ""

# Step 2: Clear Vite caches
echo "Step 2: Clearing Vite caches..."

if [ -d "node_modules/.vite" ]; then
    echo "Removing node_modules/.vite"
    rm -rf node_modules/.vite
fi

if [ -d "node_modules/.vite-storybook" ]; then
    echo "Removing node_modules/.vite-storybook"
    rm -rf node_modules/.vite-storybook
fi

if [ -d "apps/storybook/node_modules/.vite" ]; then
    echo "Removing apps/storybook/node_modules/.vite"
    rm -rf apps/storybook/node_modules/.vite
fi

if [ -d ".storybook-cache" ]; then
    echo "Removing .storybook-cache"
    rm -rf .storybook-cache
fi

echo "✅ Caches cleared"
echo ""

# Step 3: Verify configuration
echo "Step 3: Verifying configuration files..."

if [ ! -f ".npmrc" ]; then
    echo "⚠️  WARNING: .npmrc not found"
    echo "   HMR may not work correctly without proper pnpm hoisting"
else
    echo "✅ .npmrc found"
fi

if [ ! -f "apps/storybook/.storybook/main.ts" ]; then
    echo "❌ ERROR: .storybook/main.ts not found"
    exit 1
else
    echo "✅ .storybook/main.ts found"
fi

echo ""

# Step 4: Start Storybook
echo "Step 4: Starting Storybook..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Storybook will open at http://localhost:6006"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🔥 Hot reload is now enabled!"
echo ""
echo "Test it:"
echo "  1. Edit packages/button/src/Button.tsx"
echo "  2. Changes should appear instantly (~100ms)"
echo ""
echo "Press Ctrl+C to stop Storybook"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Storybook
pnpm storybook
