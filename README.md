# 🎓 TNPC Placement Intelligence Portal

### Sri GCSR College – Training & Placement Cell

An enterprise-grade full-stack Placement Management & Analytics System designed for institutional-level operations. Built as a **Progressive Web App (PWA)** with premium mobile-first design.

---

## 🌍 Live System Overview

TNPC Portal is a centralized digital platform that:

✔ Manages campus recruitment lifecycle
✔ Tracks student job applications
✔ Stores historical & modern placement data
✔ Provides dynamic placement analytics dashboard
✔ Enables role-based secure access (Admin & Student)
✔ Premium Glassmorphism UI with Micro-animations
✔ **Installable PWA** with offline support
✔ **Mobile-first responsive design** with bottom navigation

---

## 🏗 Architecture Overview

```
Frontend (HTML/CSS/JS + PWA)
         ↓
Express.js REST API
         ↓
MongoDB Atlas (Cloud Database)
         ↓
JWT Authentication Layer
         ↓
Role-Based Access Control
```

---

## 🧱 Technology Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | HTML5, CSS3, JavaScript, Glassmorphism, CSS Animations |
| Charts     | Chart.js                                               |
| Backend    | Node.js, Express.js                                    |
| Database   | MongoDB Atlas                                          |
| Auth       | JWT (JSON Web Token)                                   |
| Email      | Nodemailer (SMTP)                                      |
| PWA        | Service Worker, Web App Manifest                       |
| Hosting    | Render (Backend), Static (Frontend)                    |
| Versioning | Git                                                    |

---

## 📱 PWA Features

- **Installable** on Android, iOS, and Desktop
- **Offline Support** via Service Worker with smart caching strategy
- **Premium Splash Screen** with animated progress bar and floating orbs
- **Mobile Bottom Navigation** with quick-access tabs and "More" popup menu
- **Safe Area Inset** support for notched devices
- **Touch-optimized** with 48px+ tap targets and disabled hover on touch devices
- **iOS Zoom Prevention** with 16px font-size on inputs

---

## 🔐 Security Model

**Authentication:**

- JWT-based token authentication
- Authorization header validation
- Protected admin routes
- Middleware-driven verification
- OTP email verification for registration
- Secure password reset flow

**Roles:**

- **Admin** — Full CRUD on jobs, placements, trainings, announcements, student management
- **Student** — View/apply to jobs, track applications, profile management, AI predictor

---

## 📊 Student Dashboard Features

| Feature               | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| 📊 Dashboard Overview | Profile strength, readiness stats, daily placement tips          |
| 💼 Job Opportunities  | Browse, search, filter, and apply to active jobs                 |
| 🔖 Saved Jobs         | Bookmark jobs for later review                                   |
| 📝 My Applications    | Track application status (pending/shortlisted/accepted/rejected) |
| 🎓 Certifications     | View IBM & ICT Academy certifications                            |
| 🎯 Skill Gap Analyzer | Compare skills against job market demand                         |
| 📅 Trainings & Events | Upcoming campus training sessions                                |
| 🤖 AI Predictor       | ML-based placement probability prediction                        |
| 📝 Interview Prep     | Question bank, quiz, and interview checklist                     |
| 🏅 Achievements       | Gamified badges and progress tracking                            |
| 📆 Calendar           | Visual calendar with drives, trainings, and deadlines            |
| 📄 Resume Builder     | Generate professional resumes with templates                     |
| 🚀 SkillBuild         | Curated learning resources directory                             |
| 📖 Study Planner      | Pomodoro timer and study session tracking                        |
| 🎯 Goal Tracker       | Set and track career goals with deadlines                        |

---

## 👨‍💼 Admin Dashboard Features

| Feature                      | Description                                   |
| ---------------------------- | --------------------------------------------- |
| 📊 Analytics                 | Real-time placement stats, charts, funnels    |
| 👨‍🎓 Student Management        | Search, filter, export CSV, view profiles     |
| 💼 Job Posting               | Create and manage campus job listings         |
| 📋 Application Management    | Review, shortlist, accept/reject applications |
| 🎓 Certification Tracking    | Monitor student certification progress        |
| 📈 Placement Data            | Historical and modern placement records       |
| 📅 Training Management       | Create and manage training events             |
| 📢 Announcements             | Post campus-wide announcements                |
| 📊 Deep Insights             | Placement health score and advanced analytics |
| 🏢 Company Tracker           | Track recruiting company partnerships         |
| 📜 Activity Log              | Recent system activity and audit trail        |
| 📈 Course Performance Matrix | Department-wise placement performance         |

---

## 📂 Project Structure

```
backend/
├── middleware/
│   ├── authMiddleware.js
│   └── adminMiddleware.js
├── models/
│   ├── user.js
│   ├── Job.js
│   ├── Application.js
│   ├── Placement.js
│   ├── Certification.js
│   ├── Training.js
│   ├── Notification.js
│   └── TopCorporate.js
├── routes/
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   ├── applicationRouter.js
│   ├── placementRoutes.js
│   ├── certificationRoutes.js
│   ├── trainingRoutes.js
│   ├── notificationRoutes.js
│   └── topCorporateRoutes.js
├── utils/
│   └── otpUtil.js
├── server.js
├── config/db.js
├── .env
└── package.json

frontend/
├── assets/
│   ├── logos/
│   ├── icons/
│   └── images/
├── css/
│   ├── style.css
│   ├── dashboard.css
│   ├── premium.css
│   ├── premium-dashboard.css
│   ├── responsive.css
│   ├── mobile-dashboard.css
│   ├── app-loader.css
│   ├── pwa-enhancements.css
│   ├── auth.css
│   ├── placements.css
│   └── mous.css
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── data.js
│   ├── main.js
│   ├── animations.js
│   ├── counter.js
│   ├── student-dashboard.js
│   ├── student-features.js
│   ├── admin-dashboard.js
│   ├── admin-features.js
│   ├── app-loader.js
│   ├── pwa.js
│   ├── certifications.js
│   ├── placements.js
│   └── charts.js
├── index.html
├── about.html
├── contact.html
├── login.html
├── register.html
├── forgot-password.html
├── student-dashboard.html
├── admin-dashboard.html
├── certifications.html
├── placements.html
├── mous.html
├── recruiter.html
├── manifest.json
└── sw.js
```

