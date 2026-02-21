
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
        const skills = (p.skills || []).join(" • ") || "Not specified";
        const cls = template === "modern" ? "resume-modern" : template === "minimal" ? "resume-minimal" : "resume-classic";
        el.innerHTML = `<div class="resume-page ${cls}">
            <div class="res-header"><h1>${p.name || "Your Name"}</h1>
                <div class="res-contact">${p.email || ""} ${p.phone ? " | "+p.phone : ""}</div>
            </div>
            <div class="res-section"><h2>Education</h2><hr>
                <p class="res-edu-title"><strong>${p.course || "Course"} — ${p.specialization || ""}</strong></p>
                <p>Sri GCSR College, Rajam | Batch: ${p.batch || "N/A"}</p>
                <p>CGPA: ${p.cgpa || "N/A"} | 10th: ${p.tenthPercentage || "N/A"}% | 12th: ${p.twelfthPercentage || "N/A"}%</p>
            </div>
            <div class="res-section"><h2>Skills</h2><hr><p>${skills}</p></div>
            <div class="res-section"><h2>Register Number</h2><hr><p>${p.registerNumber || "N/A"}</p></div>
            ${p.resumeUrl ? `<div class="res-section"><h2>Resume Link</h2><hr><p><a href="${p.resumeUrl}" target="_blank">${p.resumeUrl}</a></p></div>` : ""}
            <div class="res-section"><h2>Declaration</h2><hr><p>I hereby declare that the above information is true to the best of my knowledge.</p></div>
        </div>`;
    } catch (e) { el.innerHTML = '<div class="empty-state">Please complete your profile first</div>'; }
}

function printResume() {
    const content = document.getElementById("resumePreview").innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>Resume</title><style>
        *{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;padding:40px;color:#222;background:#fff}
        .resume-page{max-width:700px;margin:0 auto}.res-header{text-align:center;margin-bottom:24px;border-bottom:2px solid #0B1D3A;padding-bottom:16px}
        .res-header h1{font-size:28px;color:#0B1D3A}.res-contact{font-size:13px;color:#555;margin-top:6px}
        .res-section{margin:16px 0}.res-section h2{font-size:16px;color:#0B1D3A;text-transform:uppercase;letter-spacing:1px}
        .res-section hr{border:none;border-top:1px solid #ddd;margin:6px 0 10px}.res-section p{font-size:14px;line-height:1.6}
        .res-edu-title{font-size:15px}a{color:#1e4f9a}@media print{body{padding:20px}}
    </style></head><body>${content}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
}

if (typeof showSection === 'function') {
    const origShowSection = showSection;
    showSection = function(section, navEl) {
        origShowSection(section, navEl);
        if (section === "interview") { filterInterviewQuestions(); loadInterviewChecklist(); startQuiz(); }
        if (section === "achievements") loadAchievements();
        if (section === "calendar") loadCalendar();
        if (section === "resume") renderResume();
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
