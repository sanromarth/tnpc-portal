
const INTERVIEW_QUESTIONS = [
    {q:"Tell me about yourself.",a:"Focus on education, skills, projects & career goals.",cat:"hr",company:"all",diff:"easy"},
    {q:"Why should we hire you?",a:"Highlight your unique skills and how they match the role.",cat:"hr",company:"all",diff:"easy"},
    {q:"Where do you see yourself in 5 years?",a:"Show ambition aligned with the company's growth.",cat:"hr",company:"all",diff:"easy"},
    {q:"What are your strengths and weaknesses?",a:"Be honest, turn weakness into a learning opportunity.",cat:"hr",company:"all",diff:"easy"},
    {q:"Why do you want to join our company?",a:"Research the company's values, products, and culture.",cat:"hr",company:"all",diff:"easy"},
    {q:"Describe a challenging situation you overcame.",a:"Use the STAR method: Situation, Task, Action, Result.",cat:"hr",company:"all",diff:"medium"},
    {q:"What is your expected salary?",a:"Research market rates. Give a range based on the role.",cat:"hr",company:"all",diff:"medium"},
    {q:"How do you handle pressure and deadlines?",a:"Give examples of prioritizing tasks under tight schedules.",cat:"hr",company:"all",diff:"medium"},
    {q:"What is OOP? Explain its 4 pillars.",a:"Encapsulation, Abstraction, Inheritance, Polymorphism.",cat:"technical",company:"TCS",diff:"easy"},
    {q:"Difference between Stack and Queue?",a:"Stack: LIFO, Queue: FIFO.",cat:"technical",company:"Infosys",diff:"easy"},
    {q:"What is normalization in DBMS?",a:"Organizing data to reduce redundancy. 1NF, 2NF, 3NF, BCNF.",cat:"technical",company:"Wipro",diff:"medium"},
    {q:"Explain the difference between TCP and UDP.",a:"TCP: connection-oriented, reliable. UDP: connectionless, faster.",cat:"technical",company:"all",diff:"medium"},
    {q:"What is SQL injection? How to prevent it?",a:"Malicious SQL via input. Prevent with parameterized queries.",cat:"technical",company:"Cognizant",diff:"medium"},
    {q:"What is a REST API?",a:"Representational State Transfer. Uses HTTP methods for CRUD on resources.",cat:"technical",company:"all",diff:"easy"},
    {q:"Explain MVC architecture.",a:"Model-View-Controller separates data, UI, and logic.",cat:"technical",company:"Capgemini",diff:"medium"},
    {q:"What is the difference between Python list and tuple?",a:"List is mutable, tuple is immutable.",cat:"technical",company:"IBM",diff:"easy"},
    {q:"What is cloud computing? Name types.",a:"On-demand IT resources. IaaS, PaaS, SaaS.",cat:"technical",company:"IBM",diff:"easy"},
    {q:"Reverse a string without built-in functions.",a:"Use a loop iterating from end to start.",cat:"coding",company:"TCS",diff:"easy"},
    {q:"Find the second largest number in an array.",a:"Track max and secondMax in one pass.",cat:"coding",company:"Infosys",diff:"easy"},
    {q:"Check if a number is a palindrome.",a:"Reverse the number and compare with original.",cat:"coding",company:"Wipro",diff:"easy"},
    {q:"FizzBuzz: Print 1-100, multiples of 3=Fizz, 5=Buzz, both=FizzBuzz.",a:"Use modulo operator in a loop.",cat:"coding",company:"Accenture",diff:"easy"},
    {q:"Find duplicates in an array.",a:"Use a Set or hash map to track seen elements.",cat:"coding",company:"Cognizant",diff:"medium"},
    {q:"Implement binary search.",a:"Compare mid element, narrow search to left or right half.",cat:"coding",company:"TCS",diff:"medium"},
    {q:"A train 150m long passes a pole in 15s. What is its speed?",a:"Speed = Distance/Time = 150/15 = 10 m/s = 36 km/h.",cat:"aptitude",company:"all",diff:"easy"},
    {q:"If 6 workers can build a wall in 12 days, how many days for 8 workers?",a:"6×12 = 8×d → d = 9 days.",cat:"aptitude",company:"TCS",diff:"easy"},
    {q:"A bag has 4 red, 3 blue, 2 green balls. P(drawing red)?",a:"P = 4/9.",cat:"aptitude",company:"Infosys",diff:"easy"},
    {q:"Simple interest on ₹5000 at 8% for 3 years?",a:"SI = PRT/100 = 5000×8×3/100 = ₹1200.",cat:"aptitude",company:"all",diff:"easy"},
    {q:"If a:b = 3:4 and b:c = 5:6, find a:b:c.",a:"a:b:c = 15:20:24.",cat:"aptitude",company:"Wipro",diff:"medium"},
    {q:"Impact of AI on employment in India.",a:"Discuss automation, reskilling, new job creation, and policy.",cat:"gd",company:"all",diff:"medium"},
    {q:"Remote work vs. Office work: Which is better?",a:"Discuss productivity, collaboration, work-life balance.",cat:"gd",company:"all",diff:"easy"},
    {q:"Should coding be mandatory in schools?",a:"Discuss digital literacy, logical thinking, and curriculum balance.",cat:"gd",company:"all",diff:"easy"},
    {q:"Is social media a boon or bane for students?",a:"Discuss networking, learning, distraction, mental health.",cat:"gd",company:"all",diff:"easy"},
    {q:"Explain deadlock in OS. How to prevent it?",a:"Circular wait among processes. Prevent via ordering, timeout, avoidance.",cat:"technical",company:"HCL",diff:"hard"},
    {q:"What is dynamic programming? Give an example.",a:"Breaking problems into overlapping subproblems. E.g., Fibonacci.",cat:"coding",company:"all",diff:"hard"},
    {q:"Design a URL shortener system.",a:"Hash function, key-value store, redirect service, collision handling.",cat:"technical",company:"all",diff:"hard"},
];

