
async function loadDeepInsights() {
    try {
        const [stats, analytics, apps, placements] = await Promise.all([
            getDashboardStats(), getAdminAnalytics(), getApplications().catch(() => []), getPlacements().catch(() => [])
        ]);
        const totalApps = stats.totalApplications || 1;
        const shortlisted = stats.shortlistedApplications || 0;
        const accepted = stats.acceptedApplications || 0;
        const rejected = stats.rejectedApplications || 0;
        const placementRate = stats.placementRate || 0;
        let healthScore = 0;
        healthScore += Math.min(placementRate * 0.4, 40);
        healthScore += Math.min((accepted / totalApps) * 100 * 0.3, 30);
        healthScore += Math.min((shortlisted / totalApps) * 100 * 0.2, 20);
        healthScore += stats.activeJobs > 0 ? 10 : 0;
        healthScore = Math.round(Math.min(100, healthScore));
        document.getElementById("healthScoreValue").textContent = healthScore + "/100";
        const circle = document.getElementById("healthScoreCircle");
        circle.style.borderColor = healthScore >= 70 ? "#4caf50" : healthScore >= 40 ? "#FBC02D" : "#ef5350";
        document.getElementById("healthBreakdown").innerHTML = `
            <div class="peer-details">
                <div class="peer-metric"><span class="peer-metric-label">Placement Rate</span><span class="peer-metric-value">${placementRate}%</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Accept Rate</span><span class="peer-metric-value">${totalApps > 0 ? Math.round((accepted/totalApps)*100) : 0}%</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Shortlist Rate</span><span class="peer-metric-value">${totalApps > 0 ? Math.round((shortlisted/totalApps)*100) : 0}%</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Active Jobs</span><span class="peer-metric-value">${stats.activeJobs}</span></div>
            </div>`;
        const funnelEl = document.getElementById("funnelConversion");
        const applyToShort = totalApps > 0 ? Math.round((shortlisted / totalApps) * 100) : 0;
        const shortToAccept = shortlisted > 0 ? Math.round((accepted / shortlisted) * 100) : 0;
        funnelEl.innerHTML = `<div class="salary-bars">
            <div class="salary-bar-item"><span class="salary-company">Applied → Shortlisted</span>
                <div class="demand-bar"><div class="demand-fill fill-green" style="width:${applyToShort}%"></div></div>
                <span class="salary-amount">${applyToShort}%</span></div>
            <div class="salary-bar-item"><span class="salary-company">Shortlisted → Selected</span>
                <div class="demand-bar"><div class="demand-fill fill-green" style="width:${shortToAccept}%"></div></div>
                <span class="salary-amount">${shortToAccept}%</span></div>
            <div class="salary-bar-item"><span class="salary-company">Overall Rejection</span>
                <div class="demand-bar"><div class="demand-fill fill-red" style="width:${totalApps > 0 ? Math.round((rejected/totalApps)*100) : 0}%"></div></div>
                <span class="salary-amount">${totalApps > 0 ? Math.round((rejected/totalApps)*100) : 0}%</span></div>
        </div>`;
        try {
            const students = await getStudents();
            const skillCount = {};
            students.forEach(s => (s.skills || []).forEach(sk => { const k = sk.trim().toLowerCase(); if (k) skillCount[k] = (skillCount[k] || 0) + 1; }));
            const sorted = Object.entries(skillCount).sort((a,b) => b[1] - a[1]).slice(0, 12);
            const maxCount = sorted.length ? sorted[0][1] : 1;
            document.getElementById("topSkillsChart").innerHTML = sorted.length ?
                '<div class="salary-bars">' + sorted.map(([skill, count]) =>
                    `<div class="salary-bar-item"><span class="salary-company">${skill}</span>
                    <div class="demand-bar"><div class="demand-fill fill-green" style="width:${(count/maxCount*100)}%"></div></div>
                    <span class="salary-amount">${count} students</span></div>`
                ).join('') + '</div>' : '<div class="empty-state">No skill data</div>';
        } catch(e) { document.getElementById("topSkillsChart").innerHTML = '<div class="empty-state">Could not load skills</div>'; }
        const body = document.getElementById("batchCompareBody");
        if (placements.length) {
            body.innerHTML = placements.sort((a,b) => b.yearOrder - a.yearOrder).map(p => `<tr>
                <td>${p.batch}</td><td>${p.totalStudents || 0}</td><td>${p.placementsOffered || 0}</td>
                <td><span class="status-pill ${p.percentage >= 60 ? 'status-accepted' : p.percentage >= 30 ? 'status-shortlisted' : 'status-rejected'}">${p.percentage || 0}%</span></td>
                <td>${p.highestCTC ? p.highestCTC + ' LPA' : '—'}</td><td>${p.avgCTC ? p.avgCTC + ' LPA' : '—'}</td>
            </tr>`).join('');
        } else body.innerHTML = '<tr><td colspan="6" class="empty-state">No data</td></tr>';
    } catch(e) { console.warn("Insights error:", e); }
}

