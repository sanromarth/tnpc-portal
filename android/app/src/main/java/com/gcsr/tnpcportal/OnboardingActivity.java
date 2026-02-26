package com.gcsr.tnpcportal;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.viewpager2.widget.ViewPager2;
import androidx.recyclerview.widget.RecyclerView;

import com.airbnb.lottie.LottieAnimationView;
import com.gcsr.tnpcportal.databinding.ActivityOnboardingBinding;

public class OnboardingActivity extends AppCompatActivity {

    private ActivityOnboardingBinding binding;

    private ViewPager2 viewPager;
    private LinearLayout dotsLayout;
    private Button btnNext;
    private Button btnSkip;

    private static final String PREF_NAME = "tnpc_prefs";
    private static final String KEY_ONBOARDING_DONE = "onboarding_done";

    private final int[] titles = {
            R.string.onboarding_title_1,
            R.string.onboarding_title_2,
            R.string.onboarding_title_3
    };

    private final int[] descriptions = {
            R.string.onboarding_desc_1,
            R.string.onboarding_desc_2,
            R.string.onboarding_desc_3
    };

    private final int[] icons = {
            R.raw.lottie_onboarding_1,
            R.raw.lottie_onboarding_2,
            R.raw.lottie_onboarding_3
    };

    private final int[] accentColors = {
            R.color.accent,
            R.color.success,
            R.color.onboarding_purple
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences prefs = getSharedPreferences(PREF_NAME, MODE_PRIVATE);
        if (prefs.getBoolean(KEY_ONBOARDING_DONE, false)) {
            launchMain();
            return;
        }

        Window window = getWindow();
        WindowCompat.setDecorFitsSystemWindows(window, false);
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(android.graphics.Color.TRANSPARENT);
        window.setNavigationBarColor(android.graphics.Color.TRANSPARENT);

        if (getSupportActionBar() != null) {
            getSupportActionBar().hide();
        }

        binding = ActivityOnboardingBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        ViewCompat.setOnApplyWindowInsetsListener(binding.getRoot(), (v, insets) -> {
            androidx.core.graphics.Insets bars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(0, 0, 0, bars.bottom);
            return insets;
        });

        viewPager = binding.viewPager;
        dotsLayout = binding.dotsLayout;
        btnNext = binding.btnNext;
        btnSkip = binding.btnSkip;

        OnboardingAdapter adapter = new OnboardingAdapter();
        viewPager.setAdapter(adapter);

        // Premium page transformer — Parallax layer depth effect
        viewPager.setPageTransformer(new ParallaxPageTransformer());

        setupDots(0);

        viewPager.registerOnPageChangeCallback(new ViewPager2.OnPageChangeCallback() {
            @Override
            public void onPageSelected(int position) {
                setupDots(position);
                if (position == titles.length - 1) {
                    btnNext.setText("Get Started");
                    btnSkip.setVisibility(View.INVISIBLE);
                } else {
                    btnNext.setText("Next");
                    btnSkip.setVisibility(View.VISIBLE);
                }
            }
        });

        btnNext.setOnClickListener(v -> {
            v.performHapticFeedback(android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            if (viewPager.getCurrentItem() + 1 < titles.length) {
                viewPager.setCurrentItem(viewPager.getCurrentItem() + 1);
            } else {
                launchMain();
            }
        });

        btnSkip.setOnClickListener(v -> {
            v.performHapticFeedback(android.view.HapticFeedbackConstants.CONTEXT_CLICK);
            launchMain();
        });
    }

    private void setupDots(int currentPage) {
        dotsLayout.removeAllViews();
        for (int i = 0; i < titles.length; i++) {
            View dot = new View(this);
            LinearLayout.LayoutParams params;
            if (i == currentPage) {
                params = new LinearLayout.LayoutParams(32, 10);
                dot.setBackgroundResource(R.drawable.dot_active);
                dot.animate().scaleX(1f).scaleY(1f).setDuration(200).start();
            } else {
                params = new LinearLayout.LayoutParams(10, 10);
                dot.setBackgroundResource(R.drawable.dot_inactive);
            }
            params.setMargins(6, 0, 6, 0);
            dot.setLayoutParams(params);
            dotsLayout.addView(dot);
        }
    }

    private void launchMain() {
        SharedPreferences prefs = getSharedPreferences(PREF_NAME, MODE_PRIVATE);
        prefs.edit().putBoolean(KEY_ONBOARDING_DONE, true).apply();
        Intent intent = new Intent(this, MainActivity.class);
        startActivity(intent);
        if (Build.VERSION.SDK_INT >= 34) {
            overrideActivityTransition(OVERRIDE_TRANSITION_OPEN, android.R.anim.fade_in, android.R.anim.fade_out);
        } else {
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out);
        }
        finish();
    }

