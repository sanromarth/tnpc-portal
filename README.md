# 🎓 TNPC Placement Intelligence Portal

### Sri GCSR College – Training & Placement Cell

An enterprise-grade full-stack Placement Management & Analytics System designed for institutional-level operations.

---

# 🌍 Live System Overview

TNPC Portal is a centralized digital platform that:

✔ Manages campus recruitment lifecycle  
✔ Tracks student job applications  
✔ Stores historical & modern placement data  
✔ Provides dynamic placement analytics dashboard  
✔ Enables role-based secure access  
✔ Supports scalable future expansion  
✔ Premium Glassmorphism UI with Micro-animations

---

# 🏗 Architecture Overview

## System Flow

Frontend (HTML/CSS/JS)
↓
Express.js REST API
↓
MongoDB Atlas (Cloud Database)
↓
JWT Authentication Layer
↓
Role-Based Access Control

---

# 🧱 Technology Stack

| Layer       | Technology Used                                        |
| ----------- | ------------------------------------------------------ |
| Frontend    | HTML5, CSS3, JavaScript, Glassmorphism, CSS Animations |
| Charts      | Chart.js                                               |
| Backend     | Node.js, Express.js                                    |
| Database    | MongoDB Atlas                                          |
| Auth        | JWT (JSON Web Token)                                   |
| Dev Hosting | DevTunnel                                              |
| Versioning  | Git                                                    |

---

# 🔐 Security Model

Authentication System:

- JWT-based token authentication
- Authorization header validation
- Protected admin routes
- Middleware-driven verification

Roles:

- Admin
- Student

Admin Privileges:

- Manage placements (CRUD)
- Manage jobs
- View applications
- Add new batch data

Student Privileges:

- View jobs
- Apply to jobs
- Track personal applications

---

# 📊 Placement Data Architecture

Single scalable collection: `placements`

Supports:

- Historical simple data (year + placements)
- Modern detailed analytics data
- Future year expansions
- Sorted by `yearOrder`

Example:

```json
{
  "batch": "2024-25",
  "yearOrder": 2024,
  "totalStudents": 357,
  "eligibleStudents": 235,
  "placementsOffered": 258,
  "distinctOffers": 185,
  "companiesVisited": 38,
  "highestCTC": 6.18,
  "avgCTC": 2.68,
  "percentage": 79
}
```

---

# 📂 Project Structure

```
backend/
│
├── middleware/
│   └── authMiddleware.js
│
├── models/
│   ├── user.js
│   ├── Job.js
│   ├── Application.js
│   └── Placement.js
│
├── routes/
│   ├── authRoutes.js
│   ├── jobRoutes.js
│   ├── applicationRouter.js
│   └── placementRoutes.js
│
├── server.js
├── .env
└── package.json

frontend/
│
├── assets/
│   └── (Images, Icons)
│
├── css/
│   ├── style.css
│   ├── dashboard.css
│   └── (Other Stylesheets)
│
├── js/
│   ├── script.js
│   ├── auth.js
│   └── (Other Scripts)
│
├── index.html
├── login.html
├── register.html
└── (Other HTML Pages)
```

---

# 🌐 REST API Documentation

## Authentication

POST /api/register
POST /api/login

---

## Jobs

GET /api/jobs
POST /api/jobs (Admin)
PUT /api/jobs/:id (Admin)
DELETE /api/jobs/:id (Admin)

---

## Applications

POST /api/applications
GET /api/applications/my
GET /api/applications (Admin)

---

## Placements

GET /api/placements
POST /api/placements (Admin)
PUT /api/placements/:id (Admin)
DELETE /api/placements/:id (Admin)

---

# 📈 Analytics Features

The portal dynamically renders:

✔ Year-wise Placement Growth Trend
✔ Salary Growth Trend (Highest vs Average CTC)
✔ Placement Percentage Trend
✔ KPI Summary Cards
✔ Historical + Modern Data Comparison

No hardcoded frontend values.
All analytics are database-driven.

---

# ⚙ Installation Guide

1. Clone repository

```
git clone <repository-url>
cd backend
```

2. Install dependencies

```
npm install
```

3. Create .env file

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

4. Run server

```
npm start
```

Server:
[http://localhost:5000](http://localhost:5000)

5. Run Frontend

Open `frontend/index.html` in your browser or use a local server (e.g., Live Server in VS Code).

---

# 🧠 Design Philosophy

This system is built using:

- Modular architecture
- Clean separation of concerns
- Scalable database schema
- Secure authentication middleware
- Future-ready deployment model

---

# 🚀 Production Scalability

Ready for:

- Cloud VPS Deployment
- Dockerization
- CI/CD Integration
- Domain Hosting
- SSL Configuration
- Institutional Deployment

---

# 🔮 Future Roadmap

- Department-wise analytics
- Export placement report (PDF)
- Recruiter management module
- Email notification integration
- Admin analytics dashboard
- Real-time updates

---

# 🏫 Institutional Contact

Sri GCSR College
Training & Placement Cell
Rajam, Vizianagaram District
Andhra Pradesh - 532127

TPO: Visweswara Rao Ch
Email: [placements@srigcsrcollege.org](mailto:placements@srigcsrcollege.org), [principal@srigcsrcollege.org](mailto:principal@srigcsrcollege.org)
Phone: 86399 18230, 08941-251336

---

# 👨‍💻 Developer

CODEGENE'S 1.0
Full Stack Developer
TNPC Portal System
