let resetEmail = "";
let resetOTP = "";
let countdownTimer = null;

document.addEventListener("DOMContentLoaded", () => {
    const emailForm = document.getElementById("emailForm");
    const newPasswordForm = document.getElementById("newPasswordForm");

    if (emailForm) {
        emailForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = emailForm.querySelector("button[type='submit']");
            const email = document.getElementById("resetEmail").value.trim();
            clearError();

            if (!email) return showError("Please enter your email");

            btn.disabled = true;
            btn.textContent = "Sending OTP...";

            try {
                const res = await fetch(`${API_BASE}/api/forgot-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email })
                });
                const data = await res.json();

                if (res.ok) {
                    resetEmail = email;
                    goToStep(2);
                    startCountdown();
                    showToast("OTP sent to your email!", "success");
                } else {
                    showError(data.message || "Failed to send OTP");
                }
            } catch (err) {
                showError("Network error. Please try again.");
            } finally {
                btn.disabled = false;
                btn.textContent = "Send OTP";
            }
        });
    }

    if (newPasswordForm) {
        newPasswordForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const btn = newPasswordForm.querySelector("button[type='submit']");
            const newPassword = document.getElementById("newPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            clearError();

            if (newPassword.length < 6) return showError("Password must be at least 6 characters");
            if (newPassword !== confirmPassword) return showError("Passwords do not match");

            btn.disabled = true;
            btn.textContent = "Resetting...";

            try {
                const res = await fetch(`${API_BASE}/api/reset-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: resetEmail, otp: resetOTP, newPassword })
                });
                const data = await res.json();

                if (res.ok) {
                    showToast("Password reset successful! Redirecting to login...", "success");
                    setTimeout(() => { window.location.href = "login.html"; }, 2000);
                } else {
                    showError(data.message || "Reset failed");
                    btn.disabled = false;
                    btn.textContent = "Reset Password";
                }
            } catch (err) {
                showError("Network error. Please try again.");
                btn.disabled = false;
                btn.textContent = "Reset Password";
            }
        });
    }

    setupOTPInputs();
});

function setupOTPInputs() {
    const digits = document.querySelectorAll(".otp-digit");
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

function getOTPValue() {
    return Array.from(document.querySelectorAll(".otp-digit")).map(d => d.value).join("");
}

async function verifyOTP() {
    const otp = getOTPValue();
    clearError();
    if (otp.length !== 6) return showError("Please enter the complete 6-digit OTP");

    try {
        const res = await fetch(`${API_BASE}/api/verify-reset-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: resetEmail, otp })
        });
        const data = await res.json();

        if (res.ok && data.verified) {
            resetOTP = otp;
            goToStep(3);
            showToast("OTP verified! Set your new password.", "success");
        } else {
            showError(data.message || "Invalid OTP");
        }
    } catch (err) {
        showError("Network error. Please try again.");
    }
}

async function resendOTP() {
    clearError();
    try {
        const res = await fetch(`${API_BASE}/api/resend-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: resetEmail, purpose: "reset" })
        });
        const data = await res.json();
        if (res.ok) {
            showToast("OTP resent!", "success");
            startCountdown();
        } else {
            showError(data.message || "Failed to resend");
        }
    } catch (err) {
        showError("Network error");
    }
}

function goToStep(step) {
    document.querySelectorAll(".otp-step").forEach(s => s.classList.remove("active"));
    document.getElementById("step" + step).classList.add("active");

    for (let i = 1; i <= 3; i++) {
        const dot = document.getElementById("dot" + i);
        dot.classList.remove("active", "done");
        if (i < step) dot.classList.add("done");
        else if (i === step) dot.classList.add("active");
    }
}

function startCountdown() {
    let seconds = 60;
    const countdownEl = document.getElementById("countdown");
    const timerText = document.getElementById("timerText");
    const resendBtn = document.getElementById("resendBtn");

    resendBtn.disabled = true;
    timerText.style.display = "block";

    if (countdownTimer) clearInterval(countdownTimer);

    countdownTimer = setInterval(() => {
        seconds--;
        countdownEl.textContent = seconds;
        if (seconds <= 0) {
            clearInterval(countdownTimer);
            timerText.style.display = "none";
            resendBtn.disabled = false;
        }
    }, 1000);
}

function showError(msg) {
    const el = document.getElementById("errorMsg");
    if (el) { el.textContent = msg; el.classList.add("show"); }
}

function clearError() {
    const el = document.getElementById("errorMsg");
    if (el) { el.textContent = ""; el.classList.remove("show"); }
}
