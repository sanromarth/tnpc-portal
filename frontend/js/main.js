
document.addEventListener("DOMContentLoaded", () => {
    // ── Navbar toggle logic (hamburger, dropdown, scroll shadow)
    //    is now handled declaratively via Alpine.js directives in the HTML.
    //    See x-data="{ mobileOpen, certOpen }" on <header>.


    
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