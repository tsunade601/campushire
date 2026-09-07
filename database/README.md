# CampusHire — Database Architecture & DBMS Specifications

## 1. Relational Schema Design
CampusHire operates on a normalized MySQL 8.0+ relational schema designed in Third Normal Form (3NF).
Every relation features explicit primary keys, strict foreign key constraints, column validations, and non-redundant dependencies.

### Core Entity Relationships:
- `users (1) -> (1) students`
- `users (1) -> (1) companies`
- `departments (1) -> (N) students`
- `industries (1) -> (N) companies`
- `companies (1) -> (N) internships`
- `students (M) <-> (N) skills` (via `student_skills`)
- `internships (M) <-> (N) skills` (via `internship_skills`)
- `students (1) -> (N) applications`
- `internships (1) -> (N) applications`
- `applications (1) -> (N) interviews`
- `applications (1) -> (1) offers`
- `offers (1) -> (1) internship_records`
- `internship_records (1) -> (1) evaluations`

## 2. Integrity & Consistency
- **Uniqueness**: `users.email`, `students.roll_number`, `applications.(student_id, internship_id)`, `offers.application_id`.
- **Domain Constraints**: `cgpa BETWEEN 0.00 AND 10.00`, `semester BETWEEN 1 AND 8`, `evaluation scores BETWEEN 1 AND 5`, `dates (end_date >= start_date)`.
- **Referential Integrity**: Cascading deletes on ephemeral transactional records; restricted deletions on master catalogues (`departments`, `industries`).

## 3. DBMS Evaluation Queries
Documented in `database/queries.sql` across 20 canonical analytical queries including:
- Top hiring companies and applicant volume
- Application-to-offer conversion rate calculation using conditional aggregates (`CASE` inside `COUNT`/`SUM`)
- Skill demand versus supply gap analysis
- Anti-joins for identifying unplaced students
- Temporal date arithmetic (`DATEDIFF`, `CURDATE`)
