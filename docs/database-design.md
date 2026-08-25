# Database design

## Problem and entities
CampusHire separates authentication (`users`) from student, company and placement domains. Core entities are users, students, departments, companies, industries, internships, skills, applications, interviews, offers, internship_records and evaluations.

Students and internships have a many-to-many skill relationship through `student_skills` and `internship_skills`. An application belongs to exactly one student and internship. Interviews and offers belong to applications; a record belongs to an accepted offer; an evaluation belongs to a record.

## Normalization and integrity
The design is approximately 3NF: company and industry attributes are not copied into internships, and skills are never comma-separated in source tables. Junction tables use composite primary keys. Foreign keys use cascade for owned child records and SET NULL for optional catalog relationships. UNIQUE constraints enforce user emails, companies and duplicate application prevention. CHECK constraints enforce non-negative stipends, positive durations/openings and evaluation scores from 0–10.

## Indexing
`internships(status, deadline, location, work_mode)` supports the public catalogue. Company, application student and application status indexes support joins, dashboards and admin filters. Search text uses LIKE for the academic demo; production can add FULLTEXT indexes.

## DBMS demonstrations
`database/queries.sql` includes 20 meaningful joins, left joins, aggregates, GROUP BY/HAVING, ordering, nested skill matching query and completion reports. `views.sql` creates four reporting views. Applying a student uses a transaction: verify active deadline, insert application, commit; rollback handles duplicate/failed writes. Registration similarly atomically inserts a user and profile.

## Assumptions
Seed data is a small demo subset for fast Docker startup. Synthetic generator output is not real student data. Applications are immutable in identity but status changes are authorized. Interview, offer and record routes are planned extension points; the schema already supports the complete lifecycle.
