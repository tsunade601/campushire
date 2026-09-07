-- =============================================================================
-- CampusHire — Database Views
-- Relational abstractions for analytics, student tracking, and company KPIs
-- =============================================================================

USE campushire;

-- -----------------------------------------------------------------------------
-- View 1: student_application_summary
-- Aggregates application metrics per student with department and CGPA details
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_student_application_summary AS
SELECT 
    s.id AS student_id,
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    d.name AS department_name,
    s.cgpa,
    COUNT(a.id) AS total_applications,
    SUM(CASE WHEN a.status = 'Applied' THEN 1 ELSE 0 END) AS pending_count,
    SUM(CASE WHEN a.status = 'Shortlisted' THEN 1 ELSE 0 END) AS shortlisted_count,
    SUM(CASE WHEN a.status = 'Interview Scheduled' THEN 1 ELSE 0 END) AS interview_count,
    SUM(CASE WHEN a.status = 'Offered' THEN 1 ELSE 0 END) AS offered_count,
    SUM(CASE WHEN a.status = 'Accepted' THEN 1 ELSE 0 END) AS accepted_count,
    SUM(CASE WHEN a.status = 'Rejected' THEN 1 ELSE 0 END) AS rejected_count
FROM students s
JOIN departments d ON s.department_id = d.id
LEFT JOIN applications a ON s.id = a.student_id
GROUP BY s.id, s.roll_number, s.first_name, s.last_name, d.name, s.cgpa;

-- -----------------------------------------------------------------------------
-- View 2: company_recruitment_summary
-- High-level recruiter recruitment funnel: postings, applicants, offers, accepted
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_company_recruitment_summary AS
SELECT 
    c.id AS company_id,
    c.name AS company_name,
    ind.name AS industry_name,
    c.city,
    COUNT(DISTINCT i.id) AS total_internships,
    COUNT(DISTINCT a.id) AS total_applications_received,
    COUNT(DISTINCT o.id) AS total_offers_issued,
    SUM(CASE WHEN o.status = 'Accepted' THEN 1 ELSE 0 END) AS total_offers_accepted,
    ROUND(
        CASE 
            WHEN COUNT(DISTINCT a.id) > 0 
            THEN (COUNT(DISTINCT o.id) * 100.0) / COUNT(DISTINCT a.id) 
            ELSE 0.00 
        END, 2
    ) AS offer_conversion_rate_pct
FROM companies c
JOIN industries ind ON c.industry_id = ind.id
LEFT JOIN internships i ON c.id = i.company_id
LEFT JOIN applications a ON i.id = a.internship_id
LEFT JOIN offers o ON a.id = o.application_id
GROUP BY c.id, c.name, ind.name, c.city;

-- -----------------------------------------------------------------------------
-- View 3: internship_application_stats
-- Operational metrics for each active/closed role posting
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_internship_application_stats AS
SELECT 
    i.id AS internship_id,
    i.title AS internship_title,
    c.name AS company_name,
    i.work_mode,
    i.stipend_amount,
    i.deadline,
    i.status AS internship_status,
    COUNT(a.id) AS applicant_count,
    SUM(CASE WHEN a.status = 'Shortlisted' THEN 1 ELSE 0 END) AS shortlisted_count,
    SUM(CASE WHEN a.status = 'Interview Scheduled' THEN 1 ELSE 0 END) AS interviewed_count,
    SUM(CASE WHEN a.status = 'Offered' THEN 1 ELSE 0 END) AS offered_count,
    DATEDIFF(i.deadline, CURDATE()) AS days_until_deadline
FROM internships i
JOIN companies c ON i.company_id = c.id
LEFT JOIN applications a ON i.id = a.internship_id
GROUP BY i.id, i.title, c.name, i.work_mode, i.stipend_amount, i.deadline, i.status;

-- -----------------------------------------------------------------------------
-- View 4: placement_statistics
-- Executive Placement Cell KPI dashboard
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_placement_statistics AS
SELECT 
    (SELECT COUNT(*) FROM students) AS total_registered_students,
    (SELECT COUNT(DISTINCT student_id) FROM applications) AS students_who_applied,
    (SELECT COUNT(DISTINCT a.student_id) FROM applications a JOIN offers o ON a.id = o.application_id WHERE o.status = 'Accepted') AS total_placed_students,
    ROUND(
        (SELECT COUNT(DISTINCT a.student_id) FROM applications a JOIN offers o ON a.id = o.application_id WHERE o.status = 'Accepted') * 100.0 /
        NULLIF((SELECT COUNT(*) FROM students), 0), 2
    ) AS overall_placement_rate_pct,
    (SELECT COUNT(*) FROM companies WHERE status = 'approved') AS active_partner_companies,
    (SELECT COUNT(*) FROM internships WHERE status = 'Open') AS active_open_internships,
    (SELECT COUNT(*) FROM applications) AS total_applications_submitted,
    (SELECT ROUND(AVG(stipend_offered), 2) FROM offers WHERE status = 'Accepted') AS average_placed_stipend;

-- -----------------------------------------------------------------------------
-- View 5: department_recruitment_stats
-- Departmental performance, cohort size, applications, and placement rates
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_department_recruitment_stats AS
SELECT 
    d.id AS department_id,
    d.code AS department_code,
    d.name AS department_name,
    COUNT(DISTINCT s.id) AS total_students,
    ROUND(AVG(s.cgpa), 2) AS average_cgpa,
    COUNT(DISTINCT a.id) AS total_applications,
    COUNT(DISTINCT CASE WHEN o.status = 'Accepted' THEN s.id END) AS placed_students,
    ROUND(
        COUNT(DISTINCT CASE WHEN o.status = 'Accepted' THEN s.id END) * 100.0 / 
        NULLIF(COUNT(DISTINCT s.id), 0), 2
    ) AS placement_percentage
FROM departments d
LEFT JOIN students s ON d.id = s.department_id
LEFT JOIN applications a ON s.id = a.student_id
LEFT JOIN offers o ON a.id = o.application_id
GROUP BY d.id, d.code, d.name;

-- -----------------------------------------------------------------------------
-- View 6: skill_demand_supply
-- Market intelligence: counts how often a skill is required vs possessed
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW view_skill_demand_supply AS
SELECT 
    sk.id AS skill_id,
    sk.name AS skill_name,
    sk.category AS skill_category,
    COALESCE(dem.demand_count, 0) AS required_in_internships,
    COALESCE(sup.supply_count, 0) AS possessed_by_students
FROM skills sk
LEFT JOIN (
    SELECT skill_id, COUNT(*) AS demand_count
    FROM internship_skills
    GROUP BY skill_id
) dem ON sk.id = dem.skill_id
LEFT JOIN (
    SELECT skill_id, COUNT(*) AS supply_count
    FROM student_skills
    GROUP BY skill_id
) sup ON sk.id = sup.skill_id;