const INTERVIEW_CHECKLIST = [
    "Research the company (products, culture, recent news)",
    "Review the job description carefully",
    "Prepare 3-4 questions to ask the interviewer",
    "Print 2 copies of your resume",
    "Dress formally (ironed clothes, polished shoes)",
    "Carry ID proof, certificates, and original marksheet",
    "Practice common HR and technical questions",
    "Test your laptop & internet for online interviews",
    "Be ready 15 minutes before the scheduled time",
    "Prepare a 2-min 'Tell me about yourself' pitch",
];

function filterInterviewQuestions() {
    const cat = document.getElementById("interviewCategory").value;
    const company = document.getElementById("interviewCompany").value;
    const diff = document.getElementById("interviewDifficulty").value;
    let filtered = INTERVIEW_QUESTIONS;
    if (cat !== "all") filtered = filtered.filter(q => q.cat === cat);
    if (company !== "all") filtered = filtered.filter(q => q.company === company || q.company === "all");
    if (diff !== "all") filtered = filtered.filter(q => q.diff === diff);
    const grid = document.getElementById("interviewQuestionsGrid");
    if (!filtered.length) { grid.innerHTML = '<div class="empty-state">No questions match your filters</div>'; return; }
    grid.innerHTML = filtered.map((q, i) => `
        <div class="interview-card glass-card" onclick="this.classList.toggle('flipped')">
            <div class="iq-front">
                <div class="iq-badges">
                    <span class="iq-cat">${{hr:"HR",technical:"Technical",aptitude:"Aptitude",coding:"Coding",gd:"GD"}[q.cat]}</span>
                    <span class="iq-diff iq-${q.diff}">${q.diff}</span>
                    ${q.company !== "all" ? `<span class="iq-company">${q.company}</span>` : ""}
                </div>
                <p class="iq-question">${q.q}</p>
                <span class="iq-hint">Tap to reveal answer</span>
            </div>
            <div class="iq-back">
                <p class="iq-answer">💡 ${q.a}</p>
            </div>
        </div>`).join('');
}

function loadInterviewChecklist() {
    const el = document.getElementById("interviewChecklist");
    const saved = JSON.parse(localStorage.getItem("interviewChecklist") || "[]");
    el.innerHTML = INTERVIEW_CHECKLIST.map((item, i) => `
        <label class="checklist-item ${saved.includes(i) ? 'checked' : ''}">
            <input type="checkbox" ${saved.includes(i) ? 'checked' : ''} onchange="toggleChecklistItem(${i}, this)">
            <span>${item}</span>
        </label>`).join('');
}

function toggleChecklistItem(idx, el) {
    let saved = JSON.parse(localStorage.getItem("interviewChecklist") || "[]");
    if (el.checked) { if (!saved.includes(idx)) saved.push(idx); }
    else { saved = saved.filter(i => i !== idx); }
    localStorage.setItem("interviewChecklist", JSON.stringify(saved));
    el.closest('.checklist-item').classList.toggle('checked', el.checked);
}

let quizCorrect = 0, quizTotal = 0, quizCurrentAnswer = '';
function startQuiz() {
    const q = INTERVIEW_QUESTIONS[Math.floor(Math.random() * INTERVIEW_QUESTIONS.length)];
    quizCurrentAnswer = q.a;
    document.getElementById("quizQuestion").innerHTML = `<span class="iq-cat">${q.cat}</span> <strong>${q.q}</strong>`;
    const optionSet = new Set([q.a]);
    const others = INTERVIEW_QUESTIONS.filter(x => x.cat === q.cat && x.q !== q.q).sort(() => Math.random() - 0.5);
    for (const x of others) { if (optionSet.size >= 4) break; optionSet.add(x.a); }
    while (optionSet.size < 4) optionSet.add("Not enough data to determine.");
    const shuffled = Array.from(optionSet).sort(() => Math.random() - 0.5);
    document.getElementById("quizOptions").innerHTML = shuffled.map((o, i) =>
        `<button class="quiz-opt btn-sm" data-idx="${i}" onclick="checkQuiz(this)">${o}</button>`
    ).join('');
}

function checkQuiz(btn) {
    quizTotal++;
    const isCorrect = btn.textContent === quizCurrentAnswer;
    document.querySelectorAll(".quiz-opt").forEach(b => {
        b.disabled = true;
        if (b.textContent === quizCurrentAnswer) b.classList.add("quiz-correct");
    });
    if (isCorrect) { quizCorrect++; showToast("Correct! 🎉", "success"); }
    else { btn.classList.add("quiz-wrong"); showToast("Wrong! Try again.", "error"); }
    document.getElementById("quizScore").textContent = `Score: ${quizCorrect}/${quizTotal}`;
}

const BADGES = [
    {id:"profile_complete",icon:"👤",title:"Profile Pro",desc:"Complete your profile to 100%",check:s=>(s.profileCompletion||0)>=100},
    {id:"first_app",icon:"📝",title:"First Step",desc:"Apply to your first job",check:s=>(s.totalApplications||0)>=1},
    {id:"five_apps",icon:"🚀",title:"Go-Getter",desc:"Apply to 5 or more jobs",check:s=>(s.totalApplications||0)>=5},
    {id:"shortlisted",icon:"⭐",title:"Shortlisted!",desc:"Get shortlisted for a role",check:s=>(s.statusCounts?.shortlisted||0)>=1},
    {id:"selected",icon:"🏆",title:"Champion",desc:"Get selected/accepted",check:s=>(s.statusCounts?.accepted||0)>=1},
    {id:"skill_master",icon:"🧠",title:"Skill Master",desc:"Add 5+ skills to your profile",check:s=>(s.profile?.skills||[]).length>=5},
    {id:"cgpa_star",icon:"🌟",title:"CGPA Star",desc:"Maintain CGPA above 8.0",check:s=>(s.profile?.cgpa||0)>=8},
    {id:"resume_ready",icon:"📄",title:"Resume Ready",desc:"Upload your resume",check:s=>!!(s.profile?.resumeUrl)},
    {id:"eligible",icon:"✅",title:"Eligible",desc:"Meet eligibility criteria (CGPA≥6, 0 backlogs)",check:s=>s.isEligible},
    {id:"cert_champion",icon:"🎓",title:"Cert Champion",desc:"Complete certifications",check:s=>(s.certifications || s.profile?.certificationCount || 0)>=1},
    {id:"ten_apps",icon:"💪",title:"Persistent",desc:"Apply to 10+ jobs",check:s=>s.totalApplications>=10},
    {id:"multi_short",icon:"🔥",title:"Hot Prospect",desc:"Get shortlisted for 3+ roles",check:s=>(s.statusCounts?.shortlisted || 0)>=3},
];

async function loadAchievements() {
    try {
        const stats = await getStudentStats();
        let unlocked = 0;
        const grid = document.getElementById("badgesGrid");
        grid.innerHTML = BADGES.map(b => {
            const earned = b.check(stats);
            if (earned) unlocked++;
            return `<div class="badge-card ${earned ? 'earned' : 'locked'}">
                <div class="badge-icon">${b.icon}</div>
                <h4>${b.title}</h4>
                <p>${b.desc}</p>
                <span class="badge-status">${earned ? '✅ Unlocked' : '🔒 Locked'}</span>
            </div>`;
        }).join('');
        document.getElementById("achUnlocked").textContent = unlocked;
        document.getElementById("achTotal").textContent = BADGES.length;
        const pct = Math.round((unlocked / BADGES.length) * 100);
        document.getElementById("achProgress").textContent = pct + "%";
        document.getElementById("achProgressBar").style.width = pct + "%";
    } catch (e) { console.warn("Badges error:", e); }
}

let calendarDate = new Date();
let calendarEvents = [];

async function loadCalendar() {
    try {
        const [trainings, jobs] = await Promise.all([getTrainings().catch(() => []), getJobs().catch(() => [])]);
        calendarEvents = [];
        trainings.forEach(t => { calendarEvents.push({date: t.date, title: t.title, type: t.type || "training", source: "training"}); });
        jobs.filter(j => j.deadline && j.status === "active").forEach(j => {
            calendarEvents.push({date: j.deadline, title: `${j.company} — ${j.role} (Deadline)`, type: "deadline", source: "job"});
        });
        renderCalendar();
    } catch (e) { console.warn("Calendar error:", e); }
}

