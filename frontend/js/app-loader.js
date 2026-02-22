/* ============================================
   APP LOADER + MOBILE BOTTOM NAV — Controller
   ============================================ */

// === SPLASH SCREEN LOADER ===
(function initLoader() {
    const loader = document.getElementById("appLoader");
    if (!loader) return;

    // Auto-dismiss after content loads (or max 2.2s)
    const dismiss = () => {
        loader.classList.add("fade-out");
        setTimeout(() => loader.remove(), 500);
    };

    if (document.readyState === "complete") {
        setTimeout(dismiss, 800);
    } else {
        window.addEventListener("load", () => setTimeout(dismiss, 600));
        setTimeout(dismiss, 2200); // safety timeout
    }
})();


// === MOBILE BOTTOM NAVIGATION ===
function initBottomNav() {
    const nav = document.getElementById("mobileBottomNav");
    if (!nav) return;

    const items = nav.querySelectorAll(".bottom-nav-item:not(.bottom-nav-more)");
    const moreBtn = nav.querySelector(".bottom-nav-more");
    const moreMenu = document.getElementById("moreMenu");
    const moreBackdrop = document.getElementById("moreMenuBackdrop");

    // Highlight active tab
    function setActiveTab(section) {
        items.forEach(item => {
            item.classList.toggle("active", item.dataset.section === section);
        });
        if (moreMenu) {
            const moreItems = moreMenu.querySelectorAll(".more-menu-item");
            let moreActive = false;
            moreItems.forEach(item => {
                const isActive = item.dataset.section === section;
                if (isActive) moreActive = true;
            });
            if (moreBtn) moreBtn.classList.toggle("active", moreActive);
        }
    }

    // Tab click
    items.forEach(item => {
        item.addEventListener("click", function() {
            const section = this.dataset.section;
            if (!section) return;
            // Find matching sidebar nav item and trigger it
            const sidebarItem = document.querySelector(`.sidebar-nav .nav-item[onclick*="${section}"]`);
            if (sidebarItem) sidebarItem.click();
            setActiveTab(section);
            closeMoreMenu();
        });
    });

    // More menu
    if (moreBtn && moreMenu && moreBackdrop) {
        moreBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            const isOpen = moreMenu.classList.contains("show");
            if (isOpen) {
                closeMoreMenu();
            } else {
                moreMenu.classList.add("show");
                moreBackdrop.classList.add("show");
            }
        });

        moreBackdrop.addEventListener("click", closeMoreMenu);

        // More menu item clicks
        const moreItems = moreMenu.querySelectorAll(".more-menu-item");
        moreItems.forEach(item => {
            item.addEventListener("click", function() {
                const section = this.dataset.section;
                if (!section) return;
                const sidebarItem = document.querySelector(`.sidebar-nav .nav-item[onclick*="${section}"]`);
                if (sidebarItem) sidebarItem.click();
                setActiveTab(section);
                closeMoreMenu();
            });
        });
    }

    function closeMoreMenu() {
        if (moreMenu) moreMenu.classList.remove("show");
        if (moreBackdrop) moreBackdrop.classList.remove("show");
    }

    // Sync with sidebar navigation
    const observer = new MutationObserver(() => {
        const activeSection = document.querySelector(".dash-section.active");
        if (activeSection) {
            const sectionId = activeSection.id.replace("sec-", "");
            setActiveTab(sectionId);
        }
    });

    const content = document.querySelector(".dash-content");
    if (content) {
        observer.observe(content, { subtree: true, attributes: true, attributeFilter: ["class"] });
    }

    // Set initial active
    const activeSection = document.querySelector(".dash-section.active");
    if (activeSection) {
        setActiveTab(activeSection.id.replace("sec-", ""));
    }
}

// Init on DOM ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBottomNav);
} else {
    initBottomNav();
}
