
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
    }

    
    if (navbar) {
        window.addEventListener("scroll", () => {
            navbar.classList.toggle("scrolled", window.scrollY > 50);
        });
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

    
    const scrollTopBtn = document.createElement("button");
    scrollTopBtn.className = "scroll-top-btn";
    scrollTopBtn.innerHTML = "↑";
    scrollTopBtn.setAttribute("aria-label", "Scroll to top");
    document.body.appendChild(scrollTopBtn);

    window.addEventListener("scroll", () => {
        scrollTopBtn.classList.toggle("visible", window.scrollY > 400);
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});