
document.addEventListener("DOMContentLoaded", function() {
    showIBM();
});

function showIBM() {
    document.getElementById("ibmSection").classList.remove("hidden");
    document.getElementById("ictSection").classList.add("hidden");
    document.getElementById("ibmBtn").classList.add("active");
    document.getElementById("ictBtn").classList.remove("active");
    loadIBMData();
}

function showICT() {
    document.getElementById("ictSection").classList.remove("hidden");
    document.getElementById("ibmSection").classList.add("hidden");
    document.getElementById("ictBtn").classList.add("active");
    document.getElementById("ibmBtn").classList.remove("active");
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString("en-IN", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    } catch {
        return dateStr;
    }
}

function getStatusBadge(status) {
    if (!status) return '<span class="status-badge status-pending">—</span>';
    const lower = status.toLowerCase();
    if (lower === "completed") {
        return '<span class="status-badge status-completed">✓ Completed</span>';
    } else if (lower === "in-progress") {
        return '<span class="status-badge status-in-progress">⏳ In Progress</span>';
    } else {
        return `<span class="status-badge status-pending">${status}</span>`;
    }
}

async function loadIBMData() {
    const tbody = document.getElementById("ibmTableBody");
    const countBadge = document.getElementById("certCount");

    tbody.innerHTML = `
        <tr>
            <td colspan="5">
                <div class="cert-loader">
                    <div class="spinner"></div>
                    Loading certification records...
                </div>
            </td>
        </tr>
    `;

    try {
        const res = await fetch(`${API_BASE}/api/certifications/ibm`);

        if (!res.ok) {
            throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();

        if (!Array.isArray(data)) {
            throw new Error("Invalid response format from server");
        }

        if (countBadge) {
            countBadge.textContent = `${data.length} Students`;
        }

        if (data.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align:center; color:#6b7280; padding:40px 20px; font-size:15px;">
                        No certification records found.
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = "";

        data.forEach((student, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${index + 1}</td>
                <td style="text-align:left; font-weight:500;">${student.studentName || "—"}</td>
                <td>${student.course || "—"}</td>
                <td>${formatDate(student.completionDate)}</td>
                <td>${getStatusBadge(student.status)}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Error fetching IBM certifications:", error);
        if (countBadge) {
            countBadge.textContent = "0 Students";
        }
        tbody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="cert-error">
                        ⚠️ Failed to load certification data. Please check your backend connection.<br>
                        <small style="color:#999;">${error.message}</small>
                    </div>
                </td>
            </tr>
        `;
    }
}