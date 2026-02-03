#!/bin/bash
echo "🔧 Fixing Capacitor configuration..."

# 1. Buat folder www
mkdir -p www
echo "📁 Created www folder"

# 2. Copy semua file
cp *.html *.js *.css *.json *.md www/ 2>/dev/null
echo "📋 Copied files to www/"

# 3. Update config
cat > capacitor.config.json << 'CONFIG'
{
  "appId": "com.sandishaputra.bost",
  "appName": "Bost Tool",
  "webDir": "www",
  "server": {
    "cleartext": true
  }
}
CONFIG
echo "✅ Updated capacitor.config.json"

# 4. Hapus android lama
rm -rf android/ 2>/dev/null

# 5. Initialize
npx cap init "Bost Tool" "com.sandishaputra.bost" --web-dir www

# 6. Add Android
npx cap add android

# 7. Sync
npx cap sync

echo "🎉 Done! Android project ready in: android/"
echo "📱 Build APK with Android Studio"
