# CampusHire — REST API Documentation

CampusHire exposes a structured RESTful API adhering to standard HTTP semantics, JWT bearer authorization, and JSON payloads.

Base URL: `http://localhost:4000/api`

---

## 1. Authentication Endpoints

### `POST /auth/register`
Creates a new student account and associated student profile.
- **Payload**:
  ```json
  {
    "email": "student@campushire.edu",
    "password": "Password@123",
    "first_name": "Rohan",
    "last_name": "Deshmukh",
    "roll_number": "2023CSE089",
    "department_id": 1,
    "batch_year": 2026,
    "cgpa": 8.75,
    "phone": "+91 9876543210"
  }
  ```
- **Response `201 Created`**:
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "token": "eyJhbGciOi...",
    "user": { "id": 13, "email": "student@campushire.edu", "role": "student" }
  }
  ```

### `POST /auth/login`
Authenticates user and issues JWT.
- **Payload**:
  ```json
  { "email": "admin@campushire.edu", "password": "Admin@123" }
  ```
- **Response `200 OK`**:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": 1, "email": "admin@campushire.edu", "role": "admin" }
  }
  ```

### `GET /auth/me`
Retrieves authenticated user profile. Headers: `Authorization: Bearer <token>`.

---

## 2. Internships Endpoints

### `GET /internships`
Returns paginated list of role postings with filtering.
- **Query Parameters**:
  - `search`: Keyword search matching title, description, or company name.
  - `industry_id`: Integer filter.
  - `work_mode`: `On-site` | `Remote` | `Hybrid`.
  - `min_stipend`: Numeric lower bound.
  - `skill_id`: Skill ID filter.
  - `page`: Page index (default: 1).
  - `limit`: Items per page (default: 10).

### `GET /internships/:id`
Retrieves comprehensive details for an internship posting including company profile, required skills, and applicant statistics.

### `POST /internships` (Admin / Recruiter)
Creates a new internship posting with required skills.

### `PUT /internships/:id` (Admin / Recruiter)
Updates an existing internship posting.

### `DELETE /internships/:id` (Admin)
Removes an internship posting.

---

## 3. Application Workflow Endpoints

### `POST /internships/:id/apply` (Student)
Submits an application for the specified role posting. Validates deadline, active status, and enforces non-duplication.
- **Payload**:
  ```json
  {
    "cover_letter": "I have extensive experience with React and SQL...",
    "resume_url": "https://campushire.edu/resumes/myresume.pdf"
  }
  ```

### `GET /applications`
Retrieves applications list.
- **For Student**: Retrieves student's own submissions.
- **For Admin**: Retrieves all applications across university with status and student filters.

### `PATCH /applications/:id/status` (Admin / Recruiter)
Transitions application status (`Under Review`, `Shortlisted`, `Interview Scheduled`, `Rejected`, `Offered`).

---

## 4. Interviews & Offers Endpoints

### `POST /interviews` (Admin / Recruiter)
Schedules an interview round for a shortlisted candidate.

### `PATCH /interviews/:id/result` (Admin / Recruiter)
Records interview completion result (`Passed` / `Failed`), rating (1-5), and feedback.

### `POST /offers` (Admin / Recruiter)
Generates an official recruitment offer for a selected candidate.

### `PATCH /offers/:id/respond` (Student)
Student accepts or rejects an offer:
- **Payload**: `{ "action": "accept" }` or `{ "action": "reject" }`.
- Accepting atomically creates an `internship_records` entry.

---

## 5. Analytics Endpoints

### `GET /analytics/overview` (Admin)
Returns high-level placement KPIs: total students, placed count, placement rate %, active recruiters, open roles.

### `GET /analytics/departments` (Admin)
Returns departmental breakdown of applications and placement success.

### `GET /analytics/top-skills` (Admin)
Returns most demanded competencies in current internship postings.

### `GET /analytics/companies` (Admin)
Returns top hiring companies and conversion rates.
