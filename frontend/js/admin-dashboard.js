(async () => {
    const allowed = await protectPage("admin");
    if (!allowed) return;
})();

const adminUserName = localStorage.getItem("userName");
if (adminUserName) document.getElementById("adminName").textContent = "👤 " + adminUserName;

let allCertsData = [];

function animateCounters() {
    document.querySelectorAll(".counter").forEach(el => {
        const target = parseInt(el.getAttribute("data-target")) || 0;
        if (target === 0) return;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = current;
        }, 40);
    });
}

function showAdminSection(section, navEl) {
    document.querySelectorAll(".dash-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    const target = document.getElementById("sec-" + section);
    if (target) target.classList.add("active");
    if (navEl) navEl.classList.add("active");
    document.getElementById("adminSidebar").classList.remove("open");

    if (section === "students") loadStudentsList();
    if (section === "postjob") loadJobsList();
    if (section === "applications") loadApplicationsList();
    if (section === "certifications") loadCertsList();
    if (section === "placements") loadPlacementsList();
    if (section === "trainings") loadTrainingsList();
    if (section === "corporates") loadCorporatesList();
    if (section === "announcements") loadAnnouncementsList();
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const stats = await getDashboardStats();
        document.getElementById("statStudents").setAttribute("data-target", stats.totalStudents || 0);
        document.getElementById("statPlaced").setAttribute("data-target", stats.placedStudents || 0);
        document.getElementById("statJobs").setAttribute("data-target", stats.activeJobs || 0);
        document.getElementById("statApps").setAttribute("data-target", stats.totalApplications || 0);
        document.getElementById("statPending").setAttribute("data-target", stats.pendingApplications || 0);
        document.getElementById("statShortlisted").setAttribute("data-target", stats.shortlistedApplications || 0);
        document.getElementById("statAccepted").setAttribute("data-target", stats.acceptedApplications || 0);
        document.getElementById("statRate").textContent = stats.placementRate + "%";

        document.getElementById("funnelApplied").setAttribute("data-target", stats.totalApplications || 0);
        document.getElementById("funnelShortlisted").setAttribute("data-target", stats.shortlistedApplications || 0);
        document.getElementById("funnelSelected").setAttribute("data-target", stats.acceptedApplications || 0);
        document.getElementById("funnelRejected").setAttribute("data-target", Math.max(0, (stats.totalApplications || 0) - (stats.pendingApplications || 0) - (stats.shortlistedApplications || 0) - (stats.acceptedApplications || 0)));

        animateCounters();
        loadRecentActivity(stats);
    } catch (e) { console.warn("Stats error:", e.message); }

    try {
        const analytics = await getAdminAnalytics();
        renderCharts(analytics);
    } catch (e) { console.warn("Analytics error:", e.message); }

    loadStudentLeaderboard();
    loadAdminDeadlines();
});

function renderCharts(data) {
    if (data.departmentWise && data.departmentWise.length) {
        const ctx = document.getElementById("chartDept");
        if (ctx) new Chart(ctx, {
            type: "bar",
            data: {
                labels: data.departmentWise.map(d => d.course),
                datasets: [
                    { label: "Total", data: data.departmentWise.map(d => d.total), backgroundColor: "rgba(30,79,154,0.8)", borderRadius: 6 },
                    { label: "Placed", data: data.departmentWise.map(d => d.placed), backgroundColor: "rgba(46,125,50,0.8)", borderRadius: 6 }
                ]
            },
            options: { responsive: true, plugins: { legend: { position: "bottom", labels: { color: "#ccc" } } }, scales: { y: { beginAtZero: true, ticks: { color: "#999" } }, x: { ticks: { color: "#999" } } } }
        });
    }

    if (data.yearWise && data.yearWise.length) {
        const ctx = document.getElementById("chartYear");
        if (ctx) new Chart(ctx, {
            type: "line",
            data: {
                labels: data.yearWise.map(d => d.batch),
                datasets: [{
                    label: "Placement %", data: data.yearWise.map(d => d.percentage),
                    borderColor: "#FBC02D", backgroundColor: "rgba(251,192,45,0.1)",
                    fill: true, tension: 0.4, pointRadius: 5, pointBackgroundColor: "#FBC02D"
                }]
            },
            options: { responsive: true, plugins: { legend: { position: "bottom", labels: { color: "#ccc" } } }, scales: { y: { beginAtZero: true, max: 100, ticks: { color: "#999" } }, x: { ticks: { color: "#999" } } } }
        });
    }

    if (data.cgpaDistribution && data.cgpaDistribution.length) {
        const ctx = document.getElementById("chartCGPA");
        if (ctx) new Chart(ctx, {
            type: "doughnut",
            data: {
                labels: data.cgpaDistribution.map(d => d.range),
                datasets: [{ data: data.cgpaDistribution.map(d => d.count), backgroundColor: ["#C62828", "#e65100", "#FBC02D", "#2e7d32", "#1e4f9a"] }]
            },
            options: { responsive: true, plugins: { legend: { position: "bottom", labels: { color: "#ccc" } } } }
        });
    }
}

