#!/bin/bash

# Storybook Fix - Apply Script
# This script applies all fixes for Storybook build errors

set -e  # Exit on error

echo "🔧 Applying Storybook Fixes..."
echo ""

# Step 1: Verify Node.js version
echo "Step 1: Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "Current Node.js version: $NODE_VERSION"

if [[ $NODE_VERSION == v18.* ]] || [[ $NODE_VERSION == v20.* ]]; then
    echo "✅ Node.js version is compatible"
else
    echo "⚠️  WARNING: Node.js $NODE_VERSION may not be fully compatible"
    echo "   Recommended: Node.js 18 LTS (18.20.3) or Node.js 20 LTS"
    echo ""
    echo "   To switch (if using nvm):"
    echo "   nvm install 18.20.3"
    echo "   nvm use 18.20.3"
    echo ""
    read -p "   Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# Step 2: Clean existing installations
echo "Step 2: Cleaning existing node_modules..."
echo "Removing node_modules directories..."
rm -rf node_modules
rm -rf apps/storybook/node_modules
rm -rf packages/button/node_modules
rm -rf packages/card/node_modules

echo "Removing pnpm-lock.yaml..."
rm -rf pnpm-lock.yaml

echo "✅ Clean complete"
echo ""

# Step 3: Reinstall dependencies
echo "Step 3: Installing dependencies with new configuration..."
echo "This may take a few minutes..."
pnpm install

echo "✅ Dependencies installed"
echo ""

# Step 4: Verify installation
echo "Step 4: Verifying installation..."

# Check if scheduler is installed
if [ -d "node_modules/scheduler" ]; then
    echo "✅ scheduler dependency found"
else
    echo "❌ scheduler dependency not found"
    exit 1
fi

# Check if storybook is installed
if [ -d "node_modules/storybook" ]; then
    echo "✅ storybook dependency found"
else
    echo "❌ storybook dependency not found"
    exit 1
fi

echo ""

# Step 5: Display next steps
echo "🎉 Storybook fixes applied successfully!"
echo ""
echo "Next steps:"
echo ""
echo "1. Start Storybook:"
echo "   pnpm storybook"
echo ""
echo "2. Or build packages first (optional):"
echo "   pnpm build"
echo "   pnpm storybook"
echo ""
echo "3. Test hot reload:"
echo "   - Edit packages/button/src/Button.tsx"
echo "   - Changes should appear instantly"
echo ""
echo "4. Build static Storybook (optional):"
echo "   pnpm build:storybook"
echo ""
echo "For troubleshooting, see: STORYBOOK-FIX.md"