async function loadCompanyTracker() {
    try {
        const [jobs, apps] = await Promise.all([getJobs(), getApplications()]);
        const body = document.getElementById("companyTrackerBody");
        if (!jobs.length) { body.innerHTML = '<tr><td colspan="7" class="empty-state">No jobs posted yet</td></tr>'; return; }
        const jobMap = {};
        jobs.forEach(j => { jobMap[j._id] = { company: j.company, role: j.role, total: 0, shortlisted: 0, accepted: 0, rejected: 0 }; });
        apps.forEach(a => {
            const jid = a.jobId?._id || a.jobId;
            if (jobMap[jid]) {
                jobMap[jid].total++;
                if (a.status === "shortlisted") jobMap[jid].shortlisted++;
                if (a.status === "accepted") jobMap[jid].accepted++;
                if (a.status === "rejected") jobMap[jid].rejected++;
            }
        });
        const rows = Object.values(jobMap).sort((a,b) => b.total - a.total);
        body.innerHTML = rows.map(r => {
            const rate = r.total > 0 ? Math.round((r.accepted / r.total) * 100) : 0;
            return `<tr>
                <td><strong>${r.company}</strong></td><td>${r.role}</td><td>${r.total}</td>
                <td>${r.shortlisted}</td><td>${r.accepted}</td><td>${r.rejected}</td>
                <td><span class="status-pill ${rate >= 30 ? 'status-accepted' : rate > 0 ? 'status-shortlisted' : 'status-pending'}">${rate}%</span></td>
            </tr>`;
        }).join('');
    } catch(e) { document.getElementById("companyTrackerBody").innerHTML = '<tr><td colspan="7" class="empty-state">Failed to load</td></tr>'; }
}

async function loadActivityLog() {
    const feed = document.getElementById("activityFeed");
    feed.innerHTML = '<div class="loading-state">Loading activity...</div>';
    try {
        const [students, apps, jobs, notifications] = await Promise.all([
            getStudents().catch(() => []), getApplications().catch(() => []),
            getJobs().catch(() => []), getNotifications().catch(() => [])
        ]);
        const activities = [];
        students.slice(0, 10).forEach(s => {
            activities.push({ icon: "👤", text: `${s.name} registered`, time: s.createdAt, type: "registration" });
        });
        apps.slice(0, 15).forEach(a => {
            const student = a.studentId?.name || "Student";
            const company = a.jobId?.company || "Company";
            const icon = a.status === "accepted" ? "✅" : a.status === "rejected" ? "❌" : a.status === "shortlisted" ? "⭐" : "📝";
            activities.push({ icon, text: `${student} — ${a.status} at ${company}`, time: a.appliedAt || a.updatedAt, type: "application" });
        });
        jobs.slice(0, 5).forEach(j => {
            activities.push({ icon: "💼", text: `Job posted: ${j.company} — ${j.role}`, time: j.createdAt, type: "job" });
        });
        activities.sort((a, b) => new Date(b.time) - new Date(a.time));
        if (!activities.length) { feed.innerHTML = '<div class="empty-state">No activity yet</div>'; return; }
        feed.innerHTML = '<div class="activity-list">' + activities.slice(0, 30).map(a =>
            `<div class="activity-item">
                <span>${a.icon}</span> ${a.text}
                <span style="float:right;font-size:11px;color:rgba(255,255,255,0.3)">${a.time ? new Date(a.time).toLocaleDateString("en-IN", {day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}) : ''}</span>
            </div>`
        ).join('') + '</div>';
    } catch(e) { feed.innerHTML = '<div class="empty-state">Failed to load activity</div>'; }
}

async function loadCourseMatrix() {
    try {
        const students = await getStudents();
        const courseMap = {};
        students.forEach(s => {
            const c = s.course || "Unknown";
            if (!courseMap[c]) courseMap[c] = { total: 0, placed: 0, cgpaSum: 0, skills: {} };
            courseMap[c].total++;
            if (s.placementStatus === "placed") courseMap[c].placed++;
            courseMap[c].cgpaSum += s.cgpa || 0;
            (s.skills || []).forEach(sk => { const k = sk.trim().toLowerCase(); if (k) courseMap[c].skills[k] = (courseMap[c].skills[k] || 0) + 1; });
        });
        const body = document.getElementById("courseMatrixBody");
        const rows = Object.entries(courseMap).sort((a,b) => b[1].total - a[1].total);
        body.innerHTML = rows.map(([course, d]) => {
            const rate = d.total > 0 ? Math.round((d.placed / d.total) * 100) : 0;
            const avgCGPA = d.total > 0 ? (d.cgpaSum / d.total).toFixed(2) : "N/A";
            const topSkills = Object.entries(d.skills).sort((a,b) => b[1] - a[1]).slice(0, 3).map(([s]) => s).join(", ") || "—";
            const grade = rate >= 70 ? "🟢 A" : rate >= 50 ? "🟡 B" : rate >= 25 ? "🟠 C" : "🔴 D";
            return `<tr>
                <td><strong>${course}</strong></td><td>${d.total}</td><td>${d.placed}</td>
                <td><span class="status-pill ${rate >= 50 ? 'status-accepted' : rate >= 25 ? 'status-shortlisted' : 'status-rejected'}">${rate}%</span></td>
                <td>${avgCGPA}</td><td style="font-size:12px">${topSkills}</td><td>${grade}</td>
            </tr>`;
        }).join('');
    } catch(e) { document.getElementById("courseMatrixBody").innerHTML = '<tr><td colspan="7" class="empty-state">Failed to load</td></tr>'; }
}

