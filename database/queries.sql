USE campushire;
-- 1 top companies by applications
SELECT c.name,COUNT(a.id) applications FROM companies c JOIN internships i ON i.company_id=c.id JOIN applications a ON a.internship_id=i.id GROUP BY c.id ORDER BY applications DESC;
-- 2 top students
SELECT s.full_name,COUNT(a.id) total FROM students s JOIN applications a ON a.student_id=s.id GROUP BY s.id ORDER BY total DESC;
-- 3 internships by industry
SELECT ind.name,COUNT(i.id) FROM industries ind JOIN companies c ON c.industry_id=ind.id JOIN internships i ON i.company_id=c.id GROUP BY ind.id;
-- 4 conversion by company
SELECT c.name,COUNT(a.id) apps,COUNT(o.id) offers,ROUND(COUNT(o.id)/NULLIF(COUNT(a.id),0)*100,2) rate FROM companies c JOIN internships i ON i.company_id=c.id LEFT JOIN applications a ON a.internship_id=i.id LEFT JOIN offers o ON o.application_id=a.id GROUP BY c.id;
-- 5 demanded skills
SELECT sk.name,COUNT(*) demand FROM skills sk JOIN internship_skills x ON x.skill_id=sk.id GROUP BY sk.id ORDER BY demand DESC;
-- 6 average stipend industry
SELECT ind.name,AVG(i.stipend) avg_stipend FROM industries ind JOIN companies c ON c.industry_id=ind.id JOIN internships i ON i.company_id=c.id GROUP BY ind.id;
-- 7 stipend by location
SELECT location,AVG(stipend) FROM internships GROUP BY location ORDER BY AVG(stipend) DESC;
-- 8 students with no applications
SELECT s.* FROM students s LEFT JOIN applications a ON a.student_id=s.id WHERE a.id IS NULL;
-- 9 nearing deadlines
SELECT * FROM internships WHERE deadline BETWEEN CURDATE() AND DATE_ADD(CURDATE(),INTERVAL 14 DAY);
-- 10 accepted offers
SELECT s.full_name,i.title,c.name FROM students s JOIN applications a ON a.student_id=s.id JOIN offers o ON o.application_id=a.id AND o.response='accepted' JOIN internships i ON i.id=a.internship_id JOIN companies c ON c.id=i.company_id;
-- 11 highest offer rate (HAVING)
SELECT c.name,COUNT(o.id)/COUNT(a.id) rate FROM companies c JOIN internships i ON i.company_id=c.id LEFT JOIN applications a ON a.internship_id=i.id LEFT JOIN offers o ON o.application_id=a.id GROUP BY c.id HAVING COUNT(a.id)>0 ORDER BY rate DESC;
-- 12 pending decisions
SELECT * FROM applications WHERE status IN ('submitted','screening');
-- 13 interview success
SELECT result,COUNT(*) FROM interviews GROUP BY result;
-- 14 department applications
SELECT d.name,COUNT(a.id) FROM departments d JOIN students s ON s.department_id=d.id LEFT JOIN applications a ON a.student_id=s.id GROUP BY d.id;
-- 15 department offers
SELECT d.name,COUNT(o.id) FROM departments d JOIN students s ON s.department_id=d.id JOIN applications a ON a.student_id=s.id JOIN offers o ON o.application_id=a.id GROUP BY d.id;
-- 16 popular locations
SELECT location,COUNT(*) FROM internships GROUP BY location ORDER BY COUNT(*) DESC;
-- 17 average applications/internship
SELECT AVG(n) FROM (SELECT COUNT(a.id) n FROM internships i LEFT JOIN applications a ON a.internship_id=i.id GROUP BY i.id) q;
-- 18 skill matching nested query
SELECT i.title FROM internships i WHERE (SELECT COUNT(*) FROM internship_skills x WHERE x.internship_id=i.id AND x.skill_id IN (SELECT skill_id FROM student_skills WHERE student_id=?)) >= (SELECT COUNT(*) FROM internship_skills WHERE internship_id=i.id);
-- 19 completion stats
SELECT status,COUNT(*) FROM internship_records GROUP BY status;
-- 20 evaluation by company
SELECT c.name,AVG(e.score) FROM companies c JOIN internships i ON i.company_id=c.id JOIN applications a ON a.internship_id=i.id JOIN offers o ON o.application_id=a.id JOIN internship_records r ON r.offer_id=o.id JOIN evaluations e ON e.record_id=r.id GROUP BY c.id;
