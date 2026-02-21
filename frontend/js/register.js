document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const errorMsg = document.getElementById("errorMsg");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn.disabled) return;

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value.trim();

        
        if (errorMsg) {
            errorMsg.classList.remove("show");
            errorMsg.textContent = "";
        }

        if (password.length < 6) {
            if (errorMsg) {
                errorMsg.textContent = "Password must be at least 6 characters.";
                errorMsg.classList.add("show");
            }
            return;
        }

        submitBtn.disabled = true;
        const origText = submitBtn.textContent;
        submitBtn.textContent = "Registering...";
        submitBtn.style.opacity = "0.7";

        try {
            const result = await registerUser({ name, email, password });

            if (!result.success) {
                submitBtn.disabled = false;
                submitBtn.textContent = origText;
                submitBtn.style.opacity = "1";
                if (errorMsg) {
                    errorMsg.textContent = result.message || "Registration failed.";
                    errorMsg.classList.add("show");
                } else {
                    alert(result.message);
                }
                return;
            }

            submitBtn.textContent = "Redirecting...";
            showToast("Registration successful! Redirecting to login...", "success");
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
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

