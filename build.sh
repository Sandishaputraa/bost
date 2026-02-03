#!/bin/bash

echo "==========================================="
echo "  BUILD & DEPLOY RESO DPI TOOL"
echo "==========================================="

# Update files
echo ""
echo "📦 Updating repository files..."
cp manifest.json service-worker.js package.json capacitor.config.json README.md ../

# Create icons folder
mkdir -p icons
echo "✅ Created icons folder"

# Initialize npm if not exists
if [ ! -f "package-lock.json" ]; then
    echo ""
    echo "📦 Initializing npm..."
    npm init -y
fi

# Install gh-pages for GitHub Pages
echo ""
echo "📦 Installing gh-pages..."
npm install gh-pages --save-dev

# Deploy to GitHub Pages
echo ""
echo "🚀 Deploying to GitHub Pages..."
npx gh-pages -d . -b gh-pages

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🌐 GitHub Pages URL:"
echo "https://sandishaputraa.github.io/bost/"
echo ""
echo "📱 PWA ready for installation!"
echo ""
echo "🔧 For APK build, follow instructions in README.md"