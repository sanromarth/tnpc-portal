
const API_BASE = "https://tnpc-backend.onrender.com";

function getAuthHeaders() {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    return headers;
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
    // Use Notyf if available (CDN loaded on dashboard pages)
    if (typeof Notyf !== 'undefined') {
        if (!window._notyfInstance) {
            window._notyfInstance = new Notyf({
                duration: 3500,
                position: { x: 'right', y: 'top' },
                dismissible: true,
                ripple: true,
                types: [
                    { type: 'info', background: '#1e4f9a', icon: { className: 'notyf-icon', tagName: 'span', text: 'ℹ' } },
                    { type: 'warning', background: '#FBC02D', icon: false }
                ]
            });
        }
        const notyf = window._notyfInstance;
        if (type === 'success') notyf.success(message);
        else if (type === 'error') notyf.error(message);
        else notyf.open({ type: 'info', message });
        return;
    }

    // Fallback: DOM-based toast for pages without Notyf
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = `toast-notification toast-${type}`;

    const icon = document.createElement("span");
    icon.className = "toast-icon";
    icon.textContent = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";

    const msg = document.createElement("span");
    msg.className = "toast-message";
    msg.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(msg);
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

