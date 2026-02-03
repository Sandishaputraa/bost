@echo off
echo ===========================================
echo   BUILDING RESO & DPI TOOL APK
echo ===========================================

echo.
echo Installing dependencies...
npm install

echo.
echo Installing Capacitor...
npm install @capacitor/cli @capacitor/core @capacitor/android

if not exist "capacitor.config.json" (
    echo.
    echo Initializing Capacitor...
    npx cap init "Reso & DPI Tool" "com.resodpi.tool" .
)

echo.
echo Adding Android platform...
npx cap add android

echo.
echo Syncing files...
npx cap sync

echo.
echo Copying assets...
if not exist "android\app\src\main\res\drawable" mkdir android\app\src\main\res\drawable
xcopy assets android\app\src\main\res /E /I /Y 2>nul

echo.
echo ===========================================
echo   NEXT STEPS:
echo ===========================================
echo 1. Open Android Studio:
echo    npx cap open android
echo.
echo 2. In Android Studio:
echo    - Wait for Gradle build
echo    - Build -> Build Bundle(s) / APK(s)
echo    - Build APK(s)
echo.
echo 3. APK will be at:
echo    android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo 4. Install to device:
echo    adb install android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo ===========================================

set /p choice="Open Android Studio now? (y/n): "
if /i "%choice%"=="y" (
    npx cap open android
)