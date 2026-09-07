-- =============================================================================
-- CampusHire — 20 Essential DBMS Evaluation SQL Queries
-- Demonstrating JOINs, Aggregates, GROUP BY, HAVING, Correlated Subqueries,
-- Window Functions, and Data Filtering
-- =============================================================================

USE campushire;

-- -----------------------------------------------------------------------------
-- 1. Top companies by number of applications
-- Concept: INNER JOIN, GROUP BY, Aggregate COUNT, ORDER BY, LIMIT
-- -----------------------------------------------------------------------------
SELECT 
    c.id AS company_id,
    c.name AS company_name,
    ind.name AS industry,
    COUNT(a.id) AS total_applications
FROM companies c
JOIN industries ind ON c.industry_id = ind.id
JOIN internships i ON c.id = i.company_id
JOIN applications a ON i.id = a.internship_id
GROUP BY c.id, c.name, ind.name
ORDER BY total_applications DESC
LIMIT 10;

-- -----------------------------------------------------------------------------
-- 2. Top students by number of applications
-- Concept: JOIN across 3 tables, GROUP BY, Aggregates, CGPA context
-- -----------------------------------------------------------------------------
SELECT 
    s.id AS student_id,
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    d.code AS dept,
    s.cgpa,
    COUNT(a.id) AS application_count
FROM students s
JOIN departments d ON s.department_id = d.id
JOIN applications a ON s.id = a.student_id
GROUP BY s.id, s.roll_number, s.first_name, s.last_name, d.code, s.cgpa
ORDER BY application_count DESC
LIMIT 10;

-- -----------------------------------------------------------------------------
-- 3. Internship count by industry
-- Concept: LEFT JOIN, GROUP BY, aggregate COUNT(DISTINCT)
-- -----------------------------------------------------------------------------
SELECT 
    ind.id AS industry_id,
    ind.name AS industry_name,
    COUNT(DISTINCT c.id) AS registered_companies,
    COUNT(DISTINCT i.id) AS active_internships
FROM industries ind
LEFT JOIN companies c ON ind.id = c.industry_id
LEFT JOIN internships i ON c.id = i.company_id AND i.status = 'Open'
GROUP BY ind.id, ind.name
ORDER BY active_internships DESC, industry_name ASC;

-- -----------------------------------------------------------------------------
-- 4. Application-to-offer conversion rate by company
-- Concept: Conditional Aggregation (SUM with CASE), HAVING clause, Arithmetic
-- -----------------------------------------------------------------------------
SELECT 
    c.name AS company_name,
    COUNT(a.id) AS applications_received,
    COUNT(o.id) AS offers_made,
    ROUND((COUNT(o.id) * 100.0) / NULLIF(COUNT(a.id), 0), 2) AS conversion_rate_pct
FROM companies c
JOIN internships i ON c.id = i.company_id
JOIN applications a ON i.id = a.internship_id
LEFT JOIN offers o ON a.id = o.application_id
GROUP BY c.id, c.name
HAVING applications_received >= 5
ORDER BY conversion_rate_pct DESC;

-- -----------------------------------------------------------------------------
-- 5. Most demanded skills in current internship postings
-- Concept: Many-to-Many junction join, GROUP BY, Category breakdown
-- -----------------------------------------------------------------------------
SELECT 
    sk.name AS skill_name,
    sk.category,
    COUNT(isk.internship_id) AS requirement_frequency,
    SUM(CASE WHEN isk.is_required = 1 THEN 1 ELSE 0 END) AS mandatory_count
FROM skills sk
JOIN internship_skills isk ON sk.id = isk.skill_id
JOIN internships i ON isk.internship_id = i.id
WHERE i.status = 'Open'
GROUP BY sk.id, sk.name, sk.category
ORDER BY requirement_frequency DESC
LIMIT 15;

-- -----------------------------------------------------------------------------
-- 6. Average stipend by industry
-- Concept: Multi-table JOIN, AVG aggregate, Currency formatting, HAVING filter
-- -----------------------------------------------------------------------------
SELECT 
    ind.name AS industry_name,
    COUNT(i.id) AS total_postings,
    ROUND(MIN(i.stipend_amount), 2) AS min_stipend,
    ROUND(AVG(i.stipend_amount), 2) AS avg_stipend,
    ROUND(MAX(i.stipend_amount), 2) AS max_stipend
FROM industries ind
JOIN companies c ON ind.id = c.industry_id
JOIN internships i ON c.id = i.company_id
GROUP BY ind.id, ind.name
HAVING total_postings > 0
ORDER BY avg_stipend DESC;

-- -----------------------------------------------------------------------------
-- 7. Average stipend by location
-- Concept: Aggregation over geographic dimension, Sorting by average
-- -----------------------------------------------------------------------------
SELECT 
    i.location,
    COUNT(i.id) AS number_of_internships,
    ROUND(AVG(i.stipend_amount), 2) AS average_monthly_stipend
FROM internships i
WHERE i.status = 'Open'
GROUP BY i.location
HAVING number_of_internships >= 2
ORDER BY average_monthly_stipend DESC;

-- -----------------------------------------------------------------------------
-- 8. Students with no applications (Outreach List)
-- Concept: LEFT JOIN with NULL check (Anti-Join) / NOT EXISTS pattern
-- -----------------------------------------------------------------------------
SELECT 
    s.id,
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    d.name AS department_name,
    s.cgpa,
    s.batch_year
FROM students s
JOIN departments d ON s.department_id = d.id
LEFT JOIN applications a ON s.id = a.student_id
WHERE a.id IS NULL
ORDER BY s.cgpa DESC;

-- -----------------------------------------------------------------------------
-- 9. Internships nearing deadline (Within 14 Days)
-- Concept: Date arithmetic (DATEDIFF, CURDATE), Filtering, Temporal sorting
-- -----------------------------------------------------------------------------
SELECT 
    i.id,
    i.title,
    c.name AS company_name,
    i.deadline,
    DATEDIFF(i.deadline, CURDATE()) AS days_remaining,
    i.openings,
    i.stipend_amount
FROM internships i
JOIN companies c ON i.company_id = c.id
WHERE i.status = 'Open' 
  AND i.deadline >= CURDATE()
  AND i.deadline <= DATE_ADD(CURDATE(), INTERVAL 14 DAY)
ORDER BY days_remaining ASC;

-- -----------------------------------------------------------------------------
-- 10. Students with accepted offers and their details
-- Concept: Multi-entity JOIN across 5 tables (Student, Dept, App, Offer, Company)
-- -----------------------------------------------------------------------------
SELECT 
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    d.code AS dept,
    c.name AS company_name,
    i.title AS internship_role,
    o.stipend_offered,
    o.joining_date
FROM students s
JOIN departments d ON s.department_id = d.id
JOIN applications a ON s.id = a.student_id
JOIN internships i ON a.internship_id = i.id
JOIN companies c ON i.company_id = c.id
JOIN offers o ON a.id = o.application_id
WHERE o.status = 'Accepted'
ORDER BY o.stipend_offered DESC;

-- -----------------------------------------------------------------------------
-- 11. Companies with highest offer rate (Offers / Interiewed)
-- Concept: Subquery join or Aggregate division with NULLIF safety
-- -----------------------------------------------------------------------------
SELECT 
    c.name AS company_name,
    COUNT(DISTINCT intv.id) AS total_interviews_conducted,
    COUNT(DISTINCT o.id) AS total_offers_released,
    ROUND((COUNT(DISTINCT o.id) * 100.0) / NULLIF(COUNT(DISTINCT intv.id), 0), 2) AS interview_to_offer_pct
FROM companies c
JOIN internships i ON c.id = i.company_id
JOIN applications a ON i.id = a.internship_id
JOIN interviews intv ON a.id = intv.application_id
LEFT JOIN offers o ON a.id = o.application_id
GROUP BY c.id, c.name
HAVING total_interviews_conducted >= 3
ORDER BY interview_to_offer_pct DESC;

-- -----------------------------------------------------------------------------
-- 12. Applications waiting for decisions (Active Pipeline)
-- Concept: Status filtering, timestamp age calculation in days
-- -----------------------------------------------------------------------------
SELECT 
    a.id AS application_id,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    s.roll_number,
    c.name AS company_name,
    i.title AS role_title,
    a.status,
    DATEDIFF(NOW(), a.applied_at) AS days_in_pipeline
FROM applications a
JOIN students s ON a.student_id = s.id
JOIN internships i ON a.internship_id = i.id
JOIN companies c ON i.company_id = c.id
WHERE a.status IN ('Applied', 'Under Review', 'Shortlisted')
ORDER BY a.applied_at ASC;

-- -----------------------------------------------------------------------------
-- 13. Interview success rate by round type
-- Concept: Categorical analysis, Aggregate ratios across interview rounds
-- -----------------------------------------------------------------------------
SELECT 
    round_type,
    COUNT(*) AS total_conducted,
    SUM(CASE WHEN result = 'Passed' THEN 1 ELSE 0 END) AS passed_count,
    SUM(CASE WHEN result = 'Failed' THEN 1 ELSE 0 END) AS failed_count,
    ROUND((SUM(CASE WHEN result = 'Passed' THEN 1 ELSE 0 END) * 100.0) / COUNT(*), 2) AS pass_rate_pct,
    ROUND(AVG(rating), 2) AS average_rating
FROM interviews
WHERE result IN ('Passed', 'Failed')
GROUP BY round_type
ORDER BY pass_rate_pct DESC;

-- -----------------------------------------------------------------------------
-- 14. Department-wise application statistics
-- Concept: Department grouping, Total vs Unique students applying
-- -----------------------------------------------------------------------------
SELECT 
    d.code AS dept_code,
    d.name AS department_name,
    COUNT(DISTINCT s.id) AS enrolled_students,
    COUNT(DISTINCT a.student_id) AS students_who_applied,
    COUNT(a.id) AS gross_applications,
    ROUND(COUNT(a.id) * 1.0 / NULLIF(COUNT(DISTINCT a.student_id), 0), 2) AS avg_applications_per_applicant