function renderCalendar() {
    const year = calendarDate.getFullYear(), month = calendarDate.getMonth();
    document.getElementById("calendarMonthTitle").textContent = calendarDate.toLocaleDateString("en-IN", {month:"long", year:"numeric"});
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    let html = '';
    for (let i = 0; i < firstDay; i++) html += '<div class="cal-day empty"></div>';
    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const dayEvents = calendarEvents.filter(e => {
            if (!e.date) return false;
            const eDate = new Date(e.date);
            return eDate.getFullYear() === year && eDate.getMonth() === month && eDate.getDate() === d;
        });
        const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
        const dots = dayEvents.map(e => `<span class="cal-dot cal-dot-${e.type === 'placement-drive' ? 'drive' : e.type}"></span>`).join('');
        const titleAttr = dayEvents.length ? dayEvents.map(e=>e.title).join(', ').replace(/"/g, '&quot;') : '';
        html += `<div class="cal-day ${isToday ? 'today' : ''} ${dayEvents.length ? 'has-event' : ''}" title="${titleAttr}">
            <span class="cal-day-num">${d}</span>${dots ? `<div class="cal-dots">${dots}</div>` : ''}
        </div>`;
    }
    document.getElementById("calendarDays").innerHTML = html;
    const monthEvents = calendarEvents.filter(e => {
        if (!e.date) return false;
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
    }).sort((a,b) => new Date(a.date) - new Date(b.date));
    const listEl = document.getElementById("calendarEventsList");
    if (!monthEvents.length) { listEl.innerHTML = '<div class="empty-state">No events this month</div>'; return; }
    listEl.innerHTML = monthEvents.map(e => `<div class="deadline-item">
        <div class="dl-left"><strong>${e.title}</strong><span class="dl-date">📅 ${new Date(e.date).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</span></div>
        <span class="iq-cat">${e.type}</span>
    </div>`).join('');
}

function changeCalendarMonth(dir) {
    calendarDate.setMonth(calendarDate.getMonth() + dir);
    renderCalendar();
}

async function loadSalaryInsights() {
    const el = document.getElementById("salaryInsightsGrid");
    try {
        const jobs = typeof allJobs !== 'undefined' && allJobs.length ? allJobs : await getJobs();
        const salaries = jobs.filter(j => j.salary && j.status === "active").map(j => {
            const num = parseFloat(j.salary.replace(/[^\d.]/g, ''));
            return {company: j.company, role: j.role, salary: num, raw: j.salary};
        }).filter(s => s.salary > 0).sort((a, b) => b.salary - a.salary);
        if (!salaries.length) { el.innerHTML = '<div class="empty-state">No salary data available from active jobs</div>'; return; }
        const max = salaries[0].salary;
        const avg = (salaries.reduce((s, x) => s + x.salary, 0) / salaries.length).toFixed(1);
        const min = salaries[salaries.length - 1].salary;
        el.innerHTML = `
            <div class="salary-summary">
                <div class="salary-stat"><span class="salary-label">Highest</span><span class="salary-val salary-high">₹${max} LPA</span></div>
                <div class="salary-stat"><span class="salary-label">Average</span><span class="salary-val salary-avg">₹${avg} LPA</span></div>
                <div class="salary-stat"><span class="salary-label">Lowest</span><span class="salary-val salary-low">₹${min} LPA</span></div>
            </div>
            <div class="salary-bars">${salaries.slice(0, 8).map(s => `
                <div class="salary-bar-item">
                    <span class="salary-company">${s.company}</span>
                    <div class="demand-bar"><div class="demand-fill fill-green" style="width:${(s.salary/max*100)}%"></div></div>
                    <span class="salary-amount">${s.raw}</span>
                </div>`).join('')}
            </div>`;
    } catch (e) { el.innerHTML = '<div class="empty-state">Could not load salary data</div>'; }
}

async function loadPeerComparison() {
    try {
        const stats = await getStudentStats();
        const profile = stats.profile;
        document.getElementById("peerYourCGPA").textContent = profile.cgpa > 0 ? profile.cgpa.toFixed(2) : "N/A";
        document.getElementById("peerYourSkills").textContent = (profile.skills || []).length;
        try {
            const placements = await getPlacements();
            const latest = placements.sort((a, b) => b.yearOrder - a.yearOrder)[0];
            if (latest) {
                document.getElementById("peerBatchAvg").textContent = latest.avgCTC ? latest.avgCTC + " LPA" : "N/A";
            }
        } catch (e) {}
        const profileScore = (stats.profileCompletion || 0) + (profile.cgpa || 0) * 10 + ((profile.skills || []).length) * 5;
        const percentile = Math.min(99, Math.max(1, Math.round(50 + (profileScore - 70) * 0.5)));
        document.getElementById("peerRankText").textContent = `Top ${100 - percentile}%`;
        document.getElementById("peerBatchAvgSkills").textContent = "3-5";
        document.getElementById("peerProfileRank").textContent = percentile >= 75 ? "🌟 Above Avg" : percentile >= 50 ? "👍 Average" : "📈 Below Avg";
        const circle = document.getElementById("peerRankCircle");
        if (percentile >= 75) circle.style.borderColor = "#4caf50";
        else if (percentile >= 50) circle.style.borderColor = "#FBC02D";
        else circle.style.borderColor = "#ef5350";
    } catch (e) { console.warn("Peer comparison error:", e); }
}

