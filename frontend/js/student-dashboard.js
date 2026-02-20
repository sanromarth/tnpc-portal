const token = localStorage.getItem("token");
const userName = localStorage.getItem("userName");
if (!token) window.location.href = "login.html";

const welcomeEl = document.getElementById("welcomeName");
if (welcomeEl && userName) welcomeEl.textContent = userName;
const topbarNameEl = document.getElementById("topbarName");
if (topbarNameEl && userName) topbarNameEl.textContent = "👤 " + userName;

let allJobs = [];
let savedJobs = JSON.parse(localStorage.getItem("savedJobs") || "[]");

const SPECIALIZATIONS = {
    "B.Sc": [
        "Computer Science (Old)", "Chemistry (Old)", "Physics (Old)", "Mathematics (Old)",
        "Computer Science & Statistics", "Computer Science & Data Science",
        "Computer Science & Electronics", "Chemistry & Computer Science",
        "Mathematics & Computer Science", "Physics & Computer Science",
        "Zoology & Chemistry", "Mathematics & Physics"
    ],
    "BCA": ["BCA (General)"],
    "B.Com": ["B.Com (General)"],
    "BBA": ["BBA (General)"],
    "MBA": ["MBA (General)"]
};

function updateSpecializations(courseId, specId) {
    const course = document.getElementById(courseId).value;
    const specSelect = document.getElementById(specId);
    specSelect.innerHTML = '<option value="">Select Specialization</option>';
    if (course && SPECIALIZATIONS[course]) {
        SPECIALIZATIONS[course].forEach(s => {
            const opt = document.createElement("option");
            opt.value = s; opt.textContent = s;
            specSelect.appendChild(opt);
        });
    }
}

const PLACEMENT_TIPS = [
    "💡 Tip: Companies like IBM, TCS, Infosys prioritize CGPA ≥ 6.0 and zero backlogs.",
    "🎯 Focus on building at least 2 real-world projects to showcase in interviews.",
    "📄 Keep your resume to 1 page — Recruiters spend only 7 seconds on average reviewing it.",
    "🤝 Networking on LinkedIn can help you discover hidden job opportunities.",
    "📚 Practice aptitude questions daily — 30 minutes is enough to improve significantly.",
    "🎓 IBM SkillsBuild certifications add weight to your profile — complete them before placement season.",
    "💻 Learn at least one programming language deeply — Python, Java, or JavaScript are great choices.",
    "🗣️ Improve communication skills — Mock interviews with friends help a lot.",
    "📊 A strong GitHub profile with clean code and good READMEs can set you apart.",
    "⏰ Apply to jobs early — Many companies shortlist on a first-come, first-served basis.",
    "🔍 Research company culture before interviews — It shows genuine interest.",
    "🏆 Participating in hackathons and coding competitions demonstrates problem-solving skills."
];
let currentTipIndex = Math.floor(Math.random() * PLACEMENT_TIPS.length);

function showNextTip() {
    currentTipIndex = (currentTipIndex + 1) % PLACEMENT_TIPS.length;
    const tipEl = document.getElementById("tipText");
    if (tipEl) { tipEl.style.opacity = 0; setTimeout(() => { tipEl.textContent = PLACEMENT_TIPS[currentTipIndex]; tipEl.style.opacity = 1; }, 300); }
}

function initTip() { const tipEl = document.getElementById("tipText"); if (tipEl) tipEl.textContent = PLACEMENT_TIPS[currentTipIndex]; }

function animateCounters() {
    document.querySelectorAll(".counter").forEach(el => {
        const target = parseInt(el.getAttribute("data-target")) || 0;
        if (target === 0) return;
        let current = 0;
        const step = Math.max(1, Math.floor(target / 30));
        const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            el.textContent = el.id === "ovProfileCompletion" ? current + "%" : current;
        }, 40);
    });
}

function showSection(section, navEl) {
    document.querySelectorAll(".dash-section").forEach(s => s.classList.remove("active"));
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    const target = document.getElementById("sec-" + section);
    if (target) target.classList.add("active");
    if (navEl) navEl.classList.add("active");
    document.getElementById("studentSidebar").classList.remove("open");

    if (section === "jobs") fetchAllJobs();
    if (section === "saved") renderSavedJobs();
    if (section === "applications") fetchApplications();
    if (section === "certifications") fetchCertifications();
    if (section === "skillgap") runSkillGapAnalysis();
    if (section === "trainings") fetchTrainings();
    if (section === "notifications") fetchNotifications();
    if (section === "profile") loadProfileForEdit();
}

