package com.gcsr.tnpcportal;

import android.Manifest;
import android.app.AlertDialog;
import android.app.DownloadManager;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.view.HapticFeedbackConstants;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.webkit.CookieManager;
import android.webkit.DownloadListener;
import android.webkit.GeolocationPermissions;
import android.webkit.SslErrorHandler;
import android.net.http.SslError;
import android.webkit.URLUtil;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gms.tasks.Task;
import com.google.android.play.core.review.ReviewInfo;
import com.google.android.play.core.review.ReviewManager;
import com.google.android.play.core.review.ReviewManagerFactory;

import android.animation.ObjectAnimator;
import android.animation.AnimatorSet;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.activity.OnBackPressedCallback;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.browser.customtabs.CustomTabsIntent;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import com.google.android.material.snackbar.Snackbar;
import com.gcsr.tnpcportal.databinding.ActivityMainBinding;

import java.util.concurrent.Executor;

public class MainActivity extends AppCompatActivity {

    private static final String WEBSITE_URL = "https://tnpc-portal.vercel.app";
    private static final int NOTIFICATION_PERMISSION_CODE = 1001;
    private static final String PREF_NAME = "tnpc_prefs";
    private static final String KEY_BIOMETRIC = "biometric_enabled";
    private static final int LOADING_TIMEOUT_MS = 15000;

    private ActivityMainBinding binding;
    private WebView webView;
    private ProgressBar progressBar;
    private RelativeLayout loadingLayout;
    private RelativeLayout offlineLayout;
    private SwipeRefreshLayout swipeRefresh;
    private TextView loadingPercentText;
    private boolean isFirstLoad = true;
    private boolean isAuthenticated = false;
    private Handler timeoutHandler;
    private Snackbar connectivitySnackbar;
    private AnimatorSet loadingAnimSet;

    private ValueCallback<Uri[]> fileUploadCallback;
    private ConnectivityManager.NetworkCallback networkCallback;

    private final ActivityResultLauncher<Intent> fileChooserLauncher =
            registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
                if (fileUploadCallback == null) return;