function loadRecentActivity(stats) {
    const el = document.getElementById("recentActivity");
    if (!el) return;
    el.innerHTML = `<div class="activity-list">
        <div class="activity-item">📋 <strong>${stats.pendingApplications || 0}</strong> applications pending review</div>
        <div class="activity-item">⭐ <strong>${stats.shortlistedApplications || 0}</strong> students shortlisted</div>
        <div class="activity-item">✅ <strong>${stats.acceptedApplications || 0}</strong> students selected</div>
        <div class="activity-item">💼 <strong>${stats.activeJobs || 0}</strong> active job postings</div>
        <div class="activity-item">👨‍🎓 <strong>${stats.totalStudents || 0}</strong> registered students</div>
    </div>`;
}

async function loadStudentLeaderboard() {
    const el = document.getElementById("studentLeaderboard");
    try {
        const students = await getStudents({ minCgpa: 7 });
        const sorted = students.sort((a, b) => (b.cgpa || 0) - (a.cgpa || 0)).slice(0, 8);
        if (!sorted.length) { el.innerHTML = '<div class="empty-state">No students with CGPA ≥ 7</div>'; return; }
        el.innerHTML = '<div class="leaderboard-list">' + sorted.map((s, i) => {
            const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`;
            return `<div class="lb-item">
                <span class="lb-rank">${medal}</span>
                <div class="lb-info"><strong>${s.name}</strong><span>${s.course || '—'} | ${s.specialization || '—'}</span></div>
                <span class="lb-cgpa">${(s.cgpa || 0).toFixed(2)}</span>
            </div>`;
        }).join('') + '</div>';
    } catch (e) { el.innerHTML = '<div class="empty-state">Could not load</div>'; }
}

async function loadAdminDeadlines() {
    const el = document.getElementById("adminDeadlines");
    try {
        const jobs = await getJobs();
        const now = new Date();
        const upcoming = jobs.filter(j => j.deadline && new Date(j.deadline) > now && j.status === "active")
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 6);
        if (!upcoming.length) { el.innerHTML = '<div class="empty-state">No upcoming deadlines</div>'; return; }
        el.innerHTML = '<div class="deadline-list">' + upcoming.map(j => {
            const dl = new Date(j.deadline);
            const diff = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
            const urgency = diff <= 2 ? "urgent" : diff <= 5 ? "soon" : "normal";
            return `<div class="deadline-item ${urgency}">
                <div class="dl-left"><strong>${j.company}</strong> — ${j.role}
                    <span class="dl-date">📅 ${dl.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
                <div class="dl-countdown"><span class="dl-days">${diff}</span><span class="dl-label">${diff === 1 ? 'day' : 'days'}</span></div>
            </div>`;
        }).join('') + '</div>';
    } catch (e) { el.innerHTML = '<div class="empty-state">Could not load</div>'; }
}

async function loadStudentsList() {
    const tbody = document.getElementById("studentsBody");
    tbody.innerHTML = '<tr><td colspan="8" class="loading-state">Loading...</td></tr>';
    try {
        const params = {};
        const search = document.getElementById("studentSearch").value;
        const course = document.getElementById("studentCourseFilter").value;
        const status = document.getElementById("studentStatusFilter").value;
        if (search) params.search = search;
        if (course) params.course = course;
        if (status) params.status = status;
        const students = await getStudents(params);
        if (!students.length) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">No students found</td></tr>'; return; }
        tbody.innerHTML = students.map(s => `
            <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.email}</td>
                <td>${s.course || '—'}</td>
                <td>${s.specialization || '—'}</td>
                <td>${s.batch || '—'}</td>
                <td>${s.cgpa || '—'}</td>
                <td><span class="status-pill ${s.placementStatus === 'placed' ? 'status-accepted' : s.placementStatus === 'opted-out' ? 'status-shortlisted' : 'status-pending'}">${s.placementStatus || 'not-placed'}</span></td>
                <td>
                    <select onchange="updateStudentPlacementStatus('${s._id}', this.value)" class="inline-select">
                        <option value="not-placed" ${s.placementStatus === 'not-placed' ? 'selected' : ''}>Not Placed</option>
                        <option value="placed" ${s.placementStatus === 'placed' ? 'selected' : ''}>Placed</option>
                        <option value="opted-out" ${s.placementStatus === 'opted-out' ? 'selected' : ''}>Opted Out</option>
                    </select>
                </td>
            </tr>`).join('');
    } catch (e) { tbody.innerHTML = '<tr><td colspan="8" class="empty-state">Failed to load</td></tr>'; }
}

async function updateStudentPlacementStatus(id, status) {
    try { await updateStudentStatus(id, status); showToast("Status updated!", "success"); }
    catch (e) { showToast("Failed to update", "error"); }
}

async function exportStudents() {
    try {
        const blob = await exportStudentsCSV();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "students.csv"; a.click();
        URL.revokeObjectURL(url);
        showToast("Export downloaded!", "success");
    } catch (e) { showToast("Export failed", "error"); }
}

document.getElementById("addJobForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const skills = document.getElementById("jobSkills").value.split(",").map(s => s.trim()).filter(Boolean);
    try {
        await createJob({
            company: document.getElementById("jobCompany").value,
            role: document.getElementById("jobRole").value,
            salary: document.getElementById("jobSalary").value,
            location: document.getElementById("jobLocation").value,
            type: document.getElementById("jobType").value,
            eligibility: parseFloat(document.getElementById("jobEligibility").value) || 0,
            deadline: document.getElementById("jobDeadline").value,
            description: document.getElementById("jobDesc").value, skills
        });
        showToast("Job posted! 🚀", "success");
        document.getElementById("addJobForm").reset();
        loadJobsList();
    } catch (err) { showToast(err.message || "Failed", "error"); }
});

async function loadJobsList() {
    const el = document.getElementById("jobsList");
    el.innerHTML = '<div class="loading-state">Loading...</div>';
    try {
        const jobs = await getJobs();
        if (!jobs.length) { el.innerHTML = '<div class="empty-state">No jobs posted yet</div>'; return; }
        el.innerHTML = '<div class="admin-list">' + jobs.map(j => `
            <div class="admin-list-item">
                <div class="ali-left">
                    <strong>${j.company}</strong> — ${j.role}
                    <span class="ali-meta">💰 ${j.salary || 'N/A'} | 📅 ${j.deadline ? new Date(j.deadline).toLocaleDateString("en-IN") : 'No deadline'} | ${j.type}</span>
                </div>
                <button class="btn-danger btn-xs" onclick="removeJob('${j._id}')">🗑️</button>
            </div>`).join('') + '</div>';
    } catch (e) { el.innerHTML = '<div class="empty-state">Failed to load</div>'; }
}

async function removeJob(id) {
    if (!confirm("Delete this job?")) return;
    try { await deleteJob(id); showToast("Job deleted", "success"); loadJobsList(); }
    catch (e) { showToast("Failed", "error"); }
}

async function loadApplicationsList() {
    const tbody = document.getElementById("appsBody");
    tbody.innerHTML = '<tr><td colspan="6" class="loading-state">Loading...</td></tr>';
    try {
        const apps = await getApplications();
        const filter = document.getElementById("appStatusFilter").value;
        let filtered = apps;
        if (filter) filtered = apps.filter(a => a.status === filter);
        if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No applications</td></tr>'; return; }
        tbody.innerHTML = filtered.map(a => {
            const student = a.studentId || {};
            const job = a.jobId || {};
            return `<tr>
                <td><strong>${student.name || '—'}</strong></td>
                <td>${job.company || '—'}</td><td>${job.role || '—'}</td>
                <td>${new Date(a.appliedAt).toLocaleDateString("en-IN")}</td>
                <td><span class="status-pill status-${a.status}">${a.status}</span></td>
                <td><select onchange="updateApp('${a._id}', this.value)" class="inline-select">
                    <option value="pending" ${a.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="shortlisted" ${a.status === 'shortlisted' ? 'selected' : ''}>Shortlisted</option>
                    <option value="accepted" ${a.status === 'accepted' ? 'selected' : ''}>Accepted</option>
                    <option value="rejected" ${a.status === 'rejected' ? 'selected' : ''}>Rejected</option>
                </select></td></tr>`;
        }).join('');
    } catch (e) { tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Failed to load</td></tr>'; }
}

async function updateApp(id, status) {
    try { await updateApplicationStatus(id, status); showToast("Updated!", "success"); loadApplicationsList(); }
    catch (e) { showToast("Failed", "error"); }
}

async function loadCertsList() {
    const tbody = document.getElementById("adminCertBody");
    tbody.innerHTML = '<tr><td colspan="5" class="loading-state">Loading...</td></tr>';
    try {
        const certs = await getIBMCertifications();
        allCertsData = Array.isArray(certs) ? certs : [];
        renderCertsTable(allCertsData);
    }
    catch (e) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state">Failed to load</td></tr>'; }
}
function filterCerts() {
    const q = (document.getElementById("certSearch").value || "").toLowerCase();
    renderCertsTable(q ? allCertsData.filter(c => (c.studentName || "").toLowerCase().includes(q)) : allCertsData);
}
function renderCertsTable(certs) {
    const tbody = document.getElementById("adminCertBody");
    if (!certs.length) { tbody.innerHTML = '<tr><td colspan="5" class="empty-state">No certifications found</td></tr>'; return; }
    tbody.innerHTML = certs.map((c, i) => `<tr><td>${i + 1}</td><td><strong>${c.studentName || '—'}</strong></td><td>${c.course || '—'}</td>
        <td>${c.completionDate ? new Date(c.completionDate).toLocaleDateString("en-IN") : '—'}</td>
        <td><span class="status-pill ${c.status === 'Completed' ? 'status-accepted' : 'status-pending'}">${c.status || '—'}</span></td></tr>`).join('');
}

async function loadPlacementsList() {
    const tbody = document.getElementById("placementsBody");
    tbody.innerHTML = '<tr><td colspan="9" class="loading-state">Loading...</td></tr>';
    try {
        const placements = await getPlacements();
        const filtered = placements.filter(p => p.yearOrder >= 2017);
        if (!filtered.length) { tbody.innerHTML = '<tr><td colspan="9" class="empty-state">No records</td></tr>'; return; }
        tbody.innerHTML = filtered.map(p => `<tr><td>${p.batch}</td><td>${p.totalStudents||0}</td><td>${p.eligibleStudents||0}</td>
            <td>${p.placementsOffered||0}</td><td>${p.companiesVisited||0}</td><td>${p.highestCTC||0}</td><td>${p.avgCTC||0}</td><td>${p.percentage||0}%</td>
            <td><button class="btn-danger btn-xs" onclick="removePlacement('${p._id}')">🗑️</button></td></tr>`).join('');
    } catch (e) { tbody.innerHTML = '<tr><td colspan="9" class="empty-state">Failed to load</td></tr>'; }
}

document.getElementById("addPlacementForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await addPlacement({ batch: document.getElementById("plBatch").value, yearOrder: parseInt(document.getElementById("plYear").value),
            totalStudents: parseInt(document.getElementById("plTotal").value)||0, eligibleStudents: parseInt(document.getElementById("plEligible").value)||0,
            placementsOffered: parseInt(document.getElementById("plOffers").value)||0, companiesVisited: parseInt(document.getElementById("plCompanies").value)||0,
            highestCTC: parseFloat(document.getElementById("plHighCTC").value)||0, avgCTC: parseFloat(document.getElementById("plAvgCTC").value)||0,
            percentage: parseInt(document.getElementById("plPercent").value)||0 });
        showToast("Record added!", "success"); document.getElementById("addPlacementForm").reset(); loadPlacementsList();
    } catch (e) { showToast(e.message || "Failed", "error"); }
});

async function removePlacement(id) { if (!confirm("Delete?")) return; try { await deletePlacement(id); showToast("Deleted", "success"); loadPlacementsList(); } catch (e) { showToast("Failed", "error"); } }

async function loadTrainingsList() {
    const el = document.getElementById("trainingsList"); el.innerHTML = '<div class="loading-state">Loading...</div>';
    try {
        const trainings = await getTrainings();
        if (!trainings.length) { el.innerHTML = '<div class="empty-state">No events yet</div>'; return; }
        el.innerHTML = '<div class="admin-list">' + trainings.map(t => `<div class="admin-list-item">
            <div class="ali-left"><strong>${t.title}</strong>
            <span class="ali-meta">${t.type} | 📅 ${new Date(t.date).toLocaleDateString("en-IN")} | ${t.status} ${t.company ? '| 🏢 '+t.company : ''}</span></div>
            <button class="btn-danger btn-xs" onclick="removeTraining('${t._id}')">🗑️</button></div>`).join('') + '</div>';
    } catch (e) { el.innerHTML = '<div class="empty-state">Failed to load</div>'; }
}

document.getElementById("addTrainingForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await addTraining({ title: document.getElementById("trTitle").value, type: document.getElementById("trType").value,
            date: document.getElementById("trDate").value, venue: document.getElementById("trVenue").value,
            company: document.getElementById("trCompany").value, status: document.getElementById("trStatus").value,
            description: document.getElementById("trDesc").value });
        showToast("Event added! 📅", "success"); document.getElementById("addTrainingForm").reset(); loadTrainingsList();
    } catch (e) { showToast(e.message || "Failed", "error"); }
});
async function removeTraining(id) { if (!confirm("Delete?")) return; try { await deleteTraining(id); showToast("Deleted", "success"); loadTrainingsList(); } catch (e) { showToast("Failed", "error"); } }

document.getElementById("addCorporateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await addTopCorporate({ name: document.getElementById("corpName").value, type: document.getElementById("corpType").value,
            logo: document.getElementById("corpLogo").value, description: document.getElementById("corpDesc").value });
        showToast("Corporate added!", "success"); document.getElementById("addCorporateForm").reset(); loadCorporatesList();
    } catch (e) { showToast(e.message || "Failed", "error"); }
});

async function loadCorporatesList() {
    const el = document.getElementById("corporatesList"); el.innerHTML = '<div class="loading-state">Loading...</div>';
    try {
        const corps = await getTopCorporates();
        if (!corps.length) { el.innerHTML = '<div class="empty-state">No corporates</div>'; return; }
        el.innerHTML = '<div class="admin-list">' + corps.map(c => `<div class="admin-list-item">
            <div class="ali-left">${c.logo ? `<img src="${c.logo}" class="ali-logo" alt="${c.name}">` : ''}
            <strong>${c.name}</strong><span class="ali-meta">${c.type||''} ${c.description ? '| '+c.description.substring(0,80) : ''}</span></div>
            <button class="btn-danger btn-xs" onclick="removeCorporate('${c._id}')">🗑️</button></div>`).join('') + '</div>';
    } catch (e) { el.innerHTML = '<div class="empty-state">Failed to load</div>'; }
}
async function removeCorporate(id) { if (!confirm("Delete?")) return; try { await deleteTopCorporate(id); showToast("Deleted", "success"); loadCorporatesList(); } catch (e) { showToast("Failed", "error"); } }

document.getElementById("addAnnouncementForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        await postNotification({ title: document.getElementById("annTitle").value, message: document.getElementById("annMessage").value,
            priority: document.getElementById("annPriority").value, type: document.getElementById("annType").value,
            targetRole: document.getElementById("annTarget").value });
        showToast("Announcement posted! 📢", "success"); document.getElementById("addAnnouncementForm").reset(); loadAnnouncementsList();
    } catch (e) { showToast(e.message || "Failed", "error"); }
});

async function loadAnnouncementsList() {
    const el = document.getElementById("announcementsList"); el.innerHTML = '<div class="loading-state">Loading...</div>';
    try {
        const notifs = await getNotifications();
        if (!notifs.length) { el.innerHTML = '<div class="empty-state">No announcements</div>'; return; }
        el.innerHTML = '<div class="admin-list">' + notifs.map(n => {
            const icon = n.priority === "high" ? "🔴" : n.priority === "medium" ? "🟡" : "🟢";
            return `<div class="admin-list-item"><div class="ali-left">${icon} <strong>${n.title}</strong>
                <span class="ali-meta">${n.message.substring(0,100)} | ${new Date(n.createdAt).toLocaleDateString("en-IN")}</span></div>
                <button class="btn-danger btn-xs" onclick="removeAnnouncement('${n._id}')">🗑️</button></div>`;
        }).join('') + '</div>';
    } catch (e) { el.innerHTML = '<div class="empty-state">Failed to load</div>'; }
}
async function removeAnnouncement(id) { if (!confirm("Delete?")) return; try { await deleteNotification(id); showToast("Deleted", "success"); loadAnnouncementsList(); } catch (e) { showToast("Failed", "error"); } }
