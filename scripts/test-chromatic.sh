#!/bin/bash

# Test script for Chromatic setup
echo "🧪 Testing Chromatic setup..."

# Check if CHROMATIC_PROJECT_TOKEN is set
if [ -z "$CHROMATIC_PROJECT_TOKEN" ]; then
    echo "❌ CHROMATIC_PROJECT_TOKEN environment variable is not set"
    echo "Please set it with: export CHROMATIC_PROJECT_TOKEN=your_token_here"
    exit 1
fi

# Build Storybook
echo "📦 Building Storybook..."
npm run build-storybook

if [ $? -ne 0 ]; then
    echo "❌ Storybook build failed"
    exit 1
fi

echo "✅ Storybook built successfully"

# Test Chromatic (dry run)
echo "🔍 Testing Chromatic configuration..."
npx chromatic --dry-run --project-token $CHROMATIC_PROJECT_TOKEN

if [ $? -eq 0 ]; then
    echo "✅ Chromatic configuration is valid"
else
    echo "❌ Chromatic configuration has issues"
    exit 1
fi

echo "🎉 All tests passed! Your Chromatic setup is ready." 