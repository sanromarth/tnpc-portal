async function registerUser(userData) {
    try {
        const response = await fetch(`${API_BASE}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message };
        }

        return { success: true };

    } catch (error) {
        return { success: false, message: "Server not reachable. Please try again later." };
    }
}

async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE}/api/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message };
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userName", data.name);
        if (data.userId) localStorage.setItem("userId", data.userId);

        return { success: true, role: data.role, name: data.name };

    } catch (error) {
        return { success: false, message: "Server not reachable. Please try again later." };
    }
}

function logoutUser() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    window.location.href = "login.html";
}

async function protectPage(requiredRole) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    if (requiredRole && role !== requiredRole) {
        window.location.href = "index.html";
        return false;
    }

    
    try {
        const res = await fetch(`${API_BASE}/api/profile`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) {
            
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userName");
            window.location.href = "login.html";
            return false;
        }
    } catch (e) {
        
        console.warn("Token verification skipped (offline):", e.message);
    }

    return true;
}

