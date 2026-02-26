# TNPC Portal — Android App

This is the Android WebView wrapper for the TNPC Portal website.

## What It Does

- Loads `https://tnpc-portal.vercel.app` in a full-screen WebView
- Shows a branded splash screen on launch
- Handles offline detection with retry
- Supports back-button navigation within the WebView
- Enables JavaScript, localStorage, cookies, and DOM storage

## How to Build

### Prerequisites

- Android Studio (latest stable version)
- Java JDK 17+

### Steps

1. Open Android Studio
2. Click **File → Open** and select the `android/` folder
3. Wait for Gradle sync to complete
4. Click ▶️ Run to test on emulator or connected device
5. To build APK: **Build → Build Bundle(s) / APK(s) → Build APK(s)**

### Set Your App Icon

1. Right-click `app/src/main/res` → **New → Image Asset**
2. Select your GCSR/TNPC logo
3. Click **Next → Finish**

## Project Structure

```
android/
├── app/
│   ├── build.gradle                          ← App dependencies
│   └── src/main/
│       ├── AndroidManifest.xml               ← Permissions & activities
│       ├── java/com/gcsr/tnpcportal/
│       │   ├── MainActivity.java             ← WebView logic
│       │   └── SplashActivity.java           ← Splash screen
│       └── res/
│           ├── layout/
│           │   ├── activity_main.xml         ← WebView + offline UI
│           │   └── activity_splash.xml       ← Splash layout
│           └── values/
│               ├── colors.xml                ← Brand colors
│               ├── strings.xml               ← App name
│               └── themes.xml                ← App theme
├── build.gradle                              ← Root Gradle config
├── settings.gradle                           ← Project settings
└── gradle/wrapper/
    └── gradle-wrapper.properties             ← Gradle version
```
