## **7. Buat script build otomatis:**

**build-apk.sh:**
```bash
#!/bin/bash

echo "==========================================="
echo "  BUILDING RESO & DPI TOOL APK"
echo "==========================================="

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Install Capacitor
echo ""
echo "⚡ Installing Capacitor..."
npm install @capacitor/cli @capacitor/core @capacitor/android

# Initialize if not exists
if [ ! -f "capacitor.config.json" ]; then
    echo ""
    echo "🚀 Initializing Capacitor..."
    npx cap init "Reso & DPI Tool" "com.resodpi.tool" .
fi

# Add Android platform
echo ""
echo "🤖 Adding Android platform..."
npx cap add android

# Sync files
echo ""
echo "🔄 Syncing files..."
npx cap sync

# Copy assets
echo ""
echo "🎨 Copying assets..."
mkdir -p android/app/src/main/res/drawable
cp -r assets/* android/app/src/main/res/ 2>/dev/null || true

# Open in Android Studio
echo ""
echo "🔧 Opening in Android Studio..."
echo ""
echo "==========================================="
echo "  NEXT STEPS:"
echo "==========================================="
echo "1. Di Android Studio:"
echo "   - Tunggu Gradle build selesai"
echo "   - Pilih Build → Build Bundle(s) / APK(s)"
echo "   - Pilih Build APK(s)"
echo ""
echo "2. APK akan ada di:"
echo "   android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "3. Install ke device:"
echo "   adb install android/app/build/outputs/apk/debug/app-debug.apk"
echo ""
echo "==========================================="

# Ask to open Android Studio
read -p "Open Android Studio now? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npx cap open android
fi