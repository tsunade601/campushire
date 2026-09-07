# CampusHire — Database Design & DBMS Architecture Specification

## 1. Problem Definition & Objectives
University recruitment processes involve multi-stakeholder interactions among students, academic departments, corporate recruiters, and the placement office. In traditional or non-DBMS systems, unstructured spreadsheets and ad-hoc emails cause:
1. Duplicate and invalid applications.
2. Inconsistent lifecycle tracking (e.g. scheduling interviews for unapplied candidates or issuing offers without interviews).
3. Data redundancy (e.g. repeating company information in every job posting).
4. Inability to perform atomic state transitions (e.g. accepting an offer must atomically create an active internship record).

**CampusHire** solves these challenges using a relational **MySQL 8.0+** database designed with strict Third Normal Form (3NF) principles, declarative integrity constraints, transaction management, and optimized query indexing.

---

## 2. Functional Requirements & Relational Entities

| Entity | Primary Key | Description & Cardinality |
| :--- | :--- | :--- |
| **users** | `id` | Central authentication table for students, administrators, and company recruiters. |
| **departments** | `id` | Academic branches (e.g., CSE, IT, ECE). 1:N with students. |
| **industries** | `id` | Economic sectors (e.g., Fintech, Cloud). 1:N with companies. |
| **companies** | `id` | Corporate hiring partners. 1:N with internships. |
| **skills** | `id` | Master catalog of technical and soft skills. M:N with students and internships. |
| **students** | `id` | Student profiles, roll numbers, CGPA, department link. 1:1 with users. |
| **student_skills** | `(student_id, skill_id)` | Composite junction table capturing candidate competencies and proficiency. |
| **internships** | `id` | Role postings with stipend, openings, location, mode, and deadlines. |
| **internship_skills**| `(internship_id, skill_id)`| Composite junction table capturing required skills per role. |
| **applications** | `id` | Transactional applications. Unique `(student_id, internship_id)` prevents duplicates. |
| **interviews** | `id` | Selection rounds, scheduled timestamps, interviewer remarks, and scores. |
| **offers** | `id` | Recruitment offers with stipend, joining date, and response deadlines. |
| **internship_records**| `id` | Official tracked internships resulting from accepted offers. |
| **evaluations** | `id` | Mid-term/final performance evaluations and Pre-Placement Offer (PPO) recommendations. |

---

## 3. Normalization to 3NF

### First Normal Form (1NF)
- **Atomic Attributes**: All attributes contain single atomic values. Skill lists are never stored as comma-separated text strings; instead, dedicated junction tables (`student_skills` and `internship_skills`) decompose many-to-many relationships into atomic rows.
- **Unique Rows**: Each relation possesses a designated primary key.

### Second Normal Form (2NF)
- **No Partial Dependencies**: Every non-key attribute in composite-key tables (`student_skills`, `internship_skills`) is fully functionally dependent on the entire composite key (`{student_id, skill_id} -> proficiency`).

### Third Normal Form (3NF)
- **No Transitive Dependencies**: Non-key attributes depend strictly on the primary key and not on other non-key attributes. For example, company address, city, and HR details reside strictly in `companies`, not inside `internships`. Internships reference only `company_id`. Similarly, department name is not stored in `students`, only `department_id`.

---

## 4. Integrity Constraints & Business Logic Enforcement

1. **Duplicate Application Prevention**:
   ```sql
   CONSTRAINT uq_student_internship UNIQUE (student_id, internship_id)
   ```
2. **Academic & Performance Boundaries**:
   ```sql
   CONSTRAINT chk_student_cgpa CHECK (cgpa >= 0.00 AND cgpa <= 10.00)
   CONSTRAINT chk_student_semester CHECK (current_semester BETWEEN 1 AND 8)
   ```
3. **Temporal Validity**:
   ```sql
   CONSTRAINT chk_internship_dates CHECK (end_date >= start_date)
   CONSTRAINT chk_record_dates CHECK (official_end_date >= official_start_date)
   ```
4. **Scoring Standards**:
   ```sql
   CONSTRAINT chk_interview_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))
   CONSTRAINT chk_eval_overall CHECK (overall_score >= 1.00 AND overall_score <= 5.00)
   ```

---

## 5. ACID Transactions in CampusHire

### Example: Atomic Offer Acceptance Workflow
When a student accepts an offer, the system executes an atomic transaction that:
1. Verifies the offer is still `Issued` and not expired (`offer_valid_until >= CURDATE()`).
2. Updates offer status to `Accepted` and timestamps `responded_at`.
3. Updates the parent application status to `Accepted`.
4. Automatically provisions an `internship_records` entry linking student, company, and supervisor.

```sql
START TRANSACTION;

-- 1. Lock and verify offer
SELECT id, application_id, status, offer_valid_until 
FROM offers 
WHERE id = 2 AND status = 'Issued' FOR UPDATE;

-- 2. Update offer status
UPDATE offers 
SET status = 'Accepted', responded_at = NOW() 
WHERE id = 2;

-- 3. Update application status
UPDATE applications 
SET status = 'Accepted', updated_at = NOW() 
WHERE id = (SELECT application_id FROM offers WHERE id = 2);

-- 4. Create active internship record
INSERT INTO internship_records (
    offer_id, student_id, internship_id, 
    official_start_date, official_end_date, 
    supervisor_name, supervisor_email, status
) VALUES (
    2, 2, 3, 
    '2026-05-15', '2026-08-08', 
    'Engineering Mentor', 'mentor@company.com', 'Active'
);

COMMIT;
```

---

## 6. Indexing Strategy & Optimization

- **B-Tree Composite Indexes**:
  - `idx_internships_status_deadline (status, deadline)`: Accelerates internship catalog search queries filtering by active status and ordering by approaching deadlines.
  - `idx_apps_student (student_id)` & `idx_apps_internship (internship_id)`: Speeds up student dashboard lookups and company applicant queues.
  - `idx_users_email (email)`: O(1) index lookup during JWT authentication.
