# Add project specific ProGuard rules here.
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Application
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-dontwarn android.webkit.**

# Ensure JavascriptInterfaces are not obfuscated or removed by R8
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep WebAppInterface class
-keep class com.gcsr.tnpcportal.WebAppInterface { *; }

# Firebase
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# Lottie
-dontwarn com.airbnb.lottie.**
-keep class com.airbnb.lottie.** { *; }

# Google Play In-App Review
-keep class com.google.android.play.core.** { *; }
-dontwarn com.google.android.play.core.**

# AndroidX
-keep class androidx.** { *; }
-dontwarn androidx.**

# Biometric
-keep class androidx.biometric.** { *; }

# Chrome Custom Tabs
-keep class androidx.browser.** { *; }