---

## 🌐 REST API Documentation

### Authentication

| Method | Endpoint               | Auth | Description             |
| ------ | ---------------------- | ---- | ----------------------- |
| POST   | `/api/register`        | —    | Register new student    |
| POST   | `/api/verify-otp`      | —    | Verify email OTP        |
| POST   | `/api/login`           | —    | Login and get JWT       |
| POST   | `/api/forgot-password` | —    | Request password reset  |
| POST   | `/api/reset-password`  | —    | Reset password with OTP |
| GET    | `/api/profile`         | JWT  | Get user profile        |
| PUT    | `/api/profile`         | JWT  | Update user profile     |

### Jobs

| Method | Endpoint        | Auth  | Description               |
| ------ | --------------- | ----- | ------------------------- |
| GET    | `/api/jobs`     | —     | List all jobs (paginated) |
| GET    | `/api/jobs/:id` | —     | Get job details           |
| POST   | `/api/jobs`     | Admin | Create new job            |
| PUT    | `/api/jobs/:id` | Admin | Update job                |
| DELETE | `/api/jobs/:id` | Admin | Delete job                |

### Applications

| Method | Endpoint                | Auth  | Description               |
| ------ | ----------------------- | ----- | ------------------------- |
| POST   | `/api/applications`     | JWT   | Apply to a job            |
| GET    | `/api/applications/my`  | JWT   | Get my applications       |
| GET    | `/api/applications`     | Admin | Get all applications      |
| PATCH  | `/api/applications/:id` | Admin | Update application status |
| DELETE | `/api/applications/:id` | JWT   | Withdraw application      |

### Placements

| Method | Endpoint              | Auth  | Description             |
| ------ | --------------------- | ----- | ----------------------- |
| GET    | `/api/placements`     | —     | Get placement records   |
| POST   | `/api/placements`     | Admin | Add placement data      |
| PUT    | `/api/placements/:id` | Admin | Update placement data   |
| DELETE | `/api/placements/:id` | Admin | Delete placement record |

### Other Endpoints

| Resource        | Endpoints                  | Auth            |
| --------------- | -------------------------- | --------------- |
| Certifications  | GET, POST, PUT, DELETE     | Admin for write |
| Trainings       | GET, POST, PUT, DELETE     | Admin for write |
| Notifications   | GET, POST                  | Admin for POST  |
| Top Corporates  | GET, POST, DELETE          | Admin for write |
| Dashboard Stats | GET `/api/admin/stats`     | Admin           |
| Admin Analytics | GET `/api/admin/analytics` | Admin           |
| Student Stats   | GET `/api/student/stats`   | JWT             |

---

## 📈 Analytics Features

The portal dynamically renders:

✔ Year-wise Placement Growth Trend
✔ Department-wise Placement Distribution
✔ CGPA Distribution Analysis
✔ Salary Growth Trend (Highest vs Average CTC)
✔ Placement Percentage Trend
✔ Application Pipeline (Pending → Shortlisted → Accepted)
✔ KPI Summary Cards
✔ Placement Health Score
✔ Top Performing Departments

**All analytics are database-driven — no hardcoded values.**

---

## ⚙ Installation Guide

1. **Clone repository**

```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create .env file**

```
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. **Run server**

```bash
npm start
```

5. **Run Frontend**

Open `frontend/index.html` in browser or use a local server (e.g., Live Server in VS Code).

---

## 🧠 Design Philosophy

- **Premium Glassmorphism UI** with gradients, blur effects, and micro-animations
- **Mobile-first responsive design** with PWA capabilities
- **Modular architecture** with clean separation of concerns
- **Scalable database schema** supporting historical and modern data
- **Touch-optimized interactions** for mobile users
- **Skeleton loading states** for perceived performance
- **Time-aware greetings** for personalized experience

---

## 🚀 Production Features

- ✅ Cloud VPS Deployment (Render)
- ✅ MongoDB Atlas Cloud Database
- ✅ JWT Authentication
- ✅ OTP Email Verification
- ✅ Progressive Web App (PWA)
- ✅ Service Worker Caching
- ✅ Responsive Mobile Design
- ✅ Premium Loading Animations
- ✅ Role-based Access Control
- ✅ API Rate Limiting
- ✅ CORS Protection
- ✅ Helmet Security Headers

---

## 🏫 Institutional Contact

**Sri GCSR College**
Training & Placement Cell
Rajam, Vizianagaram District
Andhra Pradesh - 532127

TPO: Visweswara Rao Ch
Email: [placements@srigcsrcollege.org](mailto:placements@srigcsrcollege.org), [principal@srigcsrcollege.org](mailto:principal@srigcsrcollege.org)
Phone: 86399 18230, 08941-251336

---

## 👨‍💻 Developer

**CODEGENE'S 1.0**
Full Stack Developer
TNPC Portal System
