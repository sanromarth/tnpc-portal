
const API_BASE = "https://tnpc-backend.onrender.com";

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
}
function handleAuthError(res) {
    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        const currentPage = window.location.pathname.split("/").pop();
        if (currentPage !== "login.html" && currentPage !== "register.html" && currentPage !== "index.html") {
            window.location.href = "login.html";
        }
    }
}

async function apiGet(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        headers: getAuthHeaders()
    });
    if (!res.ok) {
        handleAuthError(res);
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Request failed (${res.status})`);
    }
    return res.json();
}

async function apiPost(endpoint, body) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        handleAuthError(res);
        throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
}

async function apiPut(endpoint, body) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        handleAuthError(res);
        throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
}

async function apiPatch(endpoint, body) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        body: JSON.stringify(body)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        handleAuthError(res);
        throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
}

async function apiDelete(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        handleAuthError(res);
        throw new Error(data.message || `Request failed (${res.status})`);
    }
    return data;
}
function showToast(message, type = "info") {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <span class="toast-icon">${type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}</span>
        <span class="toast-message">${message}</span>
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