                Uri[] results = null;
                if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                    Intent data = result.getData();
                    String dataString = data.getDataString();
                    if (data.getClipData() != null) {
                        int count = data.getClipData().getItemCount();
                        results = new Uri[count];
                        for (int i = 0; i < count; i++) {
                            results[i] = data.getClipData().getItemAt(i).getUri();
                        }
                    } else if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
                fileUploadCallback.onReceiveValue(results);
                fileUploadCallback = null;
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
        window.setNavigationBarColor(ContextCompat.getColor(this, R.color.nav_bar_bg));
        WindowCompat.setDecorFitsSystemWindows(window, false);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            window.getAttributes().layoutInDisplayCutoutMode =
                    WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }

        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());
        
        // Edge-to-Edge Window Insets Padding
        ViewCompat.setOnApplyWindowInsetsListener(binding.getRoot(), (v, windowInsets) -> {
            androidx.core.graphics.Insets insets = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(insets.left, insets.top, insets.right, insets.bottom);
            return WindowInsetsCompat.CONSUMED;
        });

        webView = binding.webView;
        progressBar = binding.progressBar;
        loadingLayout = binding.loadingLayout;
        offlineLayout = binding.offlineLayout;
        swipeRefresh = binding.swipeRefresh;
        loadingPercentText = binding.loadingPercent;
        Button retryButton = binding.retryButton;

        configureWebView();
        setupWebViewClient();
        setupWebChromeClient();
        setupDownloadListener();
        setupSwipeRefresh();
        setupNetworkCallback();
        setupPredictiveBack();
        requestNotificationPermission();
        startLoadingPulse();

        retryButton.setOnClickListener(v -> {
            hapticFeedback(HapticFeedbackConstants.CONFIRM);
            if (isNetworkAvailable()) {
                fadeTransition(offlineLayout, webView);
                if (isFirstLoad) {
                    loadingLayout.setVisibility(View.VISIBLE);
                }
                webView.reload();
            } else {
                Toast.makeText(this, "Still no internet connection", Toast.LENGTH_SHORT).show();
            }
        });

        SharedPreferences prefs = getSharedPreferences(PREF_NAME, MODE_PRIVATE);
        boolean biometricEnabled = prefs.getBoolean(KEY_BIOMETRIC, true);

        if (biometricEnabled) {
            attemptBiometricAuth();
        } else {
            isAuthenticated = true;
            loadWebsite();
        }

        if (savedInstanceState != null) {
            webView.restoreState(savedInstanceState);
        }
    }

    private void attemptBiometricAuth() {
        BiometricManager biometricManager = BiometricManager.from(this);
        int canAuthenticate = biometricManager.canAuthenticate(
                BiometricManager.Authenticators.BIOMETRIC_WEAK |
                BiometricManager.Authenticators.DEVICE_CREDENTIAL);

        if (canAuthenticate == BiometricManager.BIOMETRIC_SUCCESS) {
            showBiometricPrompt();
        } else {
            isAuthenticated = true;
            loadWebsite();
        }
    }

    private void showBiometricPrompt() {
        Executor executor = ContextCompat.getMainExecutor(this);

        BiometricPrompt biometricPrompt = new BiometricPrompt(this, executor,
                new BiometricPrompt.AuthenticationCallback() {
                    @Override
                    public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                        super.onAuthenticationSucceeded(result);
                        isAuthenticated = true;
                        hapticFeedback();
                        loadWebsite();
                    }

                    @Override
                    public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                        super.onAuthenticationError(errorCode, errString);
                        if (errorCode == BiometricPrompt.ERROR_USER_CANCELED ||
                            errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON) {
                            finish();
                        } else {
                            isAuthenticated = true;
                            loadWebsite();
                        }
                    }

                    @Override
                    public void onAuthenticationFailed() {
                        super.onAuthenticationFailed();
                        Toast.makeText(MainActivity.this,
                                "Authentication failed. Try again.", Toast.LENGTH_SHORT).show();
                    }
                });

        BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                .setTitle("TNPC Portal")
                .setSubtitle("Verify your identity to continue")
                .setAllowedAuthenticators(
                        BiometricManager.Authenticators.BIOMETRIC_WEAK |
                        BiometricManager.Authenticators.DEVICE_CREDENTIAL)
                .build();

        biometricPrompt.authenticate(promptInfo);
    }

    private void loadWebsite() {
        if (!isAuthenticated) return;

        if (isNetworkAvailable()) {
            // Check for incoming Deep Link or App Shortcut
            Intent intent = getIntent();
            if (intent != null && intent.getData() != null) {
                String url = intent.getData().toString();
                if (isAllowedUrl(url)) {
                    webView.loadUrl(url);
                } else {
                    webView.loadUrl(WEBSITE_URL);
                }
            } else {
                webView.loadUrl(WEBSITE_URL);
            }
            startLoadingTimeout();
        } else {
            loadingLayout.setVisibility(View.GONE);
            offlineLayout.setVisibility(View.VISIBLE);
            progressBar.setVisibility(View.GONE);
        }
    }

    /**
     * Validate that a URL belongs to our allowed domains.
     * Prevents malicious intents from loading phishing pages.
     */
    private boolean isAllowedUrl(String url) {
        if (url == null) return false;
        return url.startsWith("https://tnpc-portal.vercel.app") ||
               url.startsWith("https://tnpc-backend.onrender.com");
    }
    
    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        handleIncomingIntent(intent);
    }

    @Override
    protected void onSaveInstanceState(@NonNull Bundle outState) {
        super.onSaveInstanceState(outState);
        if (webView != null) {
            webView.saveState(outState);
        }
    }

    @Override
    protected void onRestoreInstanceState(@NonNull Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);
        if (webView != null) {
            webView.restoreState(savedInstanceState);
        }
    }

    private void handleIncomingIntent(Intent intent) {
        setIntent(intent);
        if (isAuthenticated && intent != null && intent.getData() != null) {
            String url = intent.getData().toString();
            if (isAllowedUrl(url)) {
                webView.loadUrl(url);
            }
        }
    }

    private void startLoadingTimeout() {
        if (timeoutHandler != null) return;
        timeoutHandler = new Handler(Looper.getMainLooper());
        timeoutHandler.postDelayed(() -> {
            if (isFirstLoad && loadingLayout.getVisibility() == View.VISIBLE) {
                fadeOut(loadingLayout);
                webView.setVisibility(View.VISIBLE);
                isFirstLoad = false;
            }
        }, LOADING_TIMEOUT_MS);
    }

    private void cancelLoadingTimeout() {
        if (timeoutHandler != null) {
            timeoutHandler.removeCallbacksAndMessages(null);
            timeoutHandler = null;
        }
    }

    private void startLoadingPulse() {
        View pulse = binding.loadingPulse;
        if (pulse == null) return;

        ObjectAnimator scaleX = ObjectAnimator.ofFloat(pulse, "scaleX", 1f, 1.3f);
        ObjectAnimator scaleY = ObjectAnimator.ofFloat(pulse, "scaleY", 1f, 1.3f);
        ObjectAnimator alpha = ObjectAnimator.ofFloat(pulse, "alpha", 1f, 0.4f);

        scaleX.setRepeatCount(ObjectAnimator.INFINITE);
        scaleX.setRepeatMode(ObjectAnimator.REVERSE);
        scaleY.setRepeatCount(ObjectAnimator.INFINITE);
        scaleY.setRepeatMode(ObjectAnimator.REVERSE);
        alpha.setRepeatCount(ObjectAnimator.INFINITE);
        alpha.setRepeatMode(ObjectAnimator.REVERSE);

        loadingAnimSet = new AnimatorSet();
        loadingAnimSet.playTogether(scaleX, scaleY, alpha);
        loadingAnimSet.setDuration(1500);
        loadingAnimSet.start();
    }

    private void stopLoadingPulse() {
        if (loadingAnimSet != null) {
            loadingAnimSet.cancel();
            loadingAnimSet = null;
        }
    }

    private void setupSwipeRefresh() {
        swipeRefresh.setColorSchemeColors(
                ContextCompat.getColor(this, R.color.accent),
                ContextCompat.getColor(this, android.R.color.holo_blue_bright),
                ContextCompat.getColor(this, android.R.color.holo_green_light),
                ContextCompat.getColor(this, android.R.color.holo_orange_light)
        );
        swipeRefresh.setProgressBackgroundColorSchemeColor(
                ContextCompat.getColor(this, R.color.primary)
        );
        
        // Add a premium, heavier "pull" feel
        swipeRefresh.setDistanceToTriggerSync(300);

        // Only allow swipe-to-refresh when WebView is scrolled to the top
        // This prevents SwipeRefreshLayout from intercepting mid-page scrolls
        webView.setOnScrollChangeListener((v, scrollX, scrollY, oldScrollX, oldScrollY) -> {
            swipeRefresh.setEnabled(scrollY == 0);
        });
        
        swipeRefresh.setOnRefreshListener(() -> {
            hapticFeedback(HapticFeedbackConstants.CLOCK_TICK);
            if (offlineLayout.getVisibility() == View.VISIBLE && isNetworkAvailable()) {
                // Smart Pull-to-Refresh Recovery
                fadeTransition(offlineLayout, webView);
            }
            webView.reload();
        });
    }

    private void setupNetworkCallback() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        NetworkRequest request = new NetworkRequest.Builder()
                .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                .build();

        networkCallback = new ConnectivityManager.NetworkCallback() {
            @Override
            public void onAvailable(@NonNull Network network) {
                runOnUiThread(() -> {
                    if (webView != null) webView.getSettings().setCacheMode(WebSettings.LOAD_DEFAULT);
                    dismissConnectivitySnackbar();
                    showSnackbar("Back online ✓", R.color.success, 2000);
                    if (offlineLayout.getVisibility() == View.VISIBLE && isAuthenticated) {
                        fadeTransition(offlineLayout, webView);
                        if (isFirstLoad) {
                            loadingLayout.setVisibility(View.VISIBLE);
                        }
                        webView.reload();
                    }
                });
            }

            @Override
            public void onLost(@NonNull Network network) {
                runOnUiThread(() -> {
                    if (webView != null) webView.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
                    if (!isNetworkAvailable()) {
                        showPersistentSnackbar("No internet connection", R.color.error);
                    }
                });
            }
        };

        cm.registerNetworkCallback(request, networkCallback);
    }

    private void showSnackbar(String message, int colorRes, int duration) {
        Snackbar snackbar = Snackbar.make(binding.getRoot(), message, duration);
        snackbar.setBackgroundTint(ContextCompat.getColor(this, colorRes));
        snackbar.setTextColor(ContextCompat.getColor(this, R.color.white));
        snackbar.show();
    }

    private void showPersistentSnackbar(String message, int colorRes) {
        connectivitySnackbar = Snackbar.make(
                binding.getRoot(), message, Snackbar.LENGTH_INDEFINITE);
        connectivitySnackbar.setBackgroundTint(ContextCompat.getColor(this, colorRes));
        connectivitySnackbar.setTextColor(ContextCompat.getColor(this, R.color.white));
        connectivitySnackbar.setAction("Retry", v -> {
            if (isNetworkAvailable()) {
                webView.reload();
            }
        });
        connectivitySnackbar.setActionTextColor(ContextCompat.getColor(this, R.color.white));
        connectivitySnackbar.show();
    }

    private void dismissConnectivitySnackbar() {
        if (connectivitySnackbar != null && connectivitySnackbar.isShown()) {
            connectivitySnackbar.dismiss();
        }
    }

    private void setupWebViewClient() {
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                offlineLayout.setVisibility(View.GONE);
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                swipeRefresh.setRefreshing(false);
                cancelLoadingTimeout();
                if (isFirstLoad) {
                    stopLoadingPulse();
                    fadeOut(loadingLayout);
                    webView.setVisibility(View.VISIBLE);
                    isFirstLoad = false;
                }
                injectShareButton(view);
                injectPerformanceCSS(view);
            }

            @Override
            public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
                if (!detail.didCrash()) {
                    // Renderer was killed to reclaim memory; just reload
                    if (webView != null) {
                        webView.destroy();
                    }
                    return true;
                }
                // Renderer crashed — show offline screen and let user retry
                runOnUiThread(() -> {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                    webView.setVisibility(View.GONE);
                    fadeIn(offlineLayout);
                    Toast.makeText(MainActivity.this,
                            "Page crashed. Tap retry to reload.", Toast.LENGTH_LONG).show();
                });
                return true;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request,
                                        WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request.isForMainFrame()) {
                    // Try to use cached version if offline
                    if (!isNetworkAvailable()) {
                        view.getSettings().setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
                    } else {
                        cancelLoadingTimeout();
                        progressBar.setVisibility(View.GONE);
                        swipeRefresh.setRefreshing(false);
                        webView.setVisibility(View.GONE);
                        loadingLayout.setVisibility(View.GONE);
                        isFirstLoad = false;
                        fadeIn(offlineLayout);
                    }
                }
            }

            @Override
            public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                // Security Hardening: Never blindly accept invalid SSL certificates.
                handler.cancel();
                
                cancelLoadingTimeout();
                progressBar.setVisibility(View.GONE);
                swipeRefresh.setRefreshing(false);
                webView.setVisibility(View.GONE);
                loadingLayout.setVisibility(View.GONE);
                isFirstLoad = false;
                fadeIn(offlineLayout);
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (url.startsWith("https://tnpc-portal.vercel.app") ||
                    url.startsWith("https://tnpc-backend.onrender.com")) {
                    return false;
                }
                if (url.startsWith("mailto:")) {
                    try {
                        startActivity(new Intent(Intent.ACTION_SENDTO, Uri.parse(url)));
                    } catch (android.content.ActivityNotFoundException e) {
                        showSnackbar("No email app installed.", R.color.accent, Snackbar.LENGTH_SHORT);
                    }
                    return true;
                }
                if (url.startsWith("tel:")) {
                    try {
                        startActivity(new Intent(Intent.ACTION_DIAL, Uri.parse(url)));
                    } catch (android.content.ActivityNotFoundException e) {
                        showSnackbar("No dialer app installed.", R.color.accent, Snackbar.LENGTH_SHORT);
                    }
                    return true;
                }
                if (url.startsWith("market:") || url.startsWith("intent://")) {
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    } catch (android.content.ActivityNotFoundException e) {
                        // Ignore unknown schemes
                    }
                    return true;
                }
                
                // Open external links in a Chrome Custom Tab instead of kicking user to browser
                try {
                    CustomTabsIntent.Builder builder = new CustomTabsIntent.Builder();
                    builder.setShowTitle(true);
                    builder.setToolbarColor(ContextCompat.getColor(MainActivity.this, R.color.primary));
                    CustomTabsIntent customTabsIntent = builder.build();
                    customTabsIntent.launchUrl(MainActivity.this, Uri.parse(url));
                } catch (Exception e) {
                    // Fallback to standard browser if Chrome Custom Tabs fails
                    try {
                        startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
                    } catch (android.content.ActivityNotFoundException ex) {
                        showSnackbar("No app found to open this link.", R.color.accent, Snackbar.LENGTH_SHORT);
                    }
                }
                
                return true;
            }
        });
    }

    private void injectShareButton(WebView view) {
        String js = "javascript:(function() {" +
                "if(document.getElementById('tnpc-share-fab')) return;" +
                "var btn = document.createElement('div');" +
                "btn.id = 'tnpc-share-fab';" +
                "btn.innerHTML = '⤴';" +
                "btn.style.cssText = 'position:fixed;bottom:80px;right:20px;width:44px;height:44px;" +
                "border-radius:50%;background:linear-gradient(135deg,#1a73e8,#4FC3F7);" +
                "color:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;" +
                "box-shadow:0 4px 16px rgba(79,195,247,0.4);z-index:99999;cursor:pointer;" +
                "transition:transform 0.2s,box-shadow 0.2s;opacity:0.85;';" +
                "btn.ontouchstart = function() {this.style.transform='scale(0.9)';this.style.opacity='1';};" +
                "btn.ontouchend = function() {this.style.transform='scale(1)';this.style.opacity='0.85';TNPCApp.shareCurrentPage(document.title, window.location.href);};" +
                "btn.onclick = function() {TNPCApp.shareCurrentPage(document.title, window.location.href);};" +
                "document.body.appendChild(btn);" +
                "})()";
        view.loadUrl(js);
    }

    /**
     * Inject performance CSS when running inside the Android WebView.
     * Disables heavy animations, backdrop-filter, and decorative elements
     * that cause scroll jank on mobile devices.
     */
    private void injectPerformanceCSS(WebView view) {
        String css =
                "html{scroll-behavior:auto!important;}" +
                ".hero-orbs,.orb,.orb-1,.orb-2,.orb-3,#particleCanvas{display:none!important;}" +
                ".navbar,.navbar.scrolled{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;" +
                "background:rgba(11,29,58,0.99)!important;}" +
                ".top-strip{animation:none!important;background:linear-gradient(90deg,#C62828 0%,#e53935 40%,#C62828 100%)!important;}" +
                ".stat-box::before,.feature-icon,.cta-section::before,.cta-section::after," +
                ".mou-card::before,.about-card::before,.cert-card::before{animation:none!important;}" +
                ".stat-card:hover,.job-card:hover,.app-card:hover,.corporate-card:hover," +
                ".about-card:hover,.mou-card:hover,.feature-card:hover,.contact-card:hover," +
                ".cert-card:hover,.stat-box:hover,.testimonial-card:hover{transform:none!important;}" +
                ".fade-in{transition-duration:0.2s!important;}" +
                "*{-webkit-tap-highlight-color:transparent;}";

        String js = "javascript:(function(){" +
                "if(document.getElementById('tnpc-perf-css'))return;" +
                "var s=document.createElement('style');" +
                "s.id='tnpc-perf-css';" +
                "s.textContent='" + css.replace("'", "\\'") + "';" +
                "document.head.appendChild(s);" +
                "})()";
        view.loadUrl(js);
    }

    private void setupWebChromeClient() {
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                    // Update loading screen percentage text
                    if (isFirstLoad && loadingPercentText != null) {
                        loadingPercentText.setText("Loading... " + newProgress + "%");
                    }
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }

            @Override
            public boolean onShowFileChooser(WebView webView,
                                             ValueCallback<Uri[]> filePathCallback,
                                             FileChooserParams fileChooserParams) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                fileUploadCallback = filePathCallback;

                Intent captureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                Intent contentIntent = new Intent(Intent.ACTION_GET_CONTENT);
                contentIntent.addCategory(Intent.CATEGORY_OPENABLE);
                contentIntent.setType("*/*");
                contentIntent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);

                Intent chooserIntent = Intent.createChooser(contentIntent, "Select or take a photo");
                chooserIntent.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{captureIntent});

                try {
                    fileChooserLauncher.launch(chooserIntent);
                } catch (Exception e) {
                    fileUploadCallback = null;
                    Toast.makeText(MainActivity.this,
                            "Cannot open file chooser", Toast.LENGTH_SHORT).show();
                    return false;
                }
                return true;
            }

            @Override
            public void onGeolocationPermissionsShowPrompt(String origin,
                                                           GeolocationPermissions.Callback callback) {
                callback.invoke(origin, true, false);
            }
        });
    }

    private void setupDownloadListener() {
        webView.setDownloadListener((url, userAgent, contentDisposition, mimeType, contentLength) -> {
            try {
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
                request.setMimeType(mimeType);
                String cookies = CookieManager.getInstance().getCookie(url);
                request.addRequestHeader("Cookie", cookies);
                request.addRequestHeader("User-Agent", userAgent);

                String fileName = URLUtil.guessFileName(url, contentDisposition, mimeType);
                request.setTitle(fileName);
                request.setDescription("Downloading " + fileName);

                request.setNotificationVisibility(
                        DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setDestinationInExternalPublicDir(
                        Environment.DIRECTORY_DOWNLOADS, fileName);

                DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                dm.enqueue(request);
                hapticFeedback();
                showSnackbar("⬇ Downloading: " + fileName, R.color.accent_dark, 3000);
            } catch (Exception e) {
                Toast.makeText(this, "Download failed", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void requestNotificationPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this,
                    Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.POST_NOTIFICATIONS},
                        NOTIFICATION_PERMISSION_CODE);
            }
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions,
                                           @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        // Security: Prevent local file access exploits
        settings.setAllowFileAccess(false);
        settings.setLoadWithOverviewMode(true);
        settings.setUseWideViewPort(true);
        
        // Hardware acceleration and rendering optimizations
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);
        
        // Scroll smoothness optimizations
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVerticalScrollBarEnabled(true);
        webView.setHorizontalScrollBarEnabled(false);
        // Disable nested scrolling — it conflicts with SwipeRefreshLayout
        // and causes scroll stutter/jank on content-heavy pages
        webView.setNestedScrollingEnabled(false);
        
        // Enable smooth scroll fling
        webView.setFocusable(true);
        webView.setFocusableInTouchMode(true);
        
        // Dynamic caching
        if (isNetworkAvailable()) {
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        } else {
            settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }
        
        // Security: Disable WebView debugging in production release builds
        if (0 != (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE)) {
            WebView.setWebContentsDebuggingEnabled(true);
        } else {
            WebView.setWebContentsDebuggingEnabled(false);
        }
        
        // Security: Enforce HTTPS, reject mixed HTTP content
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setSupportMultipleWindows(false);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        // Security: Disable content provider access unless explicitly needed
        settings.setAllowContentAccess(false);
        settings.setGeolocationEnabled(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        String customUA = settings.getUserAgentString() + " TNPCPortalApp/1.0";
        settings.setUserAgentString(customUA);

        webView.addJavascriptInterface(new WebAppInterface(this), "TNPCApp");

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);
    }

    private void hapticFeedback() {
        hapticFeedback(HapticFeedbackConstants.CONTEXT_CLICK);
    }

    private void hapticFeedback(int feedbackConstant) {
        try {
            View view = getWindow().getDecorView();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
                view.performHapticFeedback(feedbackConstant, HapticFeedbackConstants.FLAG_IGNORE_GLOBAL_SETTING);
            } else {
                view.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY, HapticFeedbackConstants.FLAG_IGNORE_GLOBAL_SETTING);
            }
        } catch (Exception ignored) {}
    }

    private void fadeIn(View view) {
        view.setVisibility(View.VISIBLE);
        AlphaAnimation anim = new AlphaAnimation(0f, 1f);
        anim.setDuration(300);
        view.startAnimation(anim);
    }

    private void fadeOut(View view) {
        AlphaAnimation anim = new AlphaAnimation(1f, 0f);
        anim.setDuration(300);
        anim.setAnimationListener(new Animation.AnimationListener() {
            @Override public void onAnimationStart(Animation a) {}
            @Override public void onAnimationRepeat(Animation a) {}
            @Override
            public void onAnimationEnd(Animation a) {
                view.setVisibility(View.GONE);
            }
        });
        view.startAnimation(anim);
    }

    private void fadeTransition(View fadeOutView, View fadeInView) {
        fadeOut(fadeOutView);
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            fadeInView.setVisibility(View.VISIBLE);
            fadeIn(fadeInView);
        }, 150);
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager)
                getSystemService(CONNECTIVITY_SERVICE);
        Network network = cm.getActiveNetwork();
        if (network == null) return false;
        NetworkCapabilities caps = cm.getNetworkCapabilities(network);
        return caps != null && (caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI)
                || caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
                || caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET));
    }

    private void setupPredictiveBack() {
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView != null && webView.canGoBack()) {
                    webView.goBack();
                } else {
                    showExitDialog();
                }
            }
        });
    }

    private void showExitDialog() {
        new AlertDialog.Builder(this, R.style.Theme_TNPCPortal_Dialog)
                .setTitle("Exit TNPC Portal?")
                .setMessage("Are you sure you want to exit the app?")
                .setPositiveButton("Exit", (dialog, which) -> {
                    hapticFeedback();
                    finishAffinity();
                })
                .setNegativeButton("Stay", (dialog, which) -> dialog.dismiss())
                .setCancelable(true)
                .show();
    }

    public void shareContent(String title, String url) {
        Intent shareIntent = new Intent(Intent.ACTION_SEND);
        shareIntent.setType("text/plain");
        shareIntent.putExtra(Intent.EXTRA_SUBJECT, title);
        shareIntent.putExtra(Intent.EXTRA_TEXT,
                title + "\n\nCheck it out: " + url + "\n\n— TNPC Portal | Sri GCSR College");
        startActivity(Intent.createChooser(shareIntent, "Share via"));
        hapticFeedback(HapticFeedbackConstants.CONFIRM);
    }
    
    public void requestInAppReview() {
        ReviewManager manager = ReviewManagerFactory.create(this);
        Task<ReviewInfo> request = manager.requestReviewFlow();
        request.addOnCompleteListener(task -> {
            if (task.isSuccessful()) {
                ReviewInfo reviewInfo = task.getResult();
                Task<Void> flow = manager.launchReviewFlow(MainActivity.this, reviewInfo);
                flow.addOnCompleteListener(flowTask -> {
                    // Flow finished
                });
            } else {
                // Ignore API failure and continue normally
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) webView.onPause();
    }

    @Override
    protected void onDestroy() {
        cancelLoadingTimeout();
        stopLoadingPulse();
        if (networkCallback != null) {
            try {
                ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
                cm.unregisterNetworkCallback(networkCallback);
            } catch (Exception ignored) {}
        }
        if (webView != null) {
            webView.stopLoading();
            webView.loadUrl("about:blank");
            webView.onPause();
            webView.removeAllViews();
            webView.destroy();
            webView = null;
        }
        binding = null;
        super.onDestroy();
    }
}
