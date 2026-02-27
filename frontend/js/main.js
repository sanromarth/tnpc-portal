
document.addEventListener("DOMContentLoaded", () => {
    const certDropdown = document.getElementById("certDropdown");
    const certToggle = document.getElementById("certToggle");
    const hamburger = document.getElementById("hamburger");
    const navLinksMenu = document.getElementById("navLinks");
    const navbar = document.getElementById("navbar");

    
    if (certToggle && certDropdown) {
        certToggle.addEventListener("click", function (e) {
            e.preventDefault();
            certDropdown.classList.toggle("active");
        });

        document.addEventListener("click", function (e) {
            if (!certDropdown.contains(e.target)) {
                certDropdown.classList.remove("active");
            }
        });
    }

    
    if (hamburger && navLinksMenu) {
        hamburger.addEventListener("click", () => {
            navLinksMenu.classList.toggle("active");
            hamburger.classList.toggle("active");
            hamburger.setAttribute("aria-expanded",
                navLinksMenu.classList.contains("active") ? "true" : "false"
            );
        });

        // Auto-close mobile nav when a link is clicked
        navLinksMenu.querySelectorAll("a:not(.dropdown a)").forEach(link => {
            link.addEventListener("click", () => {
                if (window.innerWidth <= 768) {
                    navLinksMenu.classList.remove("active");
                    hamburger.classList.remove("active");
                    hamburger.setAttribute("aria-expanded", "false");
                }
            });
        });
    }

    
    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        }, { passive: true });
    }

    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });

    
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPage) {
            link.classList.add("active");
        }
    });

    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    if (token && role) {
        if (loginBtn) {
            loginBtn.textContent = "Dashboard";
            loginBtn.className = "btn-yellow";
            loginBtn.onclick = () => { window.location.href = role === "admin" ? "admin-dashboard.html" : "student-dashboard.html"; };
        }
        if (registerBtn) {
            registerBtn.textContent = "Logout";
            registerBtn.className = "btn-outline";
            registerBtn.onclick = () => {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("userName");
                localStorage.removeItem("userId");
                window.location.reload();
            };
        }
    } else {
        if (loginBtn) loginBtn.onclick = () => { window.location.href = "login.html"; };
        if (registerBtn) registerBtn.onclick = () => { window.location.href = "register.html"; };
    }

    
    const scrollTopBtn = document.createElement("button");
    scrollTopBtn.className = "scroll-top-btn";
    scrollTopBtn.innerHTML = "↑";
    scrollTopBtn.setAttribute("aria-label", "Scroll to top");
    document.body.appendChild(scrollTopBtn);

    window.addEventListener("scroll", () => {
        scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});