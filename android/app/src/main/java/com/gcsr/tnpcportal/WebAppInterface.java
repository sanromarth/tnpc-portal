package com.gcsr.tnpcportal;

import android.content.Intent;
import android.webkit.JavascriptInterface;

public class WebAppInterface {

    private final MainActivity activity;

    WebAppInterface(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void shareCurrentPage(String title, String url) {
        activity.runOnUiThread(() -> activity.shareContent(title, url));
    }

    @JavascriptInterface
    public String getAppVersion() {
        try {
            return activity.getPackageManager().getPackageInfo(activity.getPackageName(), 0).versionName;
        } catch (Exception e) {
            return "1.0";
        }
    }

    @JavascriptInterface
    public void requestReview() {
        activity.runOnUiThread(activity::requestInAppReview);
    }

    @JavascriptInterface
    public void showToast(String message) {
        activity.runOnUiThread(() -> {
            android.widget.Toast.makeText(activity, message,
                    android.widget.Toast.LENGTH_SHORT).show();
        });
    }

    @JavascriptInterface
    public void openSettings() {
        activity.runOnUiThread(() -> {
            Intent intent = new Intent(activity, SettingsActivity.class);
            activity.startActivity(intent);
        });
    }

    @JavascriptInterface
    public void hapticFeedback() {
        activity.runOnUiThread(() -> {
            activity.getWindow().getDecorView().performHapticFeedback(
                    android.view.HapticFeedbackConstants.CONTEXT_CLICK);
        });
    }

    @JavascriptInterface
    public boolean isAppInstalled() {
        return true;
    }
}

