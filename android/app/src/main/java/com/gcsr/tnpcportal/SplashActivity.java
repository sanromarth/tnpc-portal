package com.gcsr.tnpcportal;

import android.animation.AnimatorSet;
import android.animation.ObjectAnimator;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.AccelerateDecelerateInterpolator;
import android.view.animation.OvershootInterpolator;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.splashscreen.SplashScreen;
import com.gcsr.tnpcportal.databinding.ActivitySplashBinding;

public class SplashActivity extends AppCompatActivity {

    private ActivitySplashBinding binding;

    private static final int SPLASH_DURATION = 2800;
    private static final String PREF_NAME = "tnpc_prefs";
    private static final String KEY_ONBOARDING_DONE = "onboarding_done";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);

        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(ContextCompat.getColor(this, R.color.primary));
        window.setNavigationBarColor(ContextCompat.getColor(this, R.color.primary));

        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }

        binding = ActivitySplashBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        ImageView logo = binding.splashLogo;
        TextView appName = binding.splashAppName;
        TextView tagline = binding.splashTagline;
        ProgressBar loader = binding.splashLoader;
        View glowRing = binding.glowRing;
        View particle1 = binding.glowParticle1;
        View particle2 = binding.glowParticle2;
        View particle3 = binding.glowParticle3;

        // Initial states
        logo.setAlpha(0f);
        logo.setScaleX(0.3f);
        logo.setScaleY(0.3f);
        appName.setAlpha(0f);
        appName.setTranslationY(30f);
        tagline.setAlpha(0f);
        tagline.setTranslationY(20f);
        loader.setAlpha(0f);
        glowRing.setAlpha(0f);
        glowRing.setScaleX(0.2f);
        glowRing.setScaleY(0.2f);

        // Logo entrance with overshoot
        ObjectAnimator logoAlpha = ObjectAnimator.ofFloat(logo, "alpha", 0f, 1f);
        ObjectAnimator logoScaleX = ObjectAnimator.ofFloat(logo, "scaleX", 0.3f, 1f);
        ObjectAnimator logoScaleY = ObjectAnimator.ofFloat(logo, "scaleY", 0.3f, 1f);
        logoAlpha.setDuration(700);
        logoScaleX.setDuration(700);
        logoScaleY.setDuration(700);
        logoScaleX.setInterpolator(new OvershootInterpolator(1.5f));
        logoScaleY.setInterpolator(new OvershootInterpolator(1.5f));

        // Glow ring expansion
        ObjectAnimator glowAlpha = ObjectAnimator.ofFloat(glowRing, "alpha", 0f, 0.4f);
        ObjectAnimator glowScaleX = ObjectAnimator.ofFloat(glowRing, "scaleX", 0.2f, 1.5f);
        ObjectAnimator glowScaleY = ObjectAnimator.ofFloat(glowRing, "scaleY", 0.2f, 1.5f);
        glowAlpha.setDuration(1000);
        glowScaleX.setDuration(1000);
        glowScaleY.setDuration(1000);

        // App name slide up
        ObjectAnimator nameAlpha = ObjectAnimator.ofFloat(appName, "alpha", 0f, 1f);
        ObjectAnimator nameSlide = ObjectAnimator.ofFloat(appName, "translationY", 30f, 0f);
        nameAlpha.setDuration(500);
        nameSlide.setDuration(500);
        nameAlpha.setStartDelay(400);
        nameSlide.setStartDelay(400);

        // Tagline slide up
        ObjectAnimator tagAlpha = ObjectAnimator.ofFloat(tagline, "alpha", 0f, 1f);
        ObjectAnimator tagSlide = ObjectAnimator.ofFloat(tagline, "translationY", 20f, 0f);
        tagAlpha.setDuration(500);
        tagSlide.setDuration(500);
        tagAlpha.setStartDelay(600);
        tagSlide.setStartDelay(600);

        // Loader fade in
        ObjectAnimator loaderAlpha = ObjectAnimator.ofFloat(loader, "alpha", 0f, 1f);
        loaderAlpha.setDuration(400);
        loaderAlpha.setStartDelay(900);

        // Floating particles
        ObjectAnimator p1Alpha = ObjectAnimator.ofFloat(particle1, "alpha", 0f, 0.4f);
        ObjectAnimator p1TransY = ObjectAnimator.ofFloat(particle1, "translationY", 0f, -20f);
        p1Alpha.setDuration(1200);
        p1TransY.setDuration(2000);
        p1Alpha.setStartDelay(500);
        p1TransY.setStartDelay(500);
        p1TransY.setRepeatCount(ObjectAnimator.INFINITE);
        p1TransY.setRepeatMode(ObjectAnimator.REVERSE);

        ObjectAnimator p2Alpha = ObjectAnimator.ofFloat(particle2, "alpha", 0f, 0.3f);
        ObjectAnimator p2TransY = ObjectAnimator.ofFloat(particle2, "translationY", 0f, -15f);
        p2Alpha.setDuration(1200);
        p2TransY.setDuration(2500);
        p2Alpha.setStartDelay(800);
        p2TransY.setStartDelay(800);
        p2TransY.setRepeatCount(ObjectAnimator.INFINITE);
        p2TransY.setRepeatMode(ObjectAnimator.REVERSE);

        ObjectAnimator p3Alpha = ObjectAnimator.ofFloat(particle3, "alpha", 0f, 0.25f);
        ObjectAnimator p3TransY = ObjectAnimator.ofFloat(particle3, "translationY", 0f, -12f);
        p3Alpha.setDuration(1200);
        p3TransY.setDuration(1800);
        p3Alpha.setStartDelay(1000);
        p3TransY.setStartDelay(1000);
        p3TransY.setRepeatCount(ObjectAnimator.INFINITE);
        p3TransY.setRepeatMode(ObjectAnimator.REVERSE);

        // Glow ring breathing
        ObjectAnimator glowBreathScaleX = ObjectAnimator.ofFloat(glowRing, "scaleX", 1.5f, 1.7f);
        ObjectAnimator glowBreathScaleY = ObjectAnimator.ofFloat(glowRing, "scaleY", 1.5f, 1.7f);
        glowBreathScaleX.setDuration(2000);
        glowBreathScaleY.setDuration(2000);
        glowBreathScaleX.setStartDelay(1000);
        glowBreathScaleY.setStartDelay(1000);
        glowBreathScaleX.setRepeatCount(ObjectAnimator.INFINITE);
        glowBreathScaleY.setRepeatCount(ObjectAnimator.INFINITE);
        glowBreathScaleX.setRepeatMode(ObjectAnimator.REVERSE);
        glowBreathScaleY.setRepeatMode(ObjectAnimator.REVERSE);

        AnimatorSet animatorSet = new AnimatorSet();
        animatorSet.playTogether(
                logoAlpha, logoScaleX, logoScaleY,
                glowAlpha, glowScaleX, glowScaleY,
                nameAlpha, nameSlide,
                tagAlpha, tagSlide,
                loaderAlpha,
                p1Alpha, p1TransY,
                p2Alpha, p2TransY,
                p3Alpha, p3TransY,
                glowBreathScaleX, glowBreathScaleY
        );
        animatorSet.setInterpolator(new AccelerateDecelerateInterpolator());
        animatorSet.start();

        new Handler(Looper.getMainLooper()).postDelayed(this::navigateNext, SPLASH_DURATION);
    }

    private void navigateNext() {
        SharedPreferences prefs = getSharedPreferences(PREF_NAME, MODE_PRIVATE);
        boolean onboardingDone = prefs.getBoolean(KEY_ONBOARDING_DONE, false);

        Intent intent;
        if (!onboardingDone) {
            intent = new Intent(this, OnboardingActivity.class);
        } else {
            intent = new Intent(this, MainActivity.class);
        }
        
        // Pass through any App Shortcut / Deep Link data
        if (getIntent().getData() != null) {
            intent.setData(getIntent().getData());
            intent.setAction(getIntent().getAction());
        }
        
        startActivity(intent);
        if (Build.VERSION.SDK_INT >= 34) {
            overrideActivityTransition(OVERRIDE_TRANSITION_OPEN, android.R.anim.fade_in, android.R.anim.fade_out);
        } else {
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        }
        finish();
    }
}