FROM departments d
JOIN students s ON d.id = s.department_id
LEFT JOIN applications a ON s.id = a.student_id
GROUP BY d.id, d.code, d.name
ORDER BY gross_applications DESC;

-- -----------------------------------------------------------------------------
-- 15. Department-wise offer statistics
-- Concept: Multi-level aggregation calculating cohort placement success
-- -----------------------------------------------------------------------------
SELECT 
    d.code AS department,
    COUNT(DISTINCT s.id) AS total_cohort,
    COUNT(DISTINCT CASE WHEN o.status = 'Accepted' THEN s.id END) AS placed_students,
    ROUND(
        COUNT(DISTINCT CASE WHEN o.status = 'Accepted' THEN s.id END) * 100.0 / 
        NULLIF(COUNT(DISTINCT s.id), 0), 2
    ) AS placement_percentage,
    ROUND(AVG(CASE WHEN o.status = 'Accepted' THEN o.stipend_offered END), 2) AS avg_accepted_stipend
FROM departments d
JOIN students s ON d.id = s.department_id
LEFT JOIN applications a ON s.id = a.student_id
LEFT JOIN offers o ON a.id = o.application_id
GROUP BY d.id, d.code
ORDER BY placement_percentage DESC;

-- -----------------------------------------------------------------------------
-- 16. Most popular internship locations (By Applicant Volume)
-- Concept: Aggregation grouping by geographic hub
-- -----------------------------------------------------------------------------
SELECT 
    i.location,
    COUNT(DISTINCT i.id) AS unique_postings,
    COUNT(a.id) AS total_applications_received,
    ROUND(AVG(i.stipend_amount), 2) AS average_stipend
FROM internships i
LEFT JOIN applications a ON i.id = a.internship_id
GROUP BY i.location
ORDER BY total_applications_received DESC
LIMIT 10;

-- -----------------------------------------------------------------------------
-- 17. Average number of applications per internship
-- Concept: Nested Subquery / Aggregate of an Aggregate
-- -----------------------------------------------------------------------------
SELECT 
    ROUND(AVG(app_counts.total_apps), 2) AS overall_avg_apps_per_internship,
    MIN(app_counts.total_apps) AS min_apps_received,
    MAX(app_counts.total_apps) AS max_apps_received
FROM (
    SELECT 
        i.id,
        COUNT(a.id) AS total_apps
    FROM internships i
    LEFT JOIN applications a ON i.id = a.internship_id
    GROUP BY i.id
) AS app_counts;

-- -----------------------------------------------------------------------------
-- 18. Students whose skills match internship requirements
-- Concept: Correlated subquery or relational division matching skill sets
-- -----------------------------------------------------------------------------
SELECT 
    i.id AS internship_id,
    i.title AS internship_title,
    c.name AS company_name,
    s.roll_number,
    CONCAT(s.first_name, ' ', s.last_name) AS student_name,
    COUNT(isk.skill_id) AS matching_skills_count
FROM internships i
JOIN companies c ON i.company_id = c.id
JOIN internship_skills isk ON i.id = isk.internship_id
JOIN student_skills ssk ON isk.skill_id = ssk.skill_id
JOIN students s ON ssk.student_id = s.id
GROUP BY i.id, i.title, c.name, s.id, s.roll_number, s.first_name, s.last_name
HAVING matching_skills_count >= 2
ORDER BY matching_skills_count DESC, i.title ASC
LIMIT 15;

-- -----------------------------------------------------------------------------
-- 19. Internship completion statistics
-- Concept: Aggregation over lifecycle states (Active vs Completed vs Terminated)
-- -----------------------------------------------------------------------------
SELECT 
    r.status AS record_status,
    COUNT(r.id) AS total_records,
    ROUND(AVG(DATEDIFF(r.official_end_date, r.official_start_date) / 7), 1) AS avg_duration_weeks
FROM internship_records r
GROUP BY r.status;

-- -----------------------------------------------------------------------------
-- 20. Average evaluation score by company
-- Concept: Performance metrics analysis, Score aggregation, PPO count
-- -----------------------------------------------------------------------------
SELECT 
    c.name AS company_name,
    COUNT(e.id) AS evaluated_interns,
    ROUND(AVG(e.technical_score), 2) AS avg_tech_score,
    ROUND(AVG(e.communication_score), 2) AS avg_comm_score,
    ROUND(AVG(e.overall_score), 2) AS avg_overall_score,
    SUM(CASE WHEN e.ppo_offered = 1 THEN 1 ELSE 0 END) AS ppo_offers_granted
FROM companies c
JOIN internships i ON c.id = i.company_id
JOIN internship_records r ON i.id = r.internship_id
JOIN evaluations e ON r.id = e.internship_record_id
GROUP BY c.id, c.name
HAVING evaluated_interns >= 1
ORDER BY avg_overall_score DESC;