let resumeProfile = null;
async function renderResume() {
    const el = document.getElementById("resumePreview");
    try {
        if (!resumeProfile) resumeProfile = await getProfile();
        const p = resumeProfile;
        const template = document.getElementById("resumeTemplate").value;

        const name = p.name || "Your Name";
        const email = p.email || "";
        const phone = p.phone || "";
        const course = p.course || "Course";
        const spec = p.specialization || "";
        const batch = p.batch || "N/A";
        const cgpa = p.cgpa ? p.cgpa.toFixed(2) : "N/A";
        const tenth = p.tenthPercentage || "N/A";
        const twelfth = p.twelfthPercentage || "N/A";
        const skills = p.skills || [];
        const regNum = p.registerNumber || "N/A";
        const resumeUrl = p.resumeUrl || "";
        const certCount = p.certificationCount || 0;
        const placementStatus = p.placementStatus || "not-placed";
        const backlogs = p.backlogs ?? "N/A";

        // Contact line
        const contactParts = [email, phone].filter(Boolean);
        const contactLine = contactParts.join("  •  ");

        // Skills HTML
        const skillsHtml = skills.length > 0
            ? skills.map(s => `<span class="res-skill-tag">${s}</span>`).join("")
            : '<span class="res-na">No skills added yet</span>';

        // Placement status badge
        const statusMap = { "placed": "✅ Placed", "not-placed": "🔍 Seeking Opportunities", "opted-out": "⏸ Opted Out" };
        const statusLabel = statusMap[placementStatus] || "🔍 Seeking Opportunities";

        // Build the resume based on template
        const cls = template === "modern" ? "resume-modern" : template === "minimal" ? "resume-minimal" : "resume-classic";

        el.innerHTML = `<div class="resume-page ${cls}">
            <div class="res-header">
                <h1>${name}</h1>
                <div class="res-contact">${contactLine}</div>
                <div class="res-tagline">${course}${spec ? " — " + spec : ""} | ${statusLabel}</div>
            </div>

            <div class="res-body">
                <div class="res-section">
                    <h2><span class="res-section-icon">🎯</span> Career Objective</h2>
                    <p>Aspiring ${spec || course} graduate seeking opportunities to apply academic knowledge and technical skills in a challenging professional environment. Eager to contribute to organizational goals while growing as a professional.</p>
                </div>

                <div class="res-section">
                    <h2><span class="res-section-icon">🎓</span> Education</h2>
                    <div class="res-edu-card">
                        <div class="res-edu-row">
                            <div class="res-edu-left">
                                <strong>${course}${spec ? " (" + spec + ")" : ""}</strong>
                                <span>Sri GCSR College of Engineering & Technology, Rajam</span>
                            </div>
                            <div class="res-edu-right">
                                <span class="res-badge">Batch ${batch}</span>
                                <span class="res-cgpa">CGPA: <strong>${cgpa}</strong></span>
                            </div>
                        </div>
                    </div>
                    <div class="res-academic-grid">
                        <div class="res-academic-item">
                            <span class="res-academic-label">10th Standard</span>
                            <span class="res-academic-value">${tenth}%</span>
                        </div>
                        <div class="res-academic-item">
                            <span class="res-academic-label">12th Standard / Diploma</span>
                            <span class="res-academic-value">${twelfth}%</span>
                        </div>
                        <div class="res-academic-item">
                            <span class="res-academic-label">Backlogs</span>
                            <span class="res-academic-value">${backlogs}</span>
                        </div>
                    </div>
                </div>

                <div class="res-section">
                    <h2><span class="res-section-icon">💻</span> Technical Skills</h2>
                    <div class="res-skills-grid">${skillsHtml}</div>
                </div>

                ${certCount > 0 ? `<div class="res-section">
                    <h2><span class="res-section-icon">📜</span> Certifications</h2>
                    <p>${certCount} industry certification${certCount > 1 ? "s" : ""} completed (IBM / ICT Academy)</p>
                </div>` : ""}

                ${resumeUrl ? `<div class="res-section">
                    <h2><span class="res-section-icon">🔗</span> Portfolio / Resume Link</h2>
                    <p><a href="${resumeUrl}" target="_blank" class="res-link">${resumeUrl}</a></p>
                </div>` : ""}

                <div class="res-section">
                    <h2><span class="res-section-icon">📋</span> Profile Summary</h2>
                    <div class="res-summary-grid">
                        <div class="res-summary-item"><span>Register Number</span><strong>${regNum}</strong></div>
                        <div class="res-summary-item"><span>College</span><strong>Sri GCSR, Rajam</strong></div>
                        <div class="res-summary-item"><span>Batch</span><strong>${batch}</strong></div>
                        <div class="res-summary-item"><span>Status</span><strong>${statusLabel}</strong></div>
                    </div>
                </div>

                <div class="res-section res-declaration">
                    <h2><span class="res-section-icon">✍️</span> Declaration</h2>
                    <p>I hereby declare that the information furnished above is true to the best of my knowledge and belief.</p>
                    <div class="res-signature">
                        <div class="res-sig-line"></div>
                        <span>${name}</span>
                    </div>
                </div>
            </div>
        </div>`;
    } catch (e) { el.innerHTML = '<div class="empty-state">Please complete your profile first</div>'; }
}

