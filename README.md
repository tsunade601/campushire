# CampusHire — Student Internship & Recruitment Management System

> **DBMS Academic Capstone Project**  
> A relational, 3NF-normalized university recruitment and internship lifecycle management system engineered with MySQL 8.0, Node.js/Express REST APIs, and a modern reactive React/Vite user interface.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Problem Statement & Objectives](#2-problem-statement--objectives)
3. [Core Features](#3-core-features)
4. [Technology Stack](#4-technology-stack)
5. [System Architecture](#5-system-architecture)
6. [Entity-Relationship (ER) Diagram](#6-entity-relationship-er-diagram)
7. [Database Schema Overview](#7-database-schema-overview)
8. [Relational Table Descriptions](#8-relational-table-descriptions)
9. [Dataset Sources & Ingestion Pipeline](#9-dataset-sources--ingestion-pipeline)
10. [Synthetic Data-Generation Methodology](#10-synthetic-data-generation-methodology)
11. [REST API Overview](#11-rest-api-overview)
12. [Installation & Local Setup](#12-installation--local-setup)
13. [Environment Variables](#13-environment-variables)
14. [Docker Compose Deployment](#14-docker-compose-deployment)
15. [How to Run & Verify](#15-how-to-run--verify)
16. [Demo User Credentials](#16-demo-user-credentials)
17. [Example SQL Queries (20 Canonical DBMS Queries)](#17-example-sql-queries-20-canonical-dbms-queries)
18. [UI Screenshots & Design System](#18-ui-screenshots--design-system)
19. [Security, Integrity & ACID Transactions](#19-security-integrity--acid-transactions)
20. [Future Enhancements](#20-future-enhancements)

---

## 1. Project Overview
**CampusHire** is a realistic, production-grade Database Management System (DBMS) project designed for college and university career offices. It models and enforces the complete campus placement lifecycle: student profiles, education and skill sets, company hiring drives, transactional role applications, multi-round technical interviews, formal recruitment offers, ongoing internship monitoring, and mentor appraisals with Pre-Placement Offer (PPO) recommendations.

---

## 2. Problem Statement & Objectives
Campus placement processes frequently suffer from uncoordinated spreadsheets, duplicate applications, untracked interview schedules, and lack of verified data integrity.
**Objectives:**
- **Relational Integrity**: Enforce strict Third Normal Form (3NF) relational schema with zero comma-separated values, eliminating anomalies.
- **Transactional Consistency**: Execute atomic state transitions (e.g. accepting an offer atomically generates an active internship record while updating offer and application states).
- **Business Rule Enforcement**: Declaratively prevent duplicate applications, invalid CGPAs, and post-deadline submissions.
- **Reporting & Analytics**: Provide real-time reporting via 6 database views and 20 evaluation queries.

---

## 3. Core Features

### A. Student Features
- Registration with roll number, department, CGPA bounds, and JWT authentication.
- Profile and education management.
- Normalized skills catalog with 4 proficiency levels (`Beginner`, `Intermediate`, `Advanced`, `Expert`).
- Advanced multi-criteria search & filtering (work mode, stipend, industry, location, deadline, required skills).
- Atomic 1-click application submission with duplicate detection.
- Application status tracker (`Applied`, `Under Review`, `Shortlisted`, `Interview Scheduled`, `Offered`, `Accepted`, `Declined`).
- Scheduled interview viewer with date/time, link, round type, and interviewer ratings.
- Offer letter viewer with Accept/Decline action buttons.
- Internship history with supervisor ratings and PPO recommendations.

### B. Placement Cell (Admin) Features
- Executive KPI dashboard (placement rate, placed count, partner companies, average stipend).
- Master student roster with CGPA sorting and department filtering.
- Corporate recruiter directory with posting statistics.
- Internship posting manager with active/closed state toggles and deadline extensions.
- Centralized applications queue with status advancement.
- Interview coordinator (scheduling online/in-person rounds and recording ratings).
- Formal offer generator (stipend, validity date, joining terms).
- Tracked internship records and performance evaluation recorder.
- Interactive DBMS analytics runner executing the 20 canonical queries.

### C. Recruiter Features
- Role posting management.
- Applicant reviews with student skill matching.
- Scheduled interview tracking.

---

## 4. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS with custom animations, React Router v6, Lucide icons, native interactive SVG charts.
- **Backend**: Node.js, Express.js, JWT bearer security, bcrypt password hashing, express-validator, parameter-bound SQL queries.
- **Database**: MySQL 8.0+ InnoDB engine, 3NF schema, ACID transactions, foreign keys, CHECK constraints, composite indexes, 6 reporting views.
- **DevOps**: Docker, Docker Compose multi-container configuration with healthchecks.

---

## 5. System Architecture
Strict 3-tier architecture:

```
[ Browser / Client ]
       │
       ▼  (HTTP REST / JSON / JWT)
[ Express API Server (Port 4000) ]
       │
       ▼  (SQL Protocol / Parameterized Queries)
[ MySQL 8.0 Database (Port 3306) ]
```

![Architecture Diagram](docs/architecture.svg)

---

## 6. Entity-Relationship (ER) Diagram

![ER Diagram](docs/er-diagram.svg)

---

## 7. Database Schema Overview
The database comprises **14 normalized tables**:
1. `users` — System accounts and roles (`student`, `admin`, `company`).
2. `departments` — Academic departments (CSE, IT, ECE, etc.).
3. `industries` — Corporate business sectors.
4. `companies` — Approved hiring partners.
5. `skills` — Standardized taxonomy of technical and soft competencies.
6. `students` — Profiles with roll number, department, and CGPA (0.00-10.00).
7. `student_skills` — M:N junction table mapping student proficiencies.
8. `internships` — Job postings with stipend, duration, openings, and deadlines.
9. `internship_skills` — M:N junction mapping required vs optional competencies.
10. `applications` — Transactional applications with unique `(student_id, internship_id)`.
11. `interviews` — Selection rounds with ratings (1-5) and feedback.
12. `offers` — Recruitment offers with stipend, joining date, and deadlines.
13. `internship_records` — Tracked ongoing/completed placements.
14. `evaluations` — Performance appraisals and PPO recommendations.

---

## 8. Relational Table Descriptions
Detailed specifications of attributes, keys, and constraints are documented in [docs/database-design.md](docs/database-design.md).

---

## 9. Dataset Sources & Ingestion Pipeline
CampusHire uses a hybrid strategy:
1. **Public Raw Sources**: Sample jobs and company data stored in `data/raw/sample_jobs.csv`.
2. **Cleansing Pipeline**: `scripts/clean_data.py` cleans whitespace, parses stipends, and produces normalized output in `data/processed/cleaned_internships.csv`.
3. **Database Ingestion**: Handled by MySQL init scripts or `scripts/import_data.py`.

---

## 10. Synthetic Data-Generation Methodology
To provide realistic volume without fabricating claims of real personal data, `scripts/generate_data.py` generates relationally consistent records using Python and seed `601`:
- 2,000 students across 20 departments.
- 200 companies across 10 industries.
- 500 internship opportunities.
- 150 categorized skills.
- 8,000 applications with downstream interviews, offers, and evaluations.

---

## 11. REST API Overview
Comprehensive OpenAPI specifications are available in [docs/api-documentation.md](docs/api-documentation.md).
- `POST /api/auth/register` — Register student account
- `POST /api/auth/login` — Authenticate and retrieve JWT
- `GET /api/internships` — Discover role postings with multi-variable filters
- `POST /api/internships/:id/apply` — Submit application
- `GET /api/applications` — Retrieve applications queue
- `POST /api/interviews` — Schedule interview round
- `POST /api/offers` — Generate recruitment offer
- `PATCH /api/offers/:id/respond` — Accept or decline offer
- `GET /api/analytics/overview` — Fetch executive recruitment KPIs

---

## 12. Installation & Local Setup

### Prerequisites
- Node.js >= 18.0.0
- MySQL Server 8.0+
- Python 3.9+

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/tsunade601/campushire.git
   cd campushire
   ```
2. Set up environment variables:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```
3. Initialize the MySQL database:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/seed.sql
   mysql -u root -p < database/views.sql
   ```
4. Install dependencies:
   ```bash
   npm run install:all
   ```
5. Start development servers:
   ```bash
   npm run dev
   ```
   - API runs on `http://localhost:4000`
   - Frontend runs on `http://localhost:5173`

---

## 13. Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Backend server port | `4000` |
| `DB_HOST` | MySQL host address | `localhost` |
| `DB_PORT` | MySQL connection port | `3306` |
| `DB_USER` | MySQL username | `campushire_user` |
| `DB_PASSWORD` | MySQL password | `campushire_password` |
| `DB_NAME` | Relational database name | `campushire` |
| `JWT_SECRET` | Secret key for token signing | `super_secret_jwt_key` |

---

## 14. Docker Compose Deployment
Run the complete application stack (MySQL + Backend + Frontend) in one command:

```bash
docker compose up --build
```
- Open `http://localhost:5173` in your browser.
- MySQL initializes `schema.sql`, `seed.sql`, and `views.sql` automatically.
- To reset the volume and reseed:
  ```bash
  docker compose down -v && docker compose up --build
  ```

---

## 15. How to Run & Verify
1. Navigate to `http://localhost:5173`.
2. Click **One-Click Demo Accounts** on the login page to sign in as **Admin**, **Student**, or **Recruiter**.
3. In the student portal, explore open roles, apply with a cover letter, and inspect the application tracker.
4. In the admin portal, open the **Analytics & 20 Queries** tab to execute and verify the DBMS queries.

---

## 16. Demo User Credentials

| Role | Email Address | Password | Persona Details |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@campushire.edu` | `Admin@123` | Placement Cell Director |
| **Student** | `alex.chen@campushire.edu` | `Student@123` | Alex Chen (CSE, CGPA: 9.42) |
| **Student** | `priya.sharma@campushire.edu` | `Student@123` | Priya Sharma (IT, CGPA: 8.95) |
| **Recruiter**| `recruiter@google.com` | `Company@123` | Google Cloud India Recruiter |

*(Or register a new student account using the registration screen).*

---

## 17. Example SQL Queries (20 Canonical DBMS Queries)
All 20 queries are defined in `database/queries.sql` and executable from the Admin Analytics page:
1. Top companies by number of applications
2. Top students by number of applications
3. Internship count by industry
4. Application-to-offer conversion rate by company
5. Most demanded skills
6. Average stipend by industry
7. Average stipend by location
8. Students with no applications (anti-join)
9. Internships nearing deadline (`DATEDIFF`)
10. Students with accepted offers (5-table join)
11. Companies with highest offer rate
12. Applications waiting for decisions
13. Interview success rate by round type
14. Department-wise application statistics
15. Department-wise offer statistics
16. Most popular internship locations
17. Average number of applications per internship
18. Students whose skills match internship requirements
19. Internship completion statistics
20. Average evaluation score by company

---

## 18. UI Screenshots & Design System
- **Design System**: Slate/Navy glassmorphism (`bg-slate-900/80 backdrop-blur-md`), sky brand accents, animated stat cards, native SVG charts.
- **Transitions**: Smooth slide-ups, modal fade-ins, badge pulses, and responsive layout drawers.

---

## 19. Security, Integrity & ACID Transactions
- Passwords hashed using bcrypt.
- JWT bearer tokens with expiration.
- SQL injection prevention via parameterized prepared statements (`mysql2`).
- Relational integrity: duplicate applications prevented via `UNIQUE(student_id, internship_id)`.
- ACID transaction locks during offer acceptance ensuring atomic record creation.

---

## 20. Future Enhancements
- Resume PDF parsing and text indexing.
- Real-time WebSocket alerts for interview notifications.
- Integrated video calling SDK for in-browser interview rounds.