async function loadDashboard() {
    initTip();
    try {
        const stats = await getStudentStats();
        const pc = stats.profileCompletion || 0;
        document.getElementById("ovProfileCompletion").setAttribute("data-target", pc);
        document.getElementById("ovProfileBar").style.width = pc + "%";
        document.getElementById("ovCGPA").textContent = stats.profile.cgpa > 0 ? stats.profile.cgpa.toFixed(2) : "Not Set";
        document.getElementById("ovResume").textContent = stats.hasResume ? "✅ Uploaded" : "❌ Missing";
        document.getElementById("ovEligibility").textContent = stats.isEligible ? "✅ Eligible" : "❌ " + stats.eligibilityReason;
        document.getElementById("ovEligibility").closest(".stat-card").className =
            "stat-card " + (stats.isEligible ? "gradient-green" : "gradient-red");
        document.getElementById("ovPending").setAttribute("data-target", stats.statusCounts.pending || 0);
        document.getElementById("ovShortlisted").setAttribute("data-target", stats.statusCounts.shortlisted || 0);
        document.getElementById("ovAccepted").setAttribute("data-target", stats.statusCounts.accepted || 0);
        document.getElementById("ovActiveJobs").setAttribute("data-target", stats.activeJobs || 0);
        document.getElementById("ovTotalApps").setAttribute("data-target", stats.totalApplications || 0);
        animateCounters();
    } catch (e) { console.warn("Stats unavailable:", e.message); }
    fetchRecentJobs();
    updateNotificationBadge();
    updateSavedBadge();
    loadCollegeSnapshot();
    loadUpcomingDeadlines();
}

async function loadCollegeSnapshot() {
    try {
        const placements = await getPlacements();
        const latest = placements.filter(p => p.yearOrder >= 2017).sort((a, b) => b.yearOrder - a.yearOrder)[0];
        if (latest) {
            document.getElementById("collegePlacementRate").textContent = latest.percentage + "%";
            document.getElementById("collegeHighCTC").textContent = latest.highestCTC ? latest.highestCTC + " LPA" : "—";
            document.getElementById("collegeAvgCTC").textContent = latest.avgCTC ? latest.avgCTC + " LPA" : "—";
            document.getElementById("collegeCompanies").textContent = latest.companiesVisited || "—";
        }
    } catch (e) { /* silent */ }
}

async function loadUpcomingDeadlines() {
    const el = document.getElementById("upcomingDeadlines");
    try {
        const jobs = await getJobs();
        const now = new Date();
        const upcoming = jobs.filter(j => j.deadline && new Date(j.deadline) > now && j.status === "active")
            .sort((a, b) => new Date(a.deadline) - new Date(b.deadline)).slice(0, 5);
        if (!upcoming.length) { el.innerHTML = '<div class="empty-state">No upcoming deadlines</div>'; return; }
        el.innerHTML = '<div class="deadline-list">' + upcoming.map(j => {
            const dl = new Date(j.deadline);
            const diff = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
            const urgency = diff <= 2 ? "urgent" : diff <= 5 ? "soon" : "normal";
            return `<div class="deadline-item ${urgency}">
                <div class="dl-left">
                    <strong>${j.company}</strong> — ${j.role}
                    <span class="dl-date">📅 ${dl.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                </div>
                <div class="dl-countdown">
                    <span class="dl-days">${diff}</span>
                    <span class="dl-label">${diff === 1 ? 'day left' : 'days left'}</span>
                </div>
            </div>`;
        }).join('') + '</div>';
    } catch (e) { el.innerHTML = '<div class="empty-state">Could not load deadlines</div>'; }
}

