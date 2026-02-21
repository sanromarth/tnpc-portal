document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const errorMsg = document.getElementById("errorMsg");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn.disabled) return;

        const email = form.email.value.trim();
        const password = form.password.value.trim();

        
        if (errorMsg) {
            errorMsg.classList.remove("show");
            errorMsg.textContent = "";
        }

        submitBtn.disabled = true;
        const origText = submitBtn.textContent;
        submitBtn.textContent = "Signing In...";
        submitBtn.style.opacity = "0.7";

        try {
            const result = await loginUser(email, password);

            if (result.success) {
                submitBtn.textContent = "Redirecting...";
                if (result.role === "admin") {
                    window.location.href = "admin-dashboard.html";
                } else {
                    window.location.href = "student-dashboard.html";
                }
            } else {
                submitBtn.disabled = false;
                submitBtn.textContent = origText;
                submitBtn.style.opacity = "1";
                if (errorMsg) {
                    errorMsg.textContent = result.message || "Login failed. Please try again.";
                    errorMsg.classList.add("show");
                } else {
                    alert(result.message || "Login failed");
                }
            }
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
            submitBtn.style.opacity = "1";
            if (errorMsg) {
                errorMsg.textContent = "Something went wrong. Please try again.";
                errorMsg.classList.add("show");
            }
        }
    });
});
