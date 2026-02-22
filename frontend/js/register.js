let regEmail = "";
let regCountdownTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");
    const errorMsg = document.getElementById("errorMsg");
    if (!form) return;

    setupRegOTPInputs();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn.disabled) return;

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const password = form.password.value.trim();

        clearRegError();

        if (password.length < 6) {
            showRegError("Password must be at least 6 characters.");
            return;
        }

        submitBtn.disabled = true;
        const origText = submitBtn.textContent;
        submitBtn.textContent = "Sending OTP...";
        submitBtn.style.opacity = "0.7";

        try {
            const res = await fetch(`${API_BASE}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();

            if (res.ok && data.requiresOTP) {
                regEmail = email;
                document.getElementById("otpEmailDisplay").textContent = email;
                showOTPStep();
                startRegCountdown();
                showToast("OTP sent to your email!", "success");
            } else if (!res.ok) {
                showRegError(data.message || "Registration failed.");
            }
        } catch (err) {
            showRegError("Server is starting up, please wait 30 seconds and try again.");
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = origText;
            submitBtn.style.opacity = "1";
        }
    });

    const verifyBtn = document.getElementById("verifyRegOTPBtn");
    if (verifyBtn) {
        verifyBtn.addEventListener("click", async () => {
            const otp = getRegOTPValue();
            clearRegError();

            if (otp.length !== 6) {
                showRegError("Please enter the complete 6-digit OTP");
                return;
            }

            verifyBtn.disabled = true;
            verifyBtn.textContent = "Verifying...";

            try {
                const res = await fetch(`${API_BASE}/api/verify-registration-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: regEmail, otp })
                });
                const data = await res.json();

                if (res.ok) {
                    showToast("Registration complete! Redirecting to login...", "success");
                    setTimeout(() => { window.location.href = "login.html"; }, 2000);
                } else {
                    showRegError(data.message || "Verification failed.");
                    verifyBtn.disabled = false;
                    verifyBtn.textContent = "Verify & Complete Registration";
                }
            } catch (err) {
                showRegError("Network error. Please try again.");
                verifyBtn.disabled = false;
                verifyBtn.textContent = "Verify & Complete Registration";
            }
        });
    }
});

function setupRegOTPInputs() {
    const digits = document.querySelectorAll(".reg-otp-digit");
    digits.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const val = e.target.value.replace(/\D/g, "");
            e.target.value = val.charAt(0) || "";
            if (val && index < 5) digits[index + 1].focus();
        });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && !e.target.value && index > 0) {
                digits[index - 1].focus();
            }
        });
        input.addEventListener("paste", (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
            digits.forEach((d, i) => { d.value = paste[i] || ""; });
            if (paste.length >= 6) digits[5].focus();
        });
    });
}

function getRegOTPValue() {
    return Array.from(document.querySelectorAll(".reg-otp-digit")).map(d => d.value).join("");
}

function showOTPStep() {
    document.getElementById("regStep1").classList.add("hidden");
    document.getElementById("regStep2").classList.add("active");
    document.getElementById("regDot1").classList.remove("active");
    document.getElementById("regDot1").classList.add("done");
    document.getElementById("regDot2").classList.add("active");
}

async function regResendOTP() {
    clearRegError();
    try {
        const res = await fetch(`${API_BASE}/api/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: regEmail, purpose: "verification" })
        });
        const data = await res.json();
        if (res.ok) {
            showToast("OTP resent!", "success");
            startRegCountdown();
        } else {
            showRegError(data.message || "Failed to resend OTP");
        }
    } catch (err) {
        showRegError("Network error");
    }
}

function startRegCountdown() {
    let seconds = 60;
    const countdownEl = document.getElementById("regCountdown");
    const timerText = document.getElementById("regTimerText");
    const resendBtn = document.getElementById("regResendBtn");

    resendBtn.disabled = true;
    timerText.style.display = "block";

    if (regCountdownTimer) clearInterval(regCountdownTimer);

    regCountdownTimer = setInterval(() => {
        seconds--;
        countdownEl.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(regCountdownTimer);
            timerText.style.display = "none";
            resendBtn.disabled = false;
        }
    }, 1000);
}

function showRegError(msg) {
    const el = document.getElementById("errorMsg");
    if (el) { el.textContent = msg; el.classList.add("show"); }
}

function clearRegError() {
    const el = document.getElementById("errorMsg");
    if (el) { el.textContent = ""; el.classList.remove("show"); }
}