function renderJobCard(job, showApply = true) {
    const deadline = job.deadline ? new Date(job.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "No deadline";
    const isExpired = job.deadline && new Date(job.deadline) < new Date();
    const isSaved = savedJobs.includes(job._id);
    const now = new Date();
    let countdownHTML = "";
    if (job.deadline && !isExpired) {
        const diff = Math.ceil((new Date(job.deadline) - now) / (1000 * 60 * 60 * 24));
        const cls = diff <= 2 ? "countdown-urgent" : diff <= 5 ? "countdown-soon" : "countdown-normal";
        countdownHTML = `<span class="job-countdown ${cls}">⏰ ${diff} day${diff !== 1 ? 's' : ''} left</span>`;
    }
    return `
    <div class="job-card ${isExpired ? 'expired' : ''}">
        <div class="job-header">
            <span class="job-company">${job.company}</span>
            <div class="job-actions-top">
                <button class="bookmark-btn ${isSaved ? 'bookmarked' : ''}" onclick="toggleSaveJob('${job._id}')" title="${isSaved ? 'Remove bookmark' : 'Bookmark this job'}">
                    ${isSaved ? '★' : '☆'}
                </button>
                <span class="job-type-badge ${job.type === 'Internship' ? 'internship' : ''}">${job.type || 'Full-time'}</span>
            </div>
        </div>
        <h4 class="job-role">${job.role}</h4>
        <div class="job-meta">
            <span>💰 ${job.salary || 'Not Disclosed'}</span>
            <span>📍 ${job.location || 'On-site'}</span>
            <span>📅 ${deadline}</span>
        </div>
        ${countdownHTML}
        ${job.eligibility > 0 ? `<div class="job-eligibility">Min CGPA: ${job.eligibility}</div>` : ''}
        ${job.skills && job.skills.length ? `<div class="job-skills">${job.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}</div>` : ''}
        <div class="job-card-footer">
            ${showApply && !isExpired ? `<button class="btn-primary btn-sm" onclick="applyJob('${job._id}')">Apply Now</button>` : ''}
            ${isExpired ? '<span class="expired-label">Expired</span>' : ''}
        </div>
    </div>`;
}

function toggleSaveJob(jobId) {
    const idx = savedJobs.indexOf(jobId);
    if (idx > -1) { savedJobs.splice(idx, 1); showToast("Job removed from bookmarks", "info"); }
    else { savedJobs.push(jobId); showToast("Job bookmarked! 🔖", "success"); }
    localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
    updateSavedBadge();
    if (document.getElementById("sec-jobs").classList.contains("active")) renderFilteredJobs();
    if (document.getElementById("sec-saved").classList.contains("active")) renderSavedJobs();
}

function updateSavedBadge() {
    const badge = document.getElementById("savedBadge");
    if (badge) {
        if (savedJobs.length > 0) { badge.textContent = savedJobs.length; badge.style.display = "flex"; }
        else badge.style.display = "none";
    }
}

function renderSavedJobs() {
    const grid = document.getElementById("savedJobsGrid");
    const saved = allJobs.filter(j => savedJobs.includes(j._id));
    if (!saved.length) { grid.innerHTML = '<div class="empty-state">No saved jobs yet. Browse jobs and tap ☆ to bookmark!</div>'; return; }
    grid.innerHTML = saved.map(j => renderJobCard(j)).join('');
}

async function fetchRecentJobs() {
    const grid = document.getElementById("ovRecentJobs");
    try {
        const jobs = await getJobs();
        allJobs = jobs;
        const active = jobs.filter(j => j.status === "active").slice(0, 4);
        grid.innerHTML = active.length ? active.map(j => renderJobCard(j)).join('') : '<div class="empty-state">No active jobs at the moment</div>';
    } catch (e) { grid.innerHTML = '<div class="empty-state">Failed to load jobs</div>'; }
}

async function fetchAllJobs() {
    const grid = document.getElementById("allJobsGrid");
    grid.innerHTML = '<div class="loading-state">Loading jobs...</div>';
    try {
        const jobs = await getJobs();
        allJobs = jobs;
        renderFilteredJobs();
    } catch (e) { grid.innerHTML = '<div class="empty-state">Failed to load jobs</div>'; }
}

function filterJobs() { renderFilteredJobs(); }

function renderFilteredJobs() {
    const grid = document.getElementById("allJobsGrid");
    const search = (document.getElementById("jobSearch").value || "").toLowerCase();
    const typeFilter = document.getElementById("jobTypeFilter").value;
    let filtered = allJobs.filter(j => j.status === "active");
    if (search) filtered = filtered.filter(j => (j.company + " " + j.role).toLowerCase().includes(search));
    if (typeFilter !== "all") filtered = filtered.filter(j => j.type === typeFilter);
    grid.innerHTML = filtered.length ? filtered.map(j => renderJobCard(j)).join('') : '<div class="empty-state">No matching jobs found</div>';
}

async function applyJob(jobId) {
    try {
        await applyToJob(jobId);
        showToast("Applied successfully! 🎉", "success");
        fetchRecentJobs();
    } catch (e) { showToast(e.message || "Failed to apply", "error"); }
}

async function fetchApplications() {
    const tracker = document.getElementById("appTracker");
    tracker.innerHTML = '<div class="loading-state">Loading applications...</div>';
    try {
        const apps = await getMyApplications();
        if (!apps.length) {
            tracker.innerHTML = '<div class="empty-state">You haven\'t applied to any jobs yet. <a href="#" onclick="showSection(\'jobs\', document.querySelector(\'[onclick*=jobs]\'))">Browse Jobs →</a></div>';
            return;
        }
        tracker.innerHTML = apps.map(app => {
            const job = app.jobId || {};
            const statusClass = app.status === "accepted" ? "status-accepted" : app.status === "rejected" ? "status-rejected" : app.status === "shortlisted" ? "status-shortlisted" : "status-pending";
            const statusIcon = app.status === "accepted" ? "✅" : app.status === "rejected" ? "❌" : app.status === "shortlisted" ? "⭐" : "⏳";
            return `
            <div class="app-card ${statusClass}">
                <div class="app-left">
                    <h4>${job.company || 'Unknown'} — ${job.role || ''}</h4>
                    <span class="app-meta">Applied: ${new Date(app.appliedAt).toLocaleDateString("en-IN")}</span>
                    ${app.remarks ? `<span class="app-remarks">📝 ${app.remarks}</span>` : ''}
                </div>
                <div class="app-status">
                    <span class="status-pill ${statusClass}">${statusIcon} ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span>
                </div>
            </div>`;
        }).join('');
    } catch (e) { tracker.innerHTML = '<div class="empty-state">Failed to load applications</div>'; }
}

async function fetchCertifications() {
    const tbody = document.getElementById("certBody");
    tbody.innerHTML = '<tr><td colspan="4" class="loading-state">Loading...</td></tr>';
    try {
        const certs = await getIBMCertifications();
        const studentName = (userName || "").trim().toLowerCase();
        if (!studentName) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Please update your profile name to view your certifications</td></tr>'; return; }
        const myCerts = certs.filter(c => {
            if (!c.studentName) return false;
            const certName = c.studentName.trim().toLowerCase();
            return certName === studentName || certName.includes(studentName) || studentName.includes(certName);
        });
        if (!myCerts.length) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state">No certifications found for your profile</td></tr>'; return; }
        tbody.innerHTML = myCerts.map((c, i) => `
            <tr><td>${i + 1}</td><td>${c.course || '—'}</td>
            <td>${c.completionDate ? new Date(c.completionDate).toLocaleDateString("en-IN") : '—'}</td>
            <td><span class="status-pill ${c.status === 'Completed' ? 'status-accepted' : 'status-pending'}">${c.status || '—'}</span></td></tr>`).join('');
    } catch (e) { tbody.innerHTML = '<tr><td colspan="4" class="empty-state">Failed to load certifications</td></tr>'; }
}

async function runSkillGapAnalysis() {
    try {
        const user = await getProfile();
        const mySkills = (user.skills || []).map(s => s.trim().toLowerCase());
        const yourSkillsEl = document.getElementById("yourSkills");
        if (mySkills.length) {
            yourSkillsEl.innerHTML = mySkills.map(s => `<span class="skill-chip your-skill">${s}</span>`).join('');
        } else {
            yourSkillsEl.innerHTML = '<span class="empty-state">No skills added yet. <a href="#" onclick="showSection(\'profile\', document.querySelector(\'[onclick*=profile]\'))">Update Profile →</a></span>';
        }

        const jobs = allJobs.length ? allJobs : await getJobs();
        allJobs = jobs;
        const activeJobs = jobs.filter(j => j.status === "active");
        const skillCount = {};
        activeJobs.forEach(j => {
            (j.skills || []).forEach(s => {
                const sk = s.trim().toLowerCase();
                if (sk) skillCount[sk] = (skillCount[sk] || 0) + 1;
            });
        });
        const sorted = Object.entries(skillCount).sort((a, b) => b[1] - a[1]);
        const demandEl = document.getElementById("demandedSkills");
        if (!sorted.length) { demandEl.innerHTML = '<div class="empty-state">No job skill data available</div>'; }
        else {
            const maxCount = sorted[0][1];
            demandEl.innerHTML = '<div class="skill-demand-grid">' + sorted.slice(0, 12).map(([skill, count]) => {
                const pct = Math.round((count / maxCount) * 100);
                const hasIt = mySkills.includes(skill);
                return `<div class="demand-bar-item ${hasIt ? 'has-skill' : 'missing-skill'}">
                    <div class="demand-label"><span>${skill}</span><span>${count} job${count > 1 ? 's' : ''}</span></div>
                    <div class="demand-bar"><div class="demand-fill ${hasIt ? 'fill-green' : 'fill-red'}" style="width:${pct}%"></div></div>
                    <span class="demand-status">${hasIt ? '✅ You have this' : '❌ Missing'}</span>
                </div>`;
            }).join('') + '</div>';
        }

        const demandedSkills = sorted.map(([s]) => s);
        const missing = demandedSkills.filter(s => !mySkills.includes(s));
        const matching = demandedSkills.filter(s => mySkills.includes(s));

        document.getElementById("missingSkills").innerHTML = missing.length
            ? missing.slice(0, 10).map(s => `<span class="skill-chip missing-chip">❌ ${s}</span>`).join('')
            : '<div class="empty-state">🎉 Great! You have all the demanded skills!</div>';

        document.getElementById("matchingSkills").innerHTML = matching.length
            ? matching.map(s => `<span class="skill-chip match-chip">✅ ${s}</span>`).join('')
            : '<div class="empty-state">No matching skills yet. Start learning!</div>';

        const total = demandedSkills.length || 1;
        const matchPct = Math.round((matching.length / total) * 100);
        const fillEl = document.getElementById("skillScoreFill");
        const textEl = document.getElementById("skillScoreText");
        const hintEl = document.getElementById("skillScoreHint");
        fillEl.style.width = matchPct + "%";
        fillEl.className = "skill-score-fill " + (matchPct >= 70 ? "fill-green" : matchPct >= 40 ? "fill-yellow" : "fill-red");
        textEl.textContent = matchPct + "%";
        if (matchPct >= 80) hintEl.textContent = "🌟 Excellent! Your skills align perfectly with market demand!";
        else if (matchPct >= 50) hintEl.textContent = "👍 Good match! Learn a few more trending skills to stand out.";
        else if (matchPct >= 25) hintEl.textContent = "⚡ Decent start. Focus on the missing skills shown above.";
        else hintEl.textContent = "🚀 Start learning the demanded skills above to improve your employability!";
    } catch (e) { console.warn("Skill analysis error:", e); }
}

async function fetchTrainings() {
    const grid = document.getElementById("trainingsGrid");
    grid.innerHTML = '<div class="loading-state">Loading trainings...</div>';
    try {
        let trainings;
        try { trainings = await getTrainings(); } catch { trainings = await getUpcomingTrainings(); }
        if (!trainings.length) { grid.innerHTML = '<div class="empty-state">No upcoming trainings or events scheduled</div>'; return; }
        grid.innerHTML = trainings.map(t => {
            const typeIcon = { workshop: '🔧', seminar: '🎤', 'placement-drive': '🏢', training: '📚', webinar: '💻', hackathon: '🚀' };
            const statusColor = t.status === 'upcoming' ? 'gradient-blue' : t.status === 'ongoing' ? 'gradient-green' : 'gradient-gold';
            return `
            <div class="training-card ${statusColor}">
                <div class="training-icon">${typeIcon[t.type] || '📅'}</div>
                <h4>${t.title}</h4>
                <div class="training-meta">
                    <span>📅 ${new Date(t.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    ${t.venue ? `<span>📍 ${t.venue}</span>` : ''}
                    ${t.company ? `<span>🏢 ${t.company}</span>` : ''}
                </div>
                <span class="training-status">${t.status}</span>
                ${t.description ? `<p class="training-desc">${t.description}</p>` : ''}
            </div>`;
        }).join('');
    } catch (e) { grid.innerHTML = '<div class="empty-state">Failed to load trainings</div>'; }
}

async function fetchNotifications() {
    const list = document.getElementById("notifList");
    list.innerHTML = '<div class="loading-state">Loading notifications...</div>';
    try {
        const notifs = await getNotifications();
        if (!notifs.length) { list.innerHTML = '<div class="empty-state">No notifications yet</div>'; return; }
        list.innerHTML = notifs.map(n => {
            const icon = n.priority === "high" ? "🔴" : n.priority === "medium" ? "🟡" : "🟢";
            const isRead = n.isRead;
            return `<div class="notif-item ${isRead ? 'read' : 'unread'}" onclick="markOneRead('${n._id}', this)">
                <span class="notif-icon">${icon}</span>
                <div class="notif-body">
                    <strong>${n.title}</strong>
                    <p>${n.message}</p>
                    <span class="notif-time">${new Date(n.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>`;
        }).join('');
    } catch (e) { list.innerHTML = '<div class="empty-state">Failed to load notifications</div>'; }
}

async function markOneRead(id, el) { try { await markNotificationRead(id); if (el) el.classList.add("read"); updateNotificationBadge(); } catch (e) { console.warn(e); } }
async function markAllRead() { try { await markAllNotificationsRead(); showToast("All notifications marked as read", "success"); fetchNotifications(); updateNotificationBadge(); } catch (e) { showToast("Failed", "error"); } }

async function updateNotificationBadge() {
    try {
        const data = await getUnreadNotificationCount();
        const count = data.count || 0;
        const badge = document.getElementById("bellBadge");
        const sidebarBadge = document.getElementById("sidebarNotifBadge");
        if (count > 0) {
            if (badge) { badge.textContent = count; badge.style.display = "flex"; }
            if (sidebarBadge) { sidebarBadge.textContent = count; sidebarBadge.style.display = "flex"; }
        } else {
            if (badge) badge.style.display = "none";
            if (sidebarBadge) sidebarBadge.style.display = "none";
        }
    } catch (e) { /* silent */ }
}

async function loadProfileForEdit() {
    try {
        const user = await getProfile();
        document.getElementById("profName").value = user.name || "";
        document.getElementById("profEmail").value = user.email || "";
        document.getElementById("profPhone").value = user.phone || "";
        document.getElementById("profRegNo").value = user.registerNumber || "";
        document.getElementById("profCourse").value = user.course || "";
        updateSpecializations('profCourse','profSpecialization');
        setTimeout(() => { document.getElementById("profSpecialization").value = user.specialization || ""; }, 50);
        document.getElementById("profBatch").value = user.batch || "";
        document.getElementById("profCGPA").value = user.cgpa || "";
        document.getElementById("profTenth").value = user.tenthPercentage || "";
        document.getElementById("profTwelfth").value = user.twelfthPercentage || "";
        document.getElementById("profBacklogs").value = user.backlogs || "";
        document.getElementById("profSkills").value = (user.skills || []).join(", ");
        document.getElementById("profResume").value = user.resumeUrl || "";
        updateProfileStrength(user);
    } catch (e) { console.warn("Profile load failed:", e.message); }
}

function updateProfileStrength(user) {
    const checks = [
        { label: "Full Name", filled: !!(user.name && user.name.trim()) },
        { label: "Phone Number", filled: !!(user.phone && user.phone.trim()) },
        { label: "Course", filled: !!(user.course && user.course.trim()) },
        { label: "Specialization", filled: !!(user.specialization && user.specialization.trim()) },
        { label: "Register Number", filled: !!(user.registerNumber && user.registerNumber.trim()) },
        { label: "Batch", filled: !!(user.batch && user.batch.trim()) },
        { label: "CGPA", filled: user.cgpa > 0 },
        { label: "10th Percentage", filled: user.tenthPercentage > 0 },
        { label: "12th Percentage", filled: user.twelfthPercentage > 0 },
        { label: "Skills (3+)", filled: (user.skills || []).length >= 3 },
        { label: "Resume URL", filled: !!(user.resumeUrl && user.resumeUrl.trim()) },
    ];
    const filled = checks.filter(c => c.filled).length;
    const pct = Math.round((filled / checks.length) * 100);

    const arc = document.getElementById("strengthArc");
    if (arc) {
        const maxDash = 251.3;
        const offset = maxDash - (pct / 100) * maxDash;
        arc.style.transition = "stroke-dashoffset 1.5s ease-out";
        arc.setAttribute("stroke-dashoffset", offset);
    }
    const valEl = document.getElementById("strengthValue");
    if (valEl) valEl.textContent = pct + "%";

    const tipsEl = document.getElementById("strengthTips");
    if (tipsEl) {
        const missing = checks.filter(c => !c.filled).map(c => `<span class="strength-missing">❌ ${c.label}</span>`);
        const filled_items = checks.filter(c => c.filled).map(c => `<span class="strength-done">✅ ${c.label}</span>`);
        tipsEl.innerHTML = `<div class="strength-checklist">${filled_items.join('')}${missing.join('')}</div>`;
    }
}

const profileForm = document.getElementById("profileEditForm");
if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const statusEl = document.getElementById("profileSaveStatus");
        statusEl.innerHTML = '<span style="color:#FBC02D;">Saving...</span>';
        try {
            const skills = document.getElementById("profSkills").value.split(",").map(s => s.trim()).filter(Boolean);
            await updateProfile({
                name: document.getElementById("profName").value,
                phone: document.getElementById("profPhone").value,
                registerNumber: document.getElementById("profRegNo").value,
                course: document.getElementById("profCourse").value,
                specialization: document.getElementById("profSpecialization").value,
                batch: document.getElementById("profBatch").value,
                cgpa: parseFloat(document.getElementById("profCGPA").value) || 0,
                tenthPercentage: parseFloat(document.getElementById("profTenth").value) || 0,
                twelfthPercentage: parseFloat(document.getElementById("profTwelfth").value) || 0,
                backlogs: parseInt(document.getElementById("profBacklogs").value) || 0,
                skills,
                resumeUrl: document.getElementById("profResume").value
            });
            statusEl.innerHTML = '<span style="color:#2e7d32;">✅ Saved!</span>';
            showToast("Profile updated!", "success");
            loadDashboard();
        } catch (err) { statusEl.innerHTML = '<span style="color:#c62828;">❌ ' + (err.message || "Failed") + '</span>'; }
    });
}

