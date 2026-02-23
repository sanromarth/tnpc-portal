# TNPC PORTAL — Project File Structure

## Complete Directory Tree

```
CODEGENS_TNPC_PORTAL/
│
├── README.md                           # Project overview and setup guide
├── package.json                        # Root package config
│
├── backend/                            # Node.js + Express.js REST API
│   ├── server.js                       # Main server entry point (Express app setup)
│   ├── createAdmin.js                  # Script to seed admin user
│   ├── verify.js                       # Token verification utility
│   ├── .env                            # Environment variables (secrets)
│   │
│   ├── config/
│   │   └── db.js                       # MongoDB Atlas connection setup
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT token verification middleware
│   │   └── adminMiddleware.js          # Admin role authorization middleware
│   │
│   ├── models/                         # Mongoose schemas (8 models)
│   │   ├── user.js                     # User model (student + admin)
│   │   ├── Job.js                      # Job posting model
│   │   ├── Application.js             # Job application model
│   │   ├── Placement.js               # Year-wise placement statistics
│   │   ├── Training.js                # Training program model
│   │   ├── certification.js           # Certification record model
│   │   ├── Notification.js            # Announcement/notification model
│   │   └── Corporate.js              # Corporate partnership model
│   │
│   ├── routes/                         # Express route handlers (8 modules)
│   │   ├── authRoutes.js              # Auth, profile, student management (20+ endpoints)
│   │   ├── jobRoutes.js               # Job CRUD with pagination and auto-expiry
│   │   ├── applicationRouter.js       # Application submit, track, status update
│   │   ├── placementRoutes.js         # Placement record CRUD
│   │   ├── trainingRoutes.js          # Training program CRUD
│   │   ├── certificationRoutes.js     # Certification record CRUD
│   │   ├── notificationRoutes.js      # Notification CRUD with read tracking
│   │   └── corporateRoutes.js         # Corporate partner CRUD
│   │
│   ├── utils/
│   │   └── otp.js                     # OTP generation + Nodemailer email sender
│   │
│   └── package.json                   # Backend dependencies
│
├── frontend/                           # Static HTML/CSS/JS frontend
│   ├── manifest.json                  # PWA manifest (app name, icons, theme)
│   ├── sw.js                          # Service worker (caching, offline support)
│   │
│   ├── index.html                     # Landing/home page
│   ├── about.html                     # About the college page
│   ├── placements.html               # Placement statistics page
│   ├── certifications.html           # IBM certifications page
│   ├── mous.html                     # MOU partnerships page
│   ├── contact.html                  # Contact information page
│   ├── recruiter.html                # Recruiter information page
│   ├── login.html                    # User login page
│   ├── register.html                 # Student registration page
│   ├── forgot-password.html          # Password reset page
│   ├── admin-dashboard.html          # Admin control panel (single-page app)
│   ├── student-dashboard.html        # Student portal (single-page app)
│   ├── admin-placement.html          # Admin placement editor
│   │
│   ├── css/                           # Stylesheets (13 files)
│   │   ├── style.css                 # Global styles, navbar, footer (~1400 lines)
│   │   ├── dashboard.css             # Dashboard base layout (~300 lines)
│   │   ├── premium-dashboard.css     # Premium glassmorphism effects (~300 lines)
│   │   ├── responsive.css            # Mobile/tablet media queries (~200 lines)
│   │   ├── app-loader.css            # Splash screen animation (~90 lines)
│   │   ├── dashboard-predictor.css   # Placement predictor styles (~134 lines)
│   │   ├── premium.css               # Premium public page effects (~280 lines)
│   │   ├── mous.css                  # MOU page styles (~200 lines)
│   │   ├── placements.css            # Placement page styles
│   │   ├── certifications.css        # Certification page styles
│   │   └── [others]                  # Additional stylesheets
│   │
│   ├── js/                            # JavaScript files (20 files)
│   │   ├── api.js                    # Centralized API client (fetch wrapper)
│   │   ├── auth.js                   # Login, register, logout, page protection
│   │   ├── login.js                  # Login page logic
│   │   ├── register.js               # Registration page logic
│   │   ├── forgot-password.js        # Password reset logic
│   │   ├── admin-dashboard.js        # Admin CRUD operations (~23 KB)
│   │   ├── admin-features.js         # Admin analytics, deep insights (~16 KB)
│   │   ├── student-dashboard.js      # Student dashboard logic (~32 KB)
│   │   ├── student-features.js       # Pomodoro, goals, quiz, resume (~30 KB)
│   │   ├── charts.js                 # Chart.js dashboard charts
│   │   ├── pwa.js                    # PWA install banner + SW registration
│   │   ├── app-loader.js            # Splash screen controller
│   │   ├── main.js                   # Navigation, scroll effects
│   │   ├── micro-interactions.js     # Hover effects, animations
│   │   ├── counter.js                # Animated number counters
│   │   ├── data.js                   # Static data and API helpers
│   │   ├── animations.js            # CSS animation triggers
│   │   ├── placements.js            # Placement page logic
│   │   ├── certifications.js        # Certification page logic
│   │   └── admin-placement.js       # Admin placement edit logic
│   │
│   └── assets/                        # Static assets
│       ├── logos/                     # College and partner logos
│       │   ├── sgcsr-logo.png       # Main college logo
│       │   ├── gmr-logo.png         # GMR Group logo
│       │   └── [partner logos]      # ABS, WNS, IBM, TCS iON, etc.
│       ├── images/
│       │   └── recruiters/          # Recruiter company logos
│       └── icons/                   # PWA icons (192px, 512px)
│
└── documentation/                     # Project documentation (this folder)
    ├── PROJECT_DOCUMENTATION.md      # Main comprehensive documentation
    └── PROJECT_STRUCTURE.md          # This file structure document
```

## File Count Summary

| Category               | Count  | Total Size  |
| ---------------------- | ------ | ----------- |
| Backend JS files       | 15     | ~90 KB      |
| Frontend HTML pages    | 13     | ~190 KB     |
| Frontend CSS files     | 13     | ~55 KB      |
| Frontend JS files      | 20     | ~155 KB     |
| Configuration files    | 5      | ~60 KB      |
| **Total source files** | **66** | **~550 KB** |

## Lines of Code Estimate

| Component        | Approximate Lines |
| ---------------- | ----------------- |
| Backend (all JS) | ~1,800 lines      |
| Frontend HTML    | ~3,500 lines      |
| Frontend CSS     | ~3,200 lines      |
| Frontend JS      | ~4,500 lines      |
| **Total**        | **~13,000 lines** |
