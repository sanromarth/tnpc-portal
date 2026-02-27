package com.gcsr.tnpcportal;

import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
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
            try {
                Intent intent = new Intent(activity, SettingsActivity.class);
                activity.startActivity(intent);
            } catch (Exception e) {
                // Swallow — prevents crash if activity can't start
            }
        });
    }

    @JavascriptInterface
    public void hapticFeedback() {
        activity.runOnUiThread(() -> {
            try {
                activity.getWindow().getDecorView().performHapticFeedback(
                        android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            } catch (Exception ignored) {}
        });
    }

    @JavascriptInterface
    public boolean isAppInstalled() {
        return true;
    }

    /**
     * Returns the current network connection type: "wifi", "cellular", "ethernet", or "none".
     */
    @JavascriptInterface
    public String getConnectionType() {
        try {
            ConnectivityManager cm = (ConnectivityManager)
                    activity.getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
            Network network = cm.getActiveNetwork();
            if (network == null) return "none";
            NetworkCapabilities caps = cm.getNetworkCapabilities(network);
            if (caps == null) return "none";
            if (caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)) return "wifi";
            if (caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)) return "cellular";
            if (caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)) return "ethernet";
            return "none";
        } catch (Exception e) {
            return "none";
        }
    }

    /**
     * Check if the device currently has an active internet connection.
     */
    @JavascriptInterface
    public boolean isOnline() {
        try {
            ConnectivityManager cm = (ConnectivityManager)
                    activity.getSystemService(android.content.Context.CONNECTIVITY_SERVICE);
            Network network = cm.getActiveNetwork();
            if (network == null) return false;
            NetworkCapabilities caps = cm.getNetworkCapabilities(network);
            return caps != null && caps.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
        } catch (Exception e) {
            return false;
        }
    }
}
