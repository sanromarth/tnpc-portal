# TNPC PORTAL — Training & Placement Cell Web Application

## Comprehensive Project Documentation

**Project Title:** TNPC Portal — Training & Placement Cell Management System
**Institution:** Sri GCSR College of Engineering & Technology, Rajam, Andhra Pradesh
**Affiliated To:** JNTUK (Jawaharlal Nehru Technological University, Kakinada)
**Developed By:** Sanromarth Andavarma
**Deployment URL:** https://tnpc-portal.vercel.app
**Backend API URL:** https://tnpc-backend.onrender.com
**Repository:** https://github.com/sanromarth/tnpc-portal

---

## TABLE OF CONTENTS

1. Abstract
2. Introduction
3. Problem Statement
4. Objectives
5. System Requirements
6. Technology Stack
7. System Architecture
8. Database Design
9. Module Description
10. Frontend Design
11. API Documentation
12. Security Implementation
13. Progressive Web App (PWA)
14. Deployment Architecture
15. Testing and Validation
16. Screenshots Description
17. Future Enhancements
18. Conclusion
19. References

---

## 1. ABSTRACT

The TNPC Portal is a full-stack web application developed for the Training & Placement Cell of Sri GCSR College of Engineering & Technology, Rajam. It serves as a centralized digital platform that bridges the gap between the placement cell administration and students. The system enables administrators to post job opportunities, manage student records, track placement statistics, announce training programs, and manage certifications. Students can browse jobs, apply directly, track their application status, build resumes, and access training materials. The application is built using modern web technologies — vanilla HTML/CSS/JavaScript on the frontend and Node.js with Express.js and MongoDB on the backend. It features JWT-based authentication with OTP email verification, role-based access control, a Progressive Web App (PWA) architecture for mobile installability, real-time analytics dashboards, and a premium glassmorphism-based responsive UI. The portal is deployed using Vercel (frontend) and Render (backend) for production-grade availability.

---

## 2. INTRODUCTION

The Training and Placement Cell is one of the most critical departments in any engineering college. It is responsible for facilitating campus recruitment, coordinating with corporate recruiters, organizing training programs, and maintaining placement records. Traditionally, these operations are managed through spreadsheets, email chains, and physical notice boards, which leads to information silos, delayed communication, and inefficient tracking.

The TNPC Portal addresses these challenges by providing a unified digital platform that automates and streamlines the entire placement lifecycle — from job posting to student application to placement tracking.

### 2.1 Scope of the Project

The project covers the following functional areas:

- **Student Registration & Authentication** — Secure sign-up with email OTP verification
- **Job Management** — Admin posting, student browsing, filtering, and application
- **Application Tracking** — Status management (pending, shortlisted, accepted, rejected)
- **Placement Statistics** — Historical year-wise placement data with analytics
- **Training Programs** — Scheduling and tracking of training sessions
- **Certifications** — IBM certifications and other industry certification records
- **Announcements** — Real-time notification system with read/unread tracking
- **Resume Builder** — Student profile-based auto-generated resume
- **Corporate Partnerships** — MOU tracking with industry partners
- **Progressive Web App** — Installable on mobile devices with offline capability

---

## 3. PROBLEM STATEMENT

The existing placement management process at Sri GCSR College relies on manual record-keeping, WhatsApp group announcements, and physical notice boards. This leads to:

1. **Information Asymmetry** — Students often miss job postings due to delayed communication
2. **No Centralized Tracking** — Applications are managed via Google Forms with no real-time status updates
3. **Manual Statistics** — Placement statistics are compiled manually at year-end, prone to errors
4. **No Mobile Access** — Students cannot access placement information on the go
5. **No Eligibility Filtering** — Students apply to jobs without knowing eligibility criteria
6. **Limited Recruiter Visibility** — No digital presence to showcase placement records to recruiters

The TNPC Portal solves all of the above by providing a digital, automated, and accessible solution.

---

## 4. OBJECTIVES

1. To develop a full-stack web application for the Training & Placement Cell
2. To implement secure authentication with email OTP verification
3. To provide role-based dashboards for administrators and students
4. To automate job posting, application tracking, and placement statistics
5. To build a Progressive Web App (PWA) for mobile installability
6. To implement real-time analytics with charts and visual dashboards
7. To create a premium, responsive, and accessible user interface
8. To deploy the application on cloud platforms for 24/7 availability

---

## 5. SYSTEM REQUIREMENTS

### 5.1 Hardware Requirements

| Component | Minimum Specification         |
| --------- | ----------------------------- |
| Processor | Intel Core i3 or equivalent   |
| RAM       | 4 GB                          |
| Storage   | 256 GB SSD                    |
| Internet  | Broadband connection          |
| Display   | 1366 × 768 minimum resolution |

### 5.2 Software Requirements

| Component        | Technology                                    |
| ---------------- | --------------------------------------------- |
| Operating System | Windows 10+ / macOS / Linux                   |
| Web Browser      | Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ |
| Runtime          | Node.js v18+                                  |
| Package Manager  | npm v9+                                       |
| Database         | MongoDB Atlas (Cloud)                         |
| Code Editor      | VS Code (recommended)                         |
| Version Control  | Git                                           |

---

## 6. TECHNOLOGY STACK

### 6.1 Frontend

| Technology           | Version | Purpose                                    |
| -------------------- | ------- | ------------------------------------------ |
| HTML5                | —       | Structure and semantic markup              |
| CSS3                 | —       | Styling, animations, responsive design     |
| JavaScript (ES6+)    | —       | Client-side logic and API interaction      |
| Chart.js             | Latest  | Data visualization (doughnut, line charts) |
| Google Fonts (Inter) | —       | Premium typography                         |

### 6.2 Backend

| Technology         | Version | Purpose                            |
| ------------------ | ------- | ---------------------------------- |
| Node.js            | 18+     | JavaScript runtime                 |
| Express.js         | 5.2.1   | Web framework for REST API         |
| Mongoose           | 9.2.1   | MongoDB ODM (Object Data Modeling) |
| bcryptjs           | 3.0.3   | Password hashing                   |
| jsonwebtoken (JWT) | 9.0.3   | Token-based authentication         |
| Nodemailer         | 8.0.1   | Email sending for OTP verification |
| Helmet             | 8.1.0   | HTTP security headers              |
| express-rate-limit | 7.5.0   | API rate limiting                  |
| Morgan             | 1.10.1  | HTTP request logging               |
| dotenv             | 17.3.1  | Environment variable management    |

### 6.3 Database

| Technology    | Version | Purpose                     |
| ------------- | ------- | --------------------------- |
| MongoDB Atlas | 7.x     | Cloud-hosted NoSQL database |

### 6.4 Deployment

| Platform | Purpose                  |
| -------- | ------------------------ |
| Vercel   | Frontend hosting and CDN |
| Render   | Backend API hosting      |
| GitHub   | Source code repository   |

---

## 7. SYSTEM ARCHITECTURE

### 7.1 Architecture Overview

The TNPC Portal follows a **three-tier client-server architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                        │
│             (Frontend — Vercel CDN)                         │
│                                                             │
│   HTML5 Pages ──── CSS3 Styling ──── JavaScript Logic       │
│   13 Pages         13 Stylesheets    20 Script Files        │
│   PWA + Service Worker + LocalStorage                       │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API (HTTPS)
                       │ JSON Requests/Responses
                       │ JWT Bearer Tokens
┌──────────────────────▼──────────────────────────────────────┐
│                    APPLICATION TIER                         │
│             (Backend — Render Cloud)                        │
│                                                             │
│   Express.js Server                                         │
│   ├── 8 Route Modules (auth, jobs, applications, etc.)      │
│   ├── 2 Middleware (authMiddleware, adminMiddleware)         │
│   ├── 8 Mongoose Models                                     │
│   ├── 1 Utility (OTP email sender)                          │
│   └── Security: Helmet + Rate Limiter + CORS                │
└──────────────────────┬──────────────────────────────────────┘
                       │ Mongoose ODM
                       │ MongoDB Wire Protocol