function openStudentModal(studentId) {
    document.getElementById("studentModalOverlay").style.display = "flex";
    const content = document.getElementById("studentModalContent");
    content.innerHTML = '<div class="loading-state">Loading student data...</div>';
    getStudents({ search: studentId }).then(async students => {
        const s = students[0];
        if (!s) { content.innerHTML = '<div class="empty-state">Student not found</div>'; return; }
        content.innerHTML = `
            <div class="peer-details" style="margin-top:16px">
                <div class="peer-metric"><span class="peer-metric-label">Name</span><span class="peer-metric-value">${s.name}</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Email</span><span class="peer-metric-value">${s.email}</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Phone</span><span class="peer-metric-value">${s.phone || '—'}</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Reg No</span><span class="peer-metric-value">${s.registerNumber || '—'}</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Course</span><span class="peer-metric-value">${s.course || '—'} — ${s.specialization || ''}</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Batch</span><span class="peer-metric-value">${s.batch || '—'}</span></div>
                <div class="peer-metric"><span class="peer-metric-label">CGPA</span><span class="peer-metric-value">${s.cgpa || '—'}</span></div>
                <div class="peer-metric"><span class="peer-metric-label">10th / 12th</span><span class="peer-metric-value">${s.tenthPercentage || 0}% / ${s.twelfthPercentage || 0}%</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Backlogs</span><span class="peer-metric-value">${s.backlogs || 0}</span></div>
                <div class="peer-metric"><span class="peer-metric-label">Status</span><span class="peer-metric-value"><span class="status-pill ${s.placementStatus === 'placed' ? 'status-accepted' : 'status-pending'}">${s.placementStatus}</span></span></div>
                <div class="peer-metric"><span class="peer-metric-label">Skills</span><span class="peer-metric-value" style="font-size:12px">${(s.skills || []).join(', ') || '—'}</span></div>
                ${s.resumeUrl ? `<div class="peer-metric"><span class="peer-metric-label">Resume</span><span class="peer-metric-value"><a href="${s.resumeUrl}" target="_blank" style="color:#64b5f6">View Resume</a></span></div>` : ''}
            </div>`;
    }).catch(e => { content.innerHTML = '<div class="empty-state">Failed to load</div>'; });
}

function closeStudentModal() { document.getElementById("studentModalOverlay").style.display = "none"; }

function toggleBulkPanel() {
    const panel = document.getElementById("bulkActionsPanel");
    panel.style.display = panel.style.display === "none" ? "block" : "none";
}
function closeBulkPanel() { document.getElementById("bulkActionsPanel").style.display = "none"; }

async function bulkRemindUnprofiled() {
    try {
        const students = await getStudents();
        const unprofiled = students.filter(s => !s.course || !s.phone || s.cgpa === 0);
        await postNotification({ title: "Complete Your Profile", message: `Reminder: ${unprofiled.length} students have incomplete profiles. Please update your profile for placement eligibility.`, type: "announcement", priority: "high", targetRole: "student" });
        showToast(`Reminder sent for ${unprofiled.length} unprofiled students!`, "success");
    } catch(e) { showToast("Failed: " + (e.message || "Error"), "error"); }
}

async function bulkExportReady() {
    try {
        const blob = await exportStudentsCSV();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = "placement_ready_students.csv"; a.click();
        URL.revokeObjectURL(url);
        showToast("Export downloaded!", "success");
    } catch(e) { showToast("Export failed", "error"); }
}

async function bulkDeadlineAlert() {
    try {
        const jobs = await getJobs();
        const now = new Date();
        const upcoming = jobs.filter(j => j.deadline && new Date(j.deadline) > now && j.status === "active").sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 3);
        if (!upcoming.length) { showToast("No upcoming deadlines to alert about", "info"); return; }
        const msg = upcoming.map(j => `${j.company} — ${j.role} (${new Date(j.deadline).toLocaleDateString("en-IN")})`).join("\n");
        await postNotification({ title: "⏰ Upcoming Deadlines Alert", message: msg, type: "deadline", priority: "high", targetRole: "student" });
        showToast("Deadline alert sent to all students!", "success");
    } catch(e) { showToast("Failed: " + (e.message || "Error"), "error"); }
}

if (typeof showAdminSection === 'function') {
    const origShowAdminSection = showAdminSection;
    showAdminSection = function(section, navEl) {
        origShowAdminSection(section, navEl);
        if (section === "insights") loadDeepInsights();
        if (section === "companyTracker") loadCompanyTracker();
        if (section === "activityLog") loadActivityLog();
        if (section === "courseMatrix") loadCourseMatrix();
    };
}
