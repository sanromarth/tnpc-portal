/* ============================================
   MICRO-INTERACTIONS — Premium UX Upgrades
   Ripple effects, scroll animations, haptic
   feedback, smooth transitions, and more.
   ============================================ */

(function() {
    'use strict';

    // === MATERIAL RIPPLE EFFECT ON BUTTONS ===
    function createRipple(e) {
        const btn = e.currentTarget;
        const existing = btn.querySelector('.ripple-effect');
        if (existing) existing.remove();

        const circle = document.createElement('span');
        circle.classList.add('ripple-effect');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        circle.style.width = circle.style.height = size + 'px';
        circle.style.left = (e.clientX - rect.left - size / 2) + 'px';
        circle.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(circle);
        setTimeout(() => circle.remove(), 600);
    }

    function initRipples() {
        const selectors = '.btn-primary, .btn-sm, .btn-danger, .btn-ghost, .qa-btn, .nav-item, .bottom-nav-item, .more-menu-item';
        document.querySelectorAll(selectors).forEach(el => {
            el.style.position = el.style.position || 'relative';
            el.style.overflow = 'hidden';
            el.addEventListener('click', createRipple);
        });
    }

    // === SCROLL-REVEAL ANIMATIONS ===
    function initScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.glass-card, .stat-card, .job-card, .training-card, .badge-card, .sb-card, .notif-item, .app-card, .admin-list-item').forEach(el => {
            el.classList.add('reveal-on-scroll');
            observer.observe(el);
        });
    }

    // === SMOOTH SECTION TRANSITIONS ===
    function enhanceSectionTransitions() {
        const originalShowSection = window.showSection;
        if (typeof originalShowSection === 'function') {
            window.showSection = function(section, navEl) {
                const currentActive = document.querySelector('.dash-section.active');
                if (currentActive) {
                    currentActive.style.opacity = '0';
                    currentActive.style.transform = 'translateY(8px)';
                }
                setTimeout(() => {
                    originalShowSection(section, navEl);
                    const newActive = document.querySelector('.dash-section.active');
                    if (newActive) {
                        newActive.style.opacity = '0';
                        newActive.style.transform = 'translateY(12px)';
                        requestAnimationFrame(() => {
                            newActive.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                            newActive.style.opacity = '1';
                            newActive.style.transform = 'translateY(0)';
                        });
                    }
                    // Scroll to top on section change
                    document.querySelector('.dash-content')?.scrollTo({ top: 0, behavior: 'smooth' });
                }, 150);
            };
        }

        const originalShowAdmin = window.showAdminSection;
        if (typeof originalShowAdmin === 'function') {
            window.showAdminSection = function(section, navEl) {
                const currentActive = document.querySelector('.dash-section.active');
                if (currentActive) {
                    currentActive.style.opacity = '0';
                    currentActive.style.transform = 'translateY(8px)';
                }
                setTimeout(() => {
                    originalShowAdmin(section, navEl);
                    const newActive = document.querySelector('.dash-section.active');
                    if (newActive) {
                        newActive.style.opacity = '0';
                        newActive.style.transform = 'translateY(12px)';
                        requestAnimationFrame(() => {
                            newActive.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                            newActive.style.opacity = '1';
                            newActive.style.transform = 'translateY(0)';
                        });
                    }
                    document.querySelector('.dash-content')?.scrollTo({ top: 0, behavior: 'smooth' });
                }, 150);
            };
        }
    }

    // === COUNTER ANIMATION (UPGRADED) ===
    function animateValue(el, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();
        const isPercent = el.textContent.includes('%') || el.id?.includes('Percent') || el.id?.includes('Completion');

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(start + range * eased);
            el.textContent = isPercent ? current + '%' : current.toLocaleString();
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // === STAGGER CHILDREN ANIMATION ===
    function staggerChildren(parent, delay = 80) {
        if (!parent) return;
        const children = parent.children;
        Array.from(children).forEach((child, i) => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(16px)';
            setTimeout(() => {
                child.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                child.style.opacity = '1';
                child.style.transform = 'translateY(0)';
            }, i * delay);
        });
    }

    // === TOPBAR SCROLL SHADOW ===
    function initTopbarShadow() {
        const content = document.querySelector('.dash-content');
        const topbar = document.querySelector('.dash-topbar');
        if (!content || !topbar) return;

        content.addEventListener('scroll', () => {
            if (content.scrollTop > 10) {
                topbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
                topbar.style.borderBottomColor = 'rgba(255,255,255,0.03)';
            } else {
                topbar.style.boxShadow = 'none';
                topbar.style.borderBottomColor = 'rgba(255,255,255,0.06)';
            }
        }, { passive: true });
    }

    // === PULL-DOWN INDICATOR (MOBILE) ===
    function initPullIndicator() {
        if (window.innerWidth > 768) return;
        const content = document.querySelector('.dash-content');
        if (!content) return;

        let startY = 0;
        let pulling = false;
        const indicator = document.createElement('div');
        indicator.className = 'pull-indicator';
        indicator.innerHTML = '<span class="pull-spinner">↻</span>';
        content.prepend(indicator);

        content.addEventListener('touchstart', (e) => {
            if (content.scrollTop === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        }, { passive: true });

        content.addEventListener('touchmove', (e) => {
            if (!pulling) return;
            const diff = e.touches[0].clientY - startY;
            if (diff > 0 && diff < 100) {
                indicator.style.height = Math.min(diff * 0.5, 40) + 'px';
                indicator.style.opacity = Math.min(diff / 80, 1);
                const rotation = (diff / 80) * 360;
                indicator.querySelector('.pull-spinner').style.transform = `rotate(${rotation}deg)`;
            }
        }, { passive: true });

        content.addEventListener('touchend', () => {
            pulling = false;
            indicator.style.height = '0';
            indicator.style.opacity = '0';
        }, { passive: true });
    }

    // === KEYBOARD SHORTCUTS ===
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Escape to close sidebar/modals
            if (e.key === 'Escape') {
                const sidebar = document.querySelector('.dash-sidebar.open');
                if (sidebar) sidebar.classList.remove('open');

                const modal = document.getElementById('studentModalOverlay');
                if (modal && modal.style.display !== 'none') {
                    modal.style.display = 'none';
                }

                const moreMenu = document.getElementById('moreMenu');
                const moreBackdrop = document.getElementById('moreMenuBackdrop');
                if (moreMenu) moreMenu.classList.remove('show');
                if (moreBackdrop) moreBackdrop.classList.remove('show');
            }
        });
    }

    // === EXPOSE UTILITIES ===
    window.MicroInteractions = {
        animateValue,
        staggerChildren,
        createRipple
    };

    // === INIT ALL ===
    function init() {
        initRipples();
        initScrollReveal();
        enhanceSectionTransitions();
        initTopbarShadow();
        initPullIndicator();
        initKeyboardShortcuts();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // Small delay to ensure other scripts load first
        setTimeout(init, 100);
    }
})();