┌──────────────────────▼──────────────────────────────────────┐
│                      DATA TIER                              │
│             (MongoDB Atlas — AWS Cloud)                     │
│                                                             │
│   Collections: users, jobs, applications, placements,       │
│                trainings, certifications, notifications,    │
│                corporates                                   │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Data Flow

1. User opens the frontend (served by Vercel CDN)
2. User authenticates via login/register (JWT token returned)
3. Frontend stores JWT in localStorage
4. All API requests include JWT as Bearer token in headers
5. Backend validates token via authMiddleware
6. Backend queries MongoDB Atlas via Mongoose
7. Response is sent as JSON back to the frontend
8. Frontend renders the data into the DOM

---

## 8. DATABASE DESIGN

### 8.1 Entity-Relationship Overview

The database consists of 8 collections (entities):

| Collection         | Fields                                                                                                                                                                                                                          | Relationships                                |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| **Users**          | name, email, password, role, phone, course, specialization, registerNumber, batch, cgpa, tenthPercentage, twelfthPercentage, backlogs, skills[], resumeUrl, placementStatus, certificationCount, otpCode, otpExpiry, isVerified | Referenced by Applications                   |
| **Jobs**           | company, role, location, salary, description, type, status, eligibility, skills[], deadline, postedBy                                                                                                                           | postedBy → Users; Referenced by Applications |
| **Applications**   | jobId, studentId, status, remarks, appliedAt                                                                                                                                                                                    | jobId → Jobs; studentId → Users              |
| **Placements**     | batch, yearOrder, totalStudents, eligibleStudents, placementsOffered, companiesVisited, highestCTC, avgCTC, percentage                                                                                                          | Standalone                                   |
| **Trainings**      | title, description, trainer, date, duration, venue, type, status, attendees, createdBy                                                                                                                                          | createdBy → Users                            |
| **Certifications** | program, studentName, registerNumber, certificationId, completionDate, score, year                                                                                                                                              | Standalone                                   |
| **Notifications**  | title, message, targetRole, readBy[], createdBy                                                                                                                                                                                 | createdBy → Users                            |
| **Corporates**     | companyName, website, mouDate, status                                                                                                                                                                                           | Standalone                                   |

### 8.2 User Schema Detail

```javascript
{
  name: String (required, min 2 chars),
  email: String (required, unique, validated format),
  password: String (required, min 6 chars, bcrypt hashed),
  role: enum ["student", "admin"],
  phone: String,
  course: String,
  specialization: String,
  registerNumber: String,
  batch: String,
  cgpa: Number (0-10),
  tenthPercentage: Number (0-100),
  twelfthPercentage: Number (0-100),
  backlogs: Number (min 0),
  skills: [String],
  resumeUrl: String,
  placementStatus: enum ["not-placed", "placed", "opted-out"],
  certificationCount: Number,
  otpCode: String,
  otpExpiry: Date,
  isVerified: Boolean,
  timestamps: true (createdAt, updatedAt auto-generated)
}
```

### 8.3 Job Schema Detail

```javascript
{
  company: String (required),
  role: String (required),
  location: String (default: "On-site"),
  salary: String (default: "Not Disclosed"),
  description: String,
  type: enum ["Full-time", "Internship", "Part-time", "Contract"],
  status: enum ["active", "closed", "expired"],
  eligibility: Number (0-10, minimum CGPA),
  skills: [String],
  deadline: Date,
  postedBy: ObjectId (ref: User),
  timestamps: true
}
```

---

## 9. MODULE DESCRIPTION

### 9.1 Authentication Module

**Files:** `auth.js`, `login.js`, `register.js`, `forgot-password.js`, `authRoutes.js`

| Feature          | Description                                                        |
| ---------------- | ------------------------------------------------------------------ |
| Registration     | Name, email, password with server-side validation                  |
| OTP Verification | 6-digit OTP sent via Nodemailer to user's email                    |
| Login            | Email + password verification with bcrypt comparison               |
| JWT Token        | JSON Web Token issued on successful login (stored in localStorage) |
| Password Reset   | Forgot password flow with OTP verification                         |
| Token Validation | Every API call validates JWT via middleware                        |
| Auto-Redirect    | Expired/invalid tokens redirect to login page                      |