function printResume() {
    const content = document.getElementById("resumePreview").innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>Resume</title><style>
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Inter','Segoe UI',sans-serif;padding:40px;color:#333;background:#fff;line-height:1.6}
        .resume-page{max-width:750px;margin:0 auto}
        .res-body{margin-top:20px}
        .res-header{text-align:center;padding-bottom:20px;margin-bottom:8px;border-bottom:3px solid #0B1D3A}
        .res-header h1{font-size:32px;font-weight:800;color:#0B1D3A;letter-spacing:-0.5px;margin:0 0 8px}
        .res-contact{font-size:13px;color:#555;letter-spacing:0.3px}
        .res-tagline{font-size:12px;color:#888;margin-top:6px;font-weight:500}
        .res-section{margin-bottom:22px}
        .res-section h2{font-size:14px;font-weight:700;color:#0B1D3A;text-transform:uppercase;letter-spacing:1.5px;border-bottom:2px solid #0B1D3A;padding-bottom:6px;margin-bottom:14px;display:flex;align-items:center;gap:6px}
        .res-section-icon{font-size:14px}
        .res-section p{font-size:13.5px;line-height:1.7;color:#444}
        .res-edu-card{background:#f8f9fb;border:1px solid #e8ecf0;border-radius:8px;padding:16px 18px;margin-bottom:12px}
        .res-edu-row{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
        .res-edu-left{display:flex;flex-direction:column;gap:3px}
        .res-edu-left strong{font-size:15px;color:#1a1a1a}
        .res-edu-left span{font-size:12px;color:#777}
        .res-edu-right{display:flex;flex-direction:column;align-items:flex-end;gap:4px}
        .res-badge{font-size:11px;background:#0B1D3A;color:#fff;padding:3px 10px;border-radius:12px;font-weight:600}
        .res-cgpa{font-size:13px;color:#0B1D3A;font-weight:600}
        .res-cgpa strong{font-size:18px}
        .res-academic-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
        .res-academic-item{text-align:center;padding:10px;background:#f4f5f8;border-radius:8px;border:1px solid #e8ecf0}
        .res-academic-label{display:block;font-size:10px;text-transform:uppercase;color:#888;font-weight:600;letter-spacing:0.5px;margin-bottom:2px}
        .res-academic-value{display:block;font-size:18px;font-weight:800;color:#0B1D3A}
        .res-skills-grid{display:flex;flex-wrap:wrap;gap:8px}
        .res-skill-tag{display:inline-block;padding:5px 14px;background:#eef3fa;color:#1e4f9a;border-radius:20px;font-size:12px;font-weight:600;border:1px solid #d0dff2}
        .res-na{font-size:13px;color:#aaa;font-style:italic}
        .res-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .res-summary-item{padding:10px 14px;background:#f8f9fb;border-radius:8px;border:1px solid #e8ecf0;display:flex;flex-direction:column;gap:2px}
        .res-summary-item span{font-size:10px;text-transform:uppercase;color:#888;font-weight:600;letter-spacing:0.3px}
        .res-summary-item strong{font-size:14px;color:#1a1a1a}
        .res-link{color:#1e4f9a;text-decoration:none;font-weight:500}
        .res-declaration{margin-top:28px;padding-top:16px;border-top:1px dashed #ccc}
        .res-signature{margin-top:24px;text-align:right}
        .res-sig-line{width:180px;height:1px;background:#333;margin-left:auto;margin-bottom:4px}
        .res-signature span{font-size:14px;font-weight:700;color:#0B1D3A}
        .resume-modern .res-header{background:linear-gradient(135deg,#0B1D3A,#1e4f9a);color:#fff;padding:32px 36px;margin:-40px -40px 24px;border-bottom:none}
        .resume-modern .res-header h1{color:#fff}.resume-modern .res-contact{color:rgba(255,255,255,0.85)}
        .resume-modern .res-tagline{color:rgba(255,255,255,0.65)}
        .resume-minimal .res-header{text-align:left;border-bottom:none;padding-left:18px;border-left:4px solid #FBC02D}
        .resume-minimal .res-header h1{font-size:28px;color:#222}
        @media print{body{padding:20px}.res-edu-card,.res-academic-item,.res-summary-item{-webkit-print-color-adjust:exact;print-color-adjust:exact}}
    </style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
}

function downloadResumePDF() {
    const element = document.getElementById("resumePreview");
    if (!element || !element.innerHTML.trim() || element.querySelector('.empty-state') || element.querySelector('.loading-state')) {
        showToast("Please generate your resume first", "error");
        return;
    }
    const opt = {
        margin: [10, 10, 10, 10],
        filename: `Resume_${(resumeProfile?.name || 'Student').replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // Clone and style for PDF (white background)
    const clone = element.cloneNode(true);
    clone.style.background = '#fff';
    clone.style.color = '#222';
    clone.style.padding = '20px';
    showToast("Generating PDF...", "info");
    html2pdf().set(opt).from(clone).save();
}

// ===== STUDY PLANNER =====
let pomodoroTimer = null;
let pomodoroSeconds = 25 * 60;
let pomodoroRunning = false;
let pomodoroSessions = parseInt(localStorage.getItem('pomodoroSessions') || '0');

function updatePomodoroDisplay() {
    const mins = Math.floor(pomodoroSeconds / 60);
    const secs = pomodoroSeconds % 60;
    const el = document.getElementById('pomodoroDisplay');
    if (el) el.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
}

function togglePomodoro() {
    const btn = document.getElementById('pomodoroStartBtn');
    if (pomodoroRunning) {
        clearInterval(pomodoroTimer);
        pomodoroRunning = false;
        if (btn) btn.textContent = '▶ Start';
    } else {
        pomodoroRunning = true;
        if (btn) btn.textContent = '⏸ Pause';
        pomodoroTimer = setInterval(() => {
            pomodoroSeconds--;
            updatePomodoroDisplay();
            if (pomodoroSeconds <= 0) {
                clearInterval(pomodoroTimer);
                pomodoroRunning = false;
                pomodoroSessions++;
                localStorage.setItem('pomodoroSessions', pomodoroSessions);
                const countEl = document.getElementById('pomodoroCount');
                if (countEl) countEl.textContent = pomodoroSessions;
                if (btn) btn.textContent = '▶ Start';
                showToast('🍅 Pomodoro complete! Take a break.', 'success');
                pomodoroSeconds = 25 * 60;
                updatePomodoroDisplay();
            }
        }, 1000);
    }
}

function resetPomodoro() {
    clearInterval(pomodoroTimer);
    pomodoroRunning = false;
    pomodoroSeconds = 25 * 60;
    updatePomodoroDisplay();
    const btn = document.getElementById('pomodoroStartBtn');
    if (btn) btn.textContent = '▶ Start';
}

function setPomodoroTime(mins) {
    clearInterval(pomodoroTimer);
    pomodoroRunning = false;
    pomodoroSeconds = mins * 60;
    updatePomodoroDisplay();
    const btn = document.getElementById('pomodoroStartBtn');
    if (btn) btn.textContent = '▶ Start';
    const label = document.getElementById('pomodoroLabel');
    if (label) label.textContent = mins <= 5 ? 'Break Time' : 'Focus Session';
}

function loadStudyTasks() {
    const tasks = JSON.parse(localStorage.getItem('studyTasks') || '[]');
    const el = document.getElementById('studyTaskList');
    if (!el) return;
    if (!tasks.length) {
        el.innerHTML = '<div style="text-align:center;padding:20px;color:rgba(255,255,255,0.3);font-size:13px;">No tasks yet. Add one above!</div>';
        return;
    }
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    el.innerHTML = tasks.map((t, i) => `
        <div style="display:flex;align-items:center;gap:12px;padding:10px 12px;background:rgba(255,255,255,${t.done?'0.03':'0.06'});border-radius:10px;margin-bottom:6px;transition:all 0.2s;">
            <input type="checkbox" ${t.done?'checked':''} onchange="toggleStudyTask(${i})" style="width:18px;height:18px;cursor:pointer;accent-color:#FBC02D;">
            <span style="flex:1;font-size:14px;color:${t.done?'rgba(255,255,255,0.3)':'rgba(255,255,255,0.8)'};${t.done?'text-decoration:line-through;':''}">${esc(t.text)}</span>
            <button onclick="removeStudyTask(${i})" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:16px;">\u2715</button>
        </div>
    `).join('');
}

function addStudyTask(e) {
    e.preventDefault();
    const input = document.getElementById('studyTaskInput');
    const text = input.value.trim();
    if (!text || text.length > 200) return;
    const tasks = JSON.parse(localStorage.getItem('studyTasks') || '[]');
    if (tasks.length >= 50) { showToast('Max 50 tasks allowed', 'error'); return; }
    tasks.unshift({ text, done: false });
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
    input.value = '';
    loadStudyTasks();
}

function toggleStudyTask(idx) {
    const tasks = JSON.parse(localStorage.getItem('studyTasks') || '[]');
    if (tasks[idx]) tasks[idx].done = !tasks[idx].done;
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
    loadStudyTasks();
}

function removeStudyTask(idx) {
    const tasks = JSON.parse(localStorage.getItem('studyTasks') || '[]');
    tasks.splice(idx, 1);
    localStorage.setItem('studyTasks', JSON.stringify(tasks));
    loadStudyTasks();
}

// ===== GOAL TRACKER =====
function loadGoals() {
    const goals = JSON.parse(localStorage.getItem('placementGoals') || '[]');
    const el = document.getElementById('goalsList');
    if (!el) return;
    if (!goals.length) {
        el.innerHTML = '<div class="glass-card" style="text-align:center;color:rgba(255,255,255,0.3);">No goals set yet. Add your first placement goal above!</div>';
        return;
    }
    const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    el.innerHTML = goals.map((g, i) => {
        const target = new Date(g.date);
        const today = new Date();
        const daysLeft = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
        const statusColor = g.done ? '#2e7d32' : daysLeft < 0 ? '#C62828' : daysLeft < 7 ? '#FBC02D' : 'rgba(255,255,255,0.3)';
        const statusText = g.done ? '\u2705 Completed' : daysLeft < 0 ? '\u26a0\ufe0f Overdue' : `${daysLeft} days left`;
        return `
        <div class="glass-card" style="display:flex;align-items:center;gap:16px;${g.done?'opacity:0.6;':''}">
            <input type="checkbox" ${g.done?'checked':''} onchange="toggleGoal(${i})" style="width:22px;height:22px;cursor:pointer;accent-color:#FBC02D;flex-shrink:0;">
            <div style="flex:1;">
                <h4 style="font-size:15px;font-weight:600;color:${g.done?'rgba(255,255,255,0.4)':'#fff'};margin:0 0 4px;${g.done?'text-decoration:line-through;':''}">${esc(g.text)}</h4>
                <span style="font-size:12px;color:${statusColor};">${statusText} \u2022 Target: ${target.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
            </div>
            <button onclick="removeGoal(${i})" style="background:none;border:none;color:rgba(255,255,255,0.3);cursor:pointer;font-size:18px;">\ud83d\uddd1</button>
        </div>`;
    }).join('');
}

function addGoal(e) {
    e.preventDefault();
    const input = document.getElementById('goalInput');
    const date = document.getElementById('goalDate');
    if (!input.value.trim() || input.value.trim().length > 200 || !date.value) return;
    const goals = JSON.parse(localStorage.getItem('placementGoals') || '[]');
    if (goals.length >= 20) { showToast('Max 20 goals allowed', 'error'); return; }
    goals.push({ text: input.value.trim(), date: date.value, done: false });
    localStorage.setItem('placementGoals', JSON.stringify(goals));
    input.value = ''; date.value = '';
    loadGoals();
    showToast('Goal added!', 'success');
}

function toggleGoal(idx) {
    const goals = JSON.parse(localStorage.getItem('placementGoals') || '[]');
    if (goals[idx]) goals[idx].done = !goals[idx].done;
    localStorage.setItem('placementGoals', JSON.stringify(goals));
    loadGoals();
}

function removeGoal(idx) {
    const goals = JSON.parse(localStorage.getItem('placementGoals') || '[]');
    goals.splice(idx, 1);
    localStorage.setItem('placementGoals', JSON.stringify(goals));
    loadGoals();
}

if (typeof showSection === 'function') {
    const origShowSection = showSection;
    showSection = function(section, navEl) {
        origShowSection(section, navEl);
        if (section === "interview") { filterInterviewQuestions(); loadInterviewChecklist(); startQuiz(); }
        if (section === "achievements") loadAchievements();
        if (section === "calendar") loadCalendar();
        if (section === "resume") renderResume();
        if (section === "studyplanner") { loadStudyTasks(); const c = document.getElementById('pomodoroCount'); if(c) c.textContent = pomodoroSessions; }
        if (section === "goals") loadGoals();
    };
}

if (typeof loadDashboard === 'function') {
    const origLoadDashboard = loadDashboard;
    loadDashboard = async function() {
        await origLoadDashboard();
        try { loadSalaryInsights(); } catch(e) { console.warn('Salary insights error:', e); }
        try { loadPeerComparison(); } catch(e) { console.warn('Peer comparison error:', e); }
    };
}