function calculatePrediction() {
    const cgpa = parseFloat(document.getElementById("predCGPA").value) || 0;
    const skills = parseInt(document.getElementById("predSkills").value) || 0;
    const certs = parseInt(document.getElementById("predCerts").value) || 0;
    const backlogs = parseInt(document.getElementById("predBacklogs").value) || 0;
    const internships = parseInt(document.getElementById("predInternships").value) || 0;
    const projects = parseInt(document.getElementById("predProjects").value) || 0;

    let score = 0;
    if (cgpa >= 9) score += 35; else if (cgpa >= 8) score += 30; else if (cgpa >= 7) score += 22;
    else if (cgpa >= 6) score += 15; else score += 5;
    score += Math.min(skills * 3, 15);
    score += Math.min(certs * 5, 15);
    score -= backlogs * 10;
    score += Math.min(internships * 8, 16);
    score += Math.min(projects * 4, 12);
    if (cgpa >= 7 && skills >= 3 && certs >= 1) score += 7;
    score = Math.max(0, Math.min(100, score));

    const resultEl = document.getElementById("predictorResult");
    resultEl.style.display = "block";
    const circle = document.getElementById("predCircle");
    const circumference = 339.3;
    const offset = circumference - (score / 100) * circumference;
    circle.style.transition = "stroke-dashoffset 1.5s ease-out";
    circle.setAttribute("stroke-dashoffset", offset);
    circle.setAttribute("stroke", score >= 70 ? "#4caf50" : score >= 40 ? "#FBC02D" : "#C62828");
    document.getElementById("predPercent").textContent = score + "%";

    let label, tips;
    if (score >= 80) { label = "🌟 Excellent! High placement probability"; tips = "Keep applying to dream companies. Your profile is very competitive!"; }
    else if (score >= 60) { label = "👍 Good chances! Keep improving"; tips = "Consider adding more certifications and internship experience."; }
    else if (score >= 40) { label = "⚡ Moderate — Focus on skill-building"; tips = "Work on improving CGPA, get IBM certifications, and build projects."; }
    else { label = "⚠️ Needs significant improvement"; tips = "Clear backlogs, improve CGPA above 6.0, and gain certifications."; }
    document.getElementById("predLabel").textContent = label;
    document.getElementById("predTips").textContent = tips;
}

loadDashboard();
setInterval(updateNotificationBadge, 60000);
setInterval(showNextTip, 30000);
