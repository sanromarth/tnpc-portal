document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = form.email.value.trim();
        const password = form.password.value.trim();

        
        if (errorMsg) {
            errorMsg.classList.remove("show");
            errorMsg.textContent = "";
        }

        const result = await loginUser(email, password);

        if (result.success) {
            if (result.role === "admin") {
                window.location.href = "admin-dashboard.html";
            } else {
                window.location.href = "student-dashboard.html";
            }
        } else {
            if (errorMsg) {
                errorMsg.textContent = result.message || "Login failed. Please try again.";
                errorMsg.classList.add("show");
            } else {
                alert(result.message || "Login failed");
            }
        }
    });
});