### 9.2 Admin Dashboard Module

**Files:** `admin-dashboard.js`, `admin-features.js`, `admin-dashboard.html`

| Feature                | Description                                                                  |
| ---------------------- | ---------------------------------------------------------------------------- |
| Analytics Overview     | Total students, jobs, applications, acceptance rate                          |
| Student Management     | View, search, filter students by course, batch, CGPA                         |
| Job Posting            | Create, edit, delete job listings with deadline auto-expiry                  |
| Application Management | View all applications, change status (pending/shortlisted/accepted/rejected) |
| Placement Records      | Add, edit, delete year-wise placement statistics                             |
| Training Management    | Schedule and manage training programs                                        |
| Certification Tracking | Record IBM and industry certifications                                       |
| Announcements          | Create notifications targeted to students or all users                       |
| Charts & Analytics     | Doughnut chart (application status), Line chart (placement trends)           |

### 9.3 Student Dashboard Module

**Files:** `student-dashboard.js`, `student-features.js`, `student-dashboard.html`

| Feature             | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| Profile Overview    | Completion percentage, CGPA, resume status, eligibility check |
| Job Browser         | Search, filter (by type), bookmark, apply to active jobs      |
| Application Tracker | Real-time status tracking with visual status pills            |
| Upcoming Deadlines  | Countdown timer for application deadlines                     |
| Saved Jobs          | Bookmark jobs using localStorage                              |
| Resume Builder      | Auto-generated resume from profile data                       |
| Pomodoro Timer      | Study focus timer with session tracking                       |
| Study Tasks         | To-do list with localStorage persistence                      |
| Goal Tracker        | Placement goals with deadline countdown                       |
| Interview Prep      | Quiz system and checklist for interview preparation           |
| Calendar            | Event calendar with job deadline integration                  |
| Salary Insights     | Industry salary comparison data                               |
| Peer Comparison     | Anonymous CGPA comparison with batch peers                    |
| Achievements        | Badge system for profile milestones                           |

### 9.4 Public Pages Module

**Files:** `index.html`, `about.html`, `placements.html`, `certifications.html`, `mous.html`, `contact.html`, `recruiter.html`

| Page              | Purpose                                                   |
| ----------------- | --------------------------------------------------------- |
| Home (index.html) | Landing page with hero section, stats, recruiter carousel |
| About             | College and placement cell information                    |
| Placements        | Year-wise placement statistics with interactive charts    |
| Certifications    | IBM certification records and analytics                   |
| MOUs              | Corporate partnerships and MOU details                    |
| Contact           | Contact form and office information                       |
| Recruiter         | Dedicated page for corporate recruiters                   |

---

## 10. FRONTEND DESIGN

### 10.1 Design Philosophy

The frontend follows a **premium glassmorphism design language** with:

- **Dark navy gradient background** (#0B1D3A to #1e4f9a)
- **Frosted glass card effects** (backdrop-filter: blur)
- **Premium golden accent** (#FBC02D) for CTAs and highlights
- **Inter font family** (Google Fonts) for modern typography
- **Micro-animations** for hover effects and transitions
- **Responsive design** for mobile, tablet, and desktop

### 10.2 CSS Architecture

| Stylesheet              | Purpose                                           | Lines |
| ----------------------- | ------------------------------------------------- | ----- |
| style.css               | Global styles, navbar, footer, public pages       | ~1400 |
| dashboard.css           | Dashboard layout, sidebar, stat cards, tables     | ~300  |
| premium-dashboard.css   | Enhanced glassmorphism effects, premium gradients | ~300  |
| responsive.css          | Media queries for mobile/tablet breakpoints       | ~200  |
| app-loader.css          | Splash screen animation                           | ~90   |
| dashboard-predictor.css | Placement predictor card styles                   | ~134  |
| premium.css             | Premium effects for public pages                  | ~280  |
| mous.css                | MOU page specific styles                          | ~200  |

### 10.3 JavaScript Architecture

| Script                | Purpose                                                         | Size   |
| --------------------- | --------------------------------------------------------------- | ------ |
| api.js                | Centralized API client (GET, POST, PUT, PATCH, DELETE)          | 3.2 KB |
| auth.js               | Authentication functions (login, register, logout, protectPage) | 3.0 KB |
| student-dashboard.js  | Student dashboard logic, job rendering, applications            | 32 KB  |
| student-features.js   | Advanced features (pomodoro, goals, quiz, resume, calendar)     | 30 KB  |
| admin-dashboard.js    | Admin CRUD operations for all entities                          | 23 KB  |
| admin-features.js     | Admin analytics, deep insights, activity log                    | 16 KB  |
| charts.js             | Chart.js integration for dashboard analytics                    | 4.8 KB |
| pwa.js                | Service worker registration and install banner                  | 2.2 KB |
| micro-interactions.js | Hover effects, parallax, toast animations                       | 9.8 KB |

---

## 11. API DOCUMENTATION

### 11.1 Base URL

```
Production: https://tnpc-backend.onrender.com/api
Development: http://localhost:5000/api
```

### 11.2 Authentication Endpoints

| Method | Endpoint                 | Auth | Description                |
| ------ | ------------------------ | ---- | -------------------------- |
| POST   | /register                | No   | Register new student       |
| POST   | /verify-registration-otp | No   | Verify email with OTP      |
| POST   | /resend-otp              | No   | Resend OTP email           |
| POST   | /login                   | No   | Login and receive JWT      |
| POST   | /forgot-password         | No   | Request password reset OTP |
| POST   | /verify-reset-otp        | No   | Verify reset OTP           |
| POST   | /reset-password          | No   | Set new password           |
| GET    | /profile                 | JWT  | Get current user profile   |
| PUT    | /profile                 | JWT  | Update user profile        |

### 11.3 Job Endpoints

| Method | Endpoint  | Auth  | Description                           |
| ------ | --------- | ----- | ------------------------------------- |
| GET    | /jobs     | No    | List all jobs (paginated, filterable) |
| GET    | /jobs/:id | No    | Get single job details                |
| POST   | /jobs     | Admin | Create a new job posting              |
| PUT    | /jobs/:id | Admin | Update a job posting                  |
| DELETE | /jobs/:id | Admin | Delete a job posting                  |

### 11.4 Application Endpoints

| Method | Endpoint          | Auth  | Description                     |
| ------ | ----------------- | ----- | ------------------------------- |
| POST   | /applications     | JWT   | Apply to a job                  |
| GET    | /applications     | Admin | List all applications           |
| GET    | /applications/my  | JWT   | Get current user's applications |
| PATCH  | /applications/:id | Admin | Update application status       |
| DELETE | /applications/:id | JWT   | Withdraw pending application    |

### 11.5 Other Endpoints

| Method | Endpoint                | Auth  | Description              |
| ------ | ----------------------- | ----- | ------------------------ |
| GET    | /placements             | No    | List placement records   |
| POST   | /placements             | Admin | Add placement record     |
| PUT    | /placements/:id         | Admin | Update placement record  |
| DELETE | /placements/:id         | Admin | Delete placement record  |
| GET    | /trainings              | JWT   | List training programs   |
| POST   | /trainings              | Admin | Add training program     |
| DELETE | /trainings/:id          | Admin | Delete training          |
| GET    | /certifications         | No    | List certifications      |
| POST   | /certifications         | Admin | Add certification        |
| DELETE | /certifications/:id     | Admin | Delete certification     |
| GET    | /notifications          | JWT   | Get user's notifications |
| POST   | /notifications          | Admin | Create announcement      |
| PATCH  | /notifications/:id/read | JWT   | Mark as read             |
| GET    | /corporates             | No    | List corporate partners  |
| POST   | /corporates             | Admin | Add corporate partner    |
| DELETE | /corporates/:id         | Admin | Delete corporate         |

---

## 12. SECURITY IMPLEMENTATION

### 12.1 Security Measures

| Measure                    | Implementation                          | Purpose                                               |
| -------------------------- | --------------------------------------- | ----------------------------------------------------- |
| **Password Hashing**       | bcryptjs with salt rounds               | Prevents plain-text password storage                  |
| **JWT Authentication**     | jsonwebtoken with secret key            | Stateless session management                          |
| **OTP Email Verification** | 6-digit OTP via Nodemailer              | Prevents fake account registration                    |
| **Helmet**                 | helmet npm package                      | Sets secure HTTP headers (XSS protection, HSTS, etc.) |
| **Rate Limiting**          | express-rate-limit (200 req/15 min)     | Prevents brute-force and DDoS attacks                 |
| **CORS**                   | Whitelisted origins                     | Prevents unauthorized cross-origin requests           |
| **Input Validation**       | Mongoose schema validators              | Prevents malformed data entry                         |
| **XSS Sanitization**       | HTML entity escaping on frontend        | Prevents script injection via user input              |
| **Role-Based Access**      | adminMiddleware on protected routes     | Restricts admin operations to admin users             |
| **Token Expiry**           | JWT expiration + frontend auto-redirect | Prevents stale session attacks                        |

### 12.2 Authentication Flow

```
1. User enters email + password
2. POST /api/register → Server generates OTP, sends via email
3. User enters OTP → POST /api/verify-registration-otp
4. Account verified → User can now login
5. POST /api/login → Server verifies password with bcrypt
6. Server generates JWT token → Returns to client
7. Client stores JWT in localStorage
8. All subsequent API calls include: Authorization: Bearer <token>
9. authMiddleware verifies JWT on every protected route
10. If token expired/invalid → 401 response → Client redirects to login
```

---

## 13. PROGRESSIVE WEB APP (PWA)

### 13.1 PWA Features

| Feature              | Implementation                                  |
| -------------------- | ----------------------------------------------- |
| **Service Worker**   | sw.js — Caches static assets for offline access |
| **Web Manifest**     | manifest.json — App name, icons, theme color    |
| **Install Banner**   | Custom install prompt with pwa.js               |
| **Offline Support**  | Stale-while-revalidate caching strategy         |
| **Home Screen Icon** | 192px and 512px icons configured                |
| **Splash Screen**    | Custom animated splash with logo, progress bar  |

### 13.2 Service Worker Caching Strategy

```
Cache Name: tnpc-portal-v6
Strategy: Cache First for static assets, Network First for API calls
Cached Assets: HTML pages, CSS files, JS files, logo images
```

---

## 14. DEPLOYMENT ARCHITECTURE

### 14.1 Frontend Deployment (Vercel)

```
GitHub Repository → Push to main branch
    ↓
Vercel Auto-Deploy (CI/CD)
    ↓
Global CDN Distribution
    ↓
https://tnpc-portal.vercel.app
```

### 14.2 Backend Deployment (Render)

```
GitHub Repository → Push to main branch
    ↓
Render Auto-Deploy (CI/CD)
    ↓
Node.js server started on Render cloud
    ↓
https://tnpc-backend.onrender.com
    ↓
Connected to MongoDB Atlas (AWS)
```

### 14.3 Environment Variables

| Variable     | Purpose                            |
| ------------ | ---------------------------------- |
| MONGO_URI    | MongoDB Atlas connection string    |
| JWT_SECRET   | Secret key for JWT signing         |
| EMAIL_USER   | SMTP email address for OTP sending |
| EMAIL_PASS   | App-specific password for email    |
| PORT         | Server port (default: 5000)        |
| CORS_ORIGINS | Allowed frontend origins           |

---

## 15. TESTING AND VALIDATION

### 15.1 Testing Performed

| Test Type                  | Description                                                                                      | Result  |
| -------------------------- | ------------------------------------------------------------------------------------------------ | ------- |
| **Functional Testing**     | All CRUD operations for jobs, applications, placements, trainings, certifications, announcements | ✅ Pass |
| **Authentication Testing** | Register, OTP verify, login, logout, forgot password, token expiry                               | ✅ Pass |
| **Authorization Testing**  | Admin-only routes reject student JWT tokens                                                      | ✅ Pass |
| **Input Validation**       | Invalid email, short password, empty fields properly rejected                                    | ✅ Pass |
| **Responsive Testing**     | Tested on mobile (360px), tablet (768px), desktop (1920px)                                       | ✅ Pass |
| **Cross-Browser Testing**  | Chrome, Firefox, Edge, Safari                                                                    | ✅ Pass |
| **PWA Testing**            | Service worker registration, install prompt, offline caching                                     | ✅ Pass |
| **Performance Testing**    | Lighthouse audit, lazy loading, .lean() Mongoose optimization                                    | ✅ Pass |
| **Security Testing**       | XSS prevention, rate limiting, JWT validation, CORS enforcement                                  | ✅ Pass |

---

## 16. SCREENSHOTS DESCRIPTION

The following screenshots can be captured from the live application at https://tnpc-portal.vercel.app:

1. **Home Page** — Landing page with hero section, animated statistics, and recruiter carousel
2. **Registration Page** — Student sign-up form with email and password fields
3. **OTP Verification** — OTP input screen after registration
4. **Login Page** — Email and password login screen
5. **Student Dashboard — Overview** — Profile completion, CGPA, eligibility status, stat counters
6. **Student Dashboard — Job Browser** — Job cards with search, filter, bookmark, and apply buttons
7. **Student Dashboard — Application Tracker** — Status pills showing pending/shortlisted/accepted/rejected
8. **Student Dashboard — Resume Builder** — Auto-generated resume from profile data
9. **Admin Dashboard — Analytics** — Doughnut and line charts showing placement data
10. **Admin Dashboard — Student Management** — Student list with filters
11. **Admin Dashboard — Job Posting** — Form to add new job listings
12. **Admin Dashboard — Application Management** — Application list with status update dropdown
13. **Placements Page** — Year-wise placement statistics
14. **MOU Page** — Corporate partnership logos and details
15. **Mobile View** — Responsive mobile layout with bottom navigation

---

## 17. FUTURE ENHANCEMENTS

1. **AI-Powered Job Recommendations** — Machine learning to suggest jobs based on student profile
2. **Live Chat** — Real-time messaging between students and placement officers
3. **Video Interview Integration** — Built-in video interview scheduling with Google Meet/Zoom
4. **Company Portal** — Dedicated login for recruiters to post jobs and shortlist candidates
5. **Alumni Network** — Connect placed students with current students for mentorship
6. **Automated Eligibility Check** — Auto-filter students based on CGPA, backlogs, and skills
7. **Email Notifications** — Automated email alerts for new job postings and status updates
8. **Multi-Language Support** — Telugu and Hindi language options
9. **Mobile App** — Native React Native or Flutter mobile application
10. **Blockchain Certificates** — Tamper-proof digital certificate verification

---

## 18. CONCLUSION

The TNPC Portal successfully addresses the challenges of manual placement management at Sri GCSR College by providing a modern, digital, and comprehensive web-based solution. The application demonstrates proficiency in full-stack web development — from database design and REST API architecture to responsive frontend design and cloud deployment. The use of modern technologies such as Express.js 5, Mongoose 9, JWT authentication, PWA architecture, and glassmorphism UI design ensures that the portal meets current industry standards and provides an excellent user experience. The system is currently live and accessible at https://tnpc-portal.vercel.app and is being actively used by the Training & Placement Cell.

---

## 19. REFERENCES

1. Mozilla Developer Network (MDN) — Web Technologies Documentation — https://developer.mozilla.org
2. Express.js Official Documentation — https://expressjs.com
3. MongoDB Documentation — https://docs.mongodb.com
4. Mongoose ODM Documentation — https://mongoosejs.com
5. JSON Web Tokens (JWT) — https://jwt.io
6. Vercel Deployment Guide — https://vercel.com/docs
7. Render Deployment Guide — https://render.com/docs
8. Chart.js Documentation — https://www.chartjs.org
9. Web.dev — Progressive Web Apps — https://web.dev/progressive-web-apps
10. OWASP Security Practices — https://owasp.org

---

**© 2026 Sri GCSR College of Engineering & Technology, Rajam. All Rights Reserved.**
