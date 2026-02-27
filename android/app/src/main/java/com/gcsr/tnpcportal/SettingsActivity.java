package com.gcsr.tnpcportal;

import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebStorage;
import android.webkit.CookieManager;
import android.widget.Toast;

import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;
import androidx.biometric.BiometricManager;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.android.material.switchmaterial.SwitchMaterial;
import com.gcsr.tnpcportal.databinding.ActivitySettingsBinding;

import java.io.File;
import java.text.DecimalFormat;

public class SettingsActivity extends AppCompatActivity {

    private ActivitySettingsBinding binding;

    private static final String PREF_NAME = "tnpc_prefs";
    private static final String KEY_BIOMETRIC = "biometric_enabled";
    private static final String KEY_NOTIFICATIONS = "notifications_enabled";
    private static final String KEY_ONBOARDING_DONE = "onboarding_done";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, false);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
        window.setNavigationBarColor(android.graphics.Color.TRANSPARENT);

        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }

        binding = ActivitySettingsBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        ViewCompat.setOnApplyWindowInsetsListener(binding.getRoot(), (v, insets) -> {
            androidx.core.graphics.Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(0, 0, 0, bars.bottom);
            return insets;
        });

        SharedPreferences prefs = getSharedPreferences(PREF_NAME, MODE_PRIVATE);

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                finish();
                applyExitTransition();
            }
        });

        binding.btnBack.setOnClickListener(v -> {
            v.performHapticFeedback(android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            finish();
            applyExitTransition();
        });

        // ── Biometric Lock ──
        SwitchMaterial biometricSwitch = binding.switchBiometric;
        BiometricManager bm = BiometricManager.from(this);
        boolean canBiometric = bm.canAuthenticate(
                BiometricManager.Authenticators.BIOMETRIC_WEAK |
                BiometricManager.Authenticators.DEVICE_CREDENTIAL)
                == BiometricManager.BIOMETRIC_SUCCESS;

        biometricSwitch.setEnabled(canBiometric);
        biometricSwitch.setChecked(prefs.getBoolean(KEY_BIOMETRIC, true));
        biometricSwitch.setOnCheckedChangeListener((v, checked) -> {
            v.performHapticFeedback(android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            prefs.edit().putBoolean(KEY_BIOMETRIC, checked).apply();
        });

        // ── Notifications ──
        SwitchMaterial notifSwitch = binding.switchNotifications;
        notifSwitch.setChecked(prefs.getBoolean(KEY_NOTIFICATIONS, true));
        notifSwitch.setOnCheckedChangeListener((v, checked) -> {
            v.performHapticFeedback(android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            prefs.edit().putBoolean(KEY_NOTIFICATIONS, checked).apply();
        });

        // ── Cache Size Display ──
        updateCacheSizeDisplay();

        // ── Clear Cache ──
        binding.rowClearCache.setOnClickListener(v -> {
            v.performHapticFeedback(android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            try {
                deleteDir(getCacheDir());
                // Also clear WebView storage
                WebStorage.getInstance().deleteAllData();
                CookieManager.getInstance().removeAllCookies(null);
                CookieManager.getInstance().flush();
                updateCacheSizeDisplay();
                Toast.makeText(this, "Cache cleared ✓", Toast.LENGTH_SHORT).show();
            } catch (Exception e) {
                Toast.makeText(this, "Failed to clear cache", Toast.LENGTH_SHORT).show();
            }
        });

        // ── Rate App ──
        binding.rowRateApp.setOnClickListener(v -> {
            v.performHapticFeedback(android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            try {
                startActivity(new Intent(Intent.ACTION_VIEW,
                        Uri.parse("market://details?id=" + getPackageName())));
            } catch (android.content.ActivityNotFoundException e) {
                startActivity(new Intent(Intent.ACTION_VIEW,
                        Uri.parse("https://play.google.com/store/apps/details?id=" + getPackageName())));
            }
            Toast.makeText(this, "Thank you for your support! ⭐", Toast.LENGTH_SHORT).show();
        });

        // ── Share App ──
        binding.rowShareApp.setOnClickListener(v -> {
            v.performHapticFeedback(android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            Intent shareIntent = new Intent(Intent.ACTION_SEND);
            shareIntent.setType("text/plain");
            shareIntent.putExtra(Intent.EXTRA_SUBJECT, "TNPC Portal App");
            shareIntent.putExtra(Intent.EXTRA_TEXT,
                    "Check out the TNPC Portal app from Sri GCSR College!\n\n" +
                    "https://tnpc-portal.vercel.app");
            startActivity(Intent.createChooser(shareIntent, "Share TNPC Portal"));
        });

        // ── Reset Onboarding ──
        binding.rowResetOnboarding.setOnClickListener(v -> {
            v.performHapticFeedback(android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            prefs.edit().putBoolean(KEY_ONBOARDING_DONE, false).apply();
            Toast.makeText(this, "Onboarding will show on next launch", Toast.LENGTH_SHORT).show();
        });

        // ── Version Display ──
        try {
            String version = getPackageManager().getPackageInfo(getPackageName(), 0).versionName;
            binding.tvVersion.setText("Version " + version);
        } catch (Exception e) {
            binding.tvVersion.setText("Version 1.0");
        }
    }

    private void applyExitTransition() {
        if (Build.VERSION.SDK_INT >= 34) {
            overrideActivityTransition(OVERRIDE_TRANSITION_CLOSE, android.R.anim.fade_in, android.R.anim.fade_out);
        } else {
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        }
    }

    private void updateCacheSizeDisplay() {
        try {
            long cacheSize = getDirSize(getCacheDir());
            // Also include code cache if available
            File codeCacheDir = getCodeCacheDir();
            if (codeCacheDir.exists()) {
                cacheSize += getDirSize(codeCacheDir);
            }
            binding.tvCacheSize.setText(formatFileSize(cacheSize));
        } catch (Exception e) {
            binding.tvCacheSize.setText("Unable to calculate");
        }
    }

    private long getDirSize(File dir) {
        long size = 0;
        if (dir == null || !dir.exists()) return 0;
        File[] files = dir.listFiles();
        if (files == null) return 0;
        for (File file : files) {
            if (file.isDirectory()) {
                size += getDirSize(file);
            } else {
                size += file.length();
            }
        }
        return size;
    }

    private String formatFileSize(long bytes) {
        if (bytes <= 0) return "0 B";
        DecimalFormat df = new DecimalFormat("#.##");
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return df.format(bytes / 1024.0) + " KB";
        if (bytes < 1024 * 1024 * 1024) return df.format(bytes / (1024.0 * 1024.0)) + " MB";
        return df.format(bytes / (1024.0 * 1024.0 * 1024.0)) + " GB";
    }

    private boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            if (children != null) {
                for (String child : children) {
                    boolean success = deleteDir(new File(dir, child));
                    if (!success) return false;
                }
            }
        }
        return dir != null && dir.delete();
    }
}