    class OnboardingAdapter extends RecyclerView.Adapter<OnboardingAdapter.OnboardingViewHolder> {

        @NonNull
        @Override
        public OnboardingViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View view = LayoutInflater.from(parent.getContext())
                    .inflate(R.layout.item_onboarding, parent, false);
            return new OnboardingViewHolder(view);
        }

        @Override
        public void onBindViewHolder(@NonNull OnboardingViewHolder holder, int position) {
            holder.bind(position);

            // Entrance animation per item
            holder.lottie.setAlpha(0f);
            holder.lottie.setScaleX(0.5f);
            holder.lottie.setScaleY(0.5f);
            holder.title.setAlpha(0f);
            holder.title.setTranslationY(20f);
            holder.desc.setAlpha(0f);
            holder.desc.setTranslationY(20f);

            holder.lottie.animate().alpha(1f).scaleX(1f).scaleY(1f).setDuration(400).setStartDelay(200).start();
            holder.title.animate().alpha(1f).translationY(0f).setDuration(400).setStartDelay(350).start();
            holder.desc.animate().alpha(1f).translationY(0f).setDuration(400).setStartDelay(450).start();
        }

        @Override
        public int getItemCount() {
            return titles.length;
        }

        class OnboardingViewHolder extends RecyclerView.ViewHolder {

            TextView title, desc;
            LottieAnimationView lottie;
            View iconRing;

            OnboardingViewHolder(@NonNull View itemView) {
                super(itemView);
                title = itemView.findViewById(R.id.onboardingTitle);
                desc = itemView.findViewById(R.id.onboardingDesc);
                lottie = itemView.findViewById(R.id.onboardingLottie);
                iconRing = itemView.findViewById(R.id.iconRing);
            }

            void bind(int position) {
                title.setText(titles[position]);
                desc.setText(descriptions[position]);
                lottie.setAnimation(icons[position]);
                iconRing.setBackgroundTintList(
                        ContextCompat.getColorStateList(itemView.getContext(), accentColors[position])
                );
            }
        }
    }

    private static class ParallaxPageTransformer implements ViewPager2.PageTransformer {
        private static final float MIN_SCALE = 0.85f;
        private static final float MIN_ALPHA = 0.5f;

        @Override
        public void transformPage(@NonNull View page, float position) {
            int pageWidth = page.getWidth();

            View title = page.findViewById(R.id.onboardingTitle);
            View desc = page.findViewById(R.id.onboardingDesc);
            LottieAnimationView lottie = page.findViewById(R.id.onboardingLottie);
            View iconRing = page.findViewById(R.id.iconRing);

            if (position < -1) { // [-Infinity,-1)
                page.setAlpha(0f);
            } else if (position <= 1) { // [-1,1]
                float scaleFactor = Math.max(MIN_SCALE, 1 - Math.abs(position));
                
                // Parallax speeds
                if (title != null) title.setTranslationX(position * (pageWidth / 1.5f));
                if (desc != null) desc.setTranslationX(position * (pageWidth / 1.2f));
                if (iconRing != null) iconRing.setTranslationX(position * (pageWidth / 2f));
                if (lottie != null) lottie.setTranslationX(position * (pageWidth / 3f));

                page.setAlpha(MIN_ALPHA + (scaleFactor - MIN_SCALE) / (1 - MIN_SCALE) * (1 - MIN_ALPHA));
            } else { // (1,+Infinity]
                page.setAlpha(0f);
            }
        }
    }
}
