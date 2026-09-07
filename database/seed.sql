-- =============================================================================
-- CampusHire — Realistic Relational Seed Data
-- Designed for immediate local & Docker evaluation
-- =============================================================================

USE campushire;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS
INSERT INTO users (id, email, password_hash, role, is_active) VALUES
(1, 'admin@campushire.edu', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'admin', TRUE),
(2, 'alex.chen@campushire.edu', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'student', TRUE),
(3, 'priya.sharma@campushire.edu', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'student', TRUE),
(4, 'marcus.vance@campushire.edu', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'student', TRUE),
(5, 'sneha.patel@campushire.edu', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'student', TRUE),
(6, 'rahul.verma@campushire.edu', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'student', TRUE),
(7, 'ananya.iyer@campushire.edu', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'student', TRUE),
(8, 'david.kim@campushire.edu', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'student', TRUE),
(9, 'recruiter@google.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'company', TRUE),
(10, 'careers@microsoft.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'company', TRUE),
(11, 'hiring@amazon.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'company', TRUE),
(12, 'recruiting@stripe.com', '$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'company', TRUE);

-- 2. DEPARTMENTS
INSERT INTO departments (id, code, name, faculty_in_charge, contact_email, phone) VALUES
(1, 'CSE', 'Computer Science and Engineering', 'Dr. Ramesh Sundaram', 'hod.cse@campushire.edu', '+91 98401 23451'),
(2, 'IT', 'Information Technology', 'Dr. Radhika Menon', 'hod.it@campushire.edu', '+91 98401 23452'),
(3, 'ECE', 'Electronics and Communication Engineering', 'Prof. Arvind Swaminathan', 'hod.ece@campushire.edu', '+91 98401 23453'),
(4, 'EEE', 'Electrical and Electronics Engineering', 'Dr. K. Balachander', 'hod.eee@campushire.edu', '+91 98401 23454'),
(5, 'MECH', 'Mechanical Engineering', 'Prof. Suresh Kumar', 'hod.mech@campushire.edu', '+91 98401 23455'),
(6, 'CIVIL', 'Civil Engineering', 'Dr. Meenakshi Sundaram', 'hod.civil@campushire.edu', '+91 98401 23456'),
(7, 'AIDS', 'Artificial Intelligence and Data Science', 'Dr. Preethi Raghavan', 'hod.aids@campushire.edu', '+91 98401 23457');

-- 3. INDUSTRIES
INSERT INTO industries (id, name, description) VALUES
(1, 'Enterprise Software & Cloud', 'Global cloud computing, distributed systems, and enterprise SaaS providers.'),
(2, 'Fintech & Payment Systems', 'Digital banking, online payment infrastructure, and trading platforms.'),
(3, 'E-Commerce & Logistics', 'Online marketplaces, supply chain technology, and consumer delivery platforms.'),
(4, 'Healthcare & Biotech Tech', 'Medical imaging, hospital information systems, and genomics computing.'),
(5, 'Semiconductors & Hardware', 'VLSI circuit design, embedded firmware, and silicon testing.'),
(6, 'Automotive & Clean Energy', 'Electric vehicle telemetry, autonomous driving, and battery management systems.');

-- 4. COMPANIES
INSERT INTO companies (id, user_id, name, industry_id, website, logo_url, description, address, city, country, hr_name, hr_email, hr_phone, status) VALUES
(1, 9, 'Google Cloud India', 1, 'https://cloud.google.com', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=128', 'Global technology corporation specializing in search, cloud infrastructure, and AI.', 'RMZ Infinity, Old Madras Road', 'Bengaluru', 'India', 'Vikramaditya Rao', 'vikram.recruiter@google.com', '+91 80 6721 8000', 'approved'),
(2, 10, 'Microsoft R&D', 1, 'https://microsoft.com', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128', 'Developer of cloud computing, developer tools, and operating systems.', 'Gachibowli Campus', 'Hyderabad', 'India', 'Ananya Deshmukh', 'ananya.hr@microsoft.com', '+91 40 6695 0000', 'approved'),
(3, 11, 'Amazon Development Center', 3, 'https://amazon.jobs', 'https://images.unsplash.com/photo-1523474255658-4af6182502b7?w=128', 'Leader in e-commerce, cloud infrastructure (AWS), and supply chain automation.', 'World Trade Center, Brigade Gateway', 'Bengaluru', 'India', 'Siddharth Nair', 'snair-talent@amazon.com', '+91 80 4352 1000', 'approved'),
(4, 12, 'Stripe Financial Tech', 2, 'https://stripe.com', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128', 'Economic infrastructure for the internet: global payment processing.', 'One BKC, Bandra Kurla Complex', 'Mumbai', 'India', 'Elena Rostova', 'elena.hr@stripe.com', '+91 22 6800 4500', 'approved'),
(5, NULL, 'Texas Instruments', 5, 'https://ti.com', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=128', 'Global semiconductor design and manufacturing company developing analog chips.', 'Bagmane Tech Park, CV Raman Nagar', 'Bengaluru', 'India', 'Raghavan Pillai', 'raghavan.ti@ti.com', '+91 80 2504 8000', 'approved'),
(6, NULL, 'Razorpay Payments', 2, 'https://razorpay.com', 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=128', 'Leading fintech platform offering comprehensive payment gateway solutions.', 'Koramangala 4th Block', 'Bengaluru', 'India', 'Tanvi Mehta', 'tanvi.m@razorpay.com', '+91 80 4666 9999', 'approved'),
(7, NULL, 'Tesla Energy & Automation', 6, 'https://tesla.com', 'https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=128', 'Pioneering clean energy, electric vehicle telemetry software, and factory robotics.', 'Pinnacle Building, Magarpatta City', 'Pune', 'India', 'Kabir Malhotra', 'kmalhotra@tesla.com', '+91 20 6701 3000', 'approved');

-- 5. SKILLS
INSERT INTO skills (id, name, category, description) VALUES
(1, 'Python', 'Programming', 'High-level language for backend, scripting, and data analysis.'),
(2, 'Java', 'Programming', 'Object-oriented language for enterprise distributed systems.'),
(3, 'C++', 'Programming', 'High-performance systems programming language.'),
(4, 'JavaScript (ES6+)', 'Web Development', 'Modern asynchronous client and server script programming.'),
(5, 'TypeScript', 'Web Development', 'Statically typed superset of JavaScript enhancing code safety.'),
(6, 'React.js', 'Web Development', 'Component-based library for building reactive web applications.'),
(7, 'Node.js & Express', 'Web Development', 'Event-driven asynchronous server runtime and REST framework.'),
(8, 'SQL (MySQL/PostgreSQL)', 'Database', 'Relational schema design, query optimization, and transactions.'),
(9, 'MongoDB', 'Database', 'Document-oriented NoSQL storage for semi-structured data.'),
(10, 'Docker & Containers', 'Cloud/DevOps', 'Application containerization and lightweight deployment.'),
(11, 'AWS Cloud Services', 'Cloud/DevOps', 'Amazon Web Services core primitives (EC2, S3, RDS, Lambda).'),
(12, 'Git & GitHub Workflows', 'Cloud/DevOps', 'Distributed version control and CI/CD pipelines.'),
(13, 'Machine Learning & Scikit-Learn', 'Data Science/AI', 'Statistical learning algorithms, feature engineering, and evaluation.'),
(14, 'Deep Learning (PyTorch/TensorFlow)', 'Data Science/AI', 'Neural network design for vision, NLP, and representation.'),
(15, 'System Design & Distributed Systems', 'Core Engineering', 'Scalable architecture, caching strategies, and ACID semantics.'),
(16, 'Embedded C & Microcontrollers', 'Core Engineering', 'Low-level hardware interfacing, RTOS, and register control.'),
(17, 'Verilog / VLSI Design', 'Core Engineering', 'Digital circuit synthesis and FPGA implementation.'),
(18, 'Technical Communication', 'Soft Skill', 'Clear engineering documentation and oral presentations.'),
(19, 'Agile & Scrum Teamwork', 'Soft Skill', 'Sprint estimation and collaborative code reviews.');

-- 6. STUDENTS
INSERT INTO students (id, user_id, roll_number, first_name, last_name, department_id, batch_year, current_semester, cgpa, phone, address, linkedin_url, github_url, resume_url, bio) VALUES
(1, 2, '2023CSE001', 'Alex', 'Chen', 1, 2026, 6, 9.42, '+91 98765 43210', 'Block 4, University Men Hostel', 'https://linkedin.com/in/alex-chen-demo', 'https://github.com/alexchen', 'https://campushire.edu/resumes/2023CSE001.pdf', 'Passionate full-stack developer focusing on distributed systems and backend scalability.'),
(2, 3, '2023IT014', 'Priya', 'Sharma', 2, 2026, 6, 8.95, '+91 98765 43211', 'Lotus Apartments, Indiranagar, Bengaluru', 'https://linkedin.com/in/priya-sharma-it', 'https://github.com/priyasharma', 'https://campushire.edu/resumes/2023IT014.pdf', 'Frontend specialist experienced in React, TypeScript, and clean UI/UX paradigms.'),
(3, 4, '2023ECE022', 'Marcus', 'Vance', 3, 2026, 6, 8.65, '+91 98765 43212', 'Kalyan Nagar Main Road, Bengaluru', 'https://linkedin.com/in/marcus-vance-ece', 'https://github.com/marcusv', 'https://campushire.edu/resumes/2023ECE022.pdf', 'Embedded systems and IoT developer with experience in ESP32, RTOS, and C++.'),
(4, 5, '2023AIDS007', 'Sneha', 'Patel', 7, 2026, 6, 9.15, '+91 98765 43213', 'Green Glen Layout, Bellandur, Bengaluru', 'https://linkedin.com/in/sneha-patel-ai', 'https://github.com/snehapatel', 'https://campushire.edu/resumes/2023AIDS007.pdf', 'Machine learning researcher and data engineer proficient with PyTorch and data pipelines.'),
(5, 6, '2023CSE045', 'Rahul', 'Verma', 1, 2026, 6, 7.82, '+91 98765 43214', 'Hostel 2, Room 304, University Campus', 'https://linkedin.com/in/rahul-verma-cse', 'https://github.com/rahulverma', 'https://campushire.edu/resumes/2023CSE045.pdf', 'Backend developer experienced in Node.js, Express, and relational database indexing.'),
(6, 7, '2023EEE019', 'Ananya', 'Iyer', 4, 2026, 6, 8.40, '+91 98765 43215', 'Mylapore, Chennai, Tamil Nadu', 'https://linkedin.com/in/ananya-iyer-eee', 'https://github.com/ananyaiyer', 'https://campushire.edu/resumes/2023EEE019.pdf', 'Power electronics and firmware developer fascinated by electric vehicles.'),
(7, 8, '2023IT039', 'David', 'Kim', 2, 2026, 6, 8.10, '+91 98765 43216', 'Banjara Hills, Hyderabad, Telangana', 'https://linkedin.com/in/david-kim-demo', 'https://github.com/davidkim', 'https://campushire.edu/resumes/2023IT039.pdf', 'Web architect with enthusiasm for reactive user interfaces and end-to-end testing.');

-- 7. STUDENT_SKILLS
INSERT INTO student_skills (student_id, skill_id, proficiency) VALUES
(1, 1, 'Expert'), (1, 4, 'Advanced'), (1, 5, 'Advanced'), (1, 7, 'Expert'), (1, 8, 'Advanced'), (1, 10, 'Intermediate'), (1, 12, 'Advanced'), (1, 15, 'Advanced'),
(2, 4, 'Expert'), (2, 5, 'Expert'), (2, 6, 'Expert'), (2, 8, 'Intermediate'), (2, 12, 'Advanced'), (2, 18, 'Advanced'),
(3, 3, 'Expert'), (3, 8, 'Intermediate'), (3, 10, 'Intermediate'), (3, 16, 'Expert'), (3, 17, 'Advanced'),
(4, 1, 'Expert'), (4, 8, 'Advanced'), (4, 13, 'Expert'), (4, 14, 'Advanced'), (4, 10, 'Intermediate'),
(5, 1, 'Intermediate'), (5, 2, 'Advanced'), (5, 7, 'Advanced'), (5, 8, 'Advanced'),
(6, 3, 'Advanced'), (6, 16, 'Advanced'), (6, 18, 'Intermediate'),
(7, 4, 'Advanced'), (7, 6, 'Advanced'), (7, 7, 'Intermediate');

-- 8. INTERNSHIPS
INSERT INTO internships (id, company_id, title, description, requirements, location, work_mode, duration_weeks, stipend_amount, openings, deadline, start_date, end_date, status) VALUES
(1, 1, 'Cloud Infrastructure Engineering Intern', 'Join the Google Cloud core compute team to build high-availability telemetry pipelines and optimize connection pools.', 'Solid grasp of Python or Java, relational databases, Linux systems, and distributed system concepts. CGPA >= 8.5 preferred.', 'Bengaluru', 'Hybrid', 12, 115000.00, 4, DATE_ADD(CURDATE(), INTERVAL 18 DAY), '2026-06-01', '2026-08-24', 'Open'),
(2, 1, 'Site Reliability & DevOps Intern', 'Automate containerized service deployments, build chaos engineering experiments, and analyze query bottlenecks.', 'Proficiency with Docker, Linux shell scripting, Python, and networking concepts.', 'Bengaluru', 'Hybrid', 10, 105000.00, 2, DATE_ADD(CURDATE(), INTERVAL 25 DAY), '2026-06-01', '2026-08-10', 'Open'),
(3, 2, 'Full-Stack Software Engineering Intern', 'Collaborate with the Azure Developer Experience engineering team to craft reactive web apps and scalable microservices.', 'Strong foundation in React, TypeScript, Node.js, and SQL schema design.', 'Hyderabad', 'Hybrid', 12, 95000.00, 5, DATE_ADD(CURDATE(), INTERVAL 14 DAY), '2026-05-15', '2026-08-08', 'Open'),
(4, 2, 'Data Platform & Analytics Engineering Intern', 'Engineer high-throughput real-time data ingestion pipelines, design dimensional schemas, and optimize SQL aggregations.', 'Experience in SQL, Python, pandas, and data warehouse fundamentals.', 'Hyderabad', 'On-site', 12, 90000.00, 3, DATE_ADD(CURDATE(), INTERVAL 12 DAY), '2026-05-15', '2026-08-08', 'Open'),
(5, 3, 'Backend Software Development Intern (SDE)', 'Build tier-1 inventory synchronization APIs, handle high-concurrency order placement queues, and enforce ACID boundaries.', 'Fluency in Java or C++, Object-Oriented Design, and relational database indexing.', 'Bengaluru', 'On-site', 16, 85000.00, 6, DATE_ADD(CURDATE(), INTERVAL 20 DAY), '2026-05-01', '2026-08-20', 'Open'),
(6, 4, 'Core Financial Payments Engineering Intern', 'Design fault-tolerant payment state machines, implement idempotent webhook dispatchers, and prevent race conditions.', 'Strong skills in SQL transactions, Node.js or Python, system design intuition, and security hygiene.', 'Mumbai', 'Remote', 12, 120000.00, 3, DATE_ADD(CURDATE(), INTERVAL 9 DAY), '2026-06-15', '2026-09-08', 'Open'),
(7, 5, 'Embedded Firmware & Hardware Intern', 'Develop real-time device drivers, interface I2C and SPI sensor peripherals, and profile memory constraints on ARM microcontrollers.', 'Firm grasp of C/C++, digital logic, and microcontroller architecture.', 'Bengaluru', 'On-site', 12, 60000.00, 2, DATE_ADD(CURDATE(), INTERVAL 30 DAY), '2026-06-01', '2026-08-24', 'Open'),
(8, 6, 'Neobanking Frontend & Mobile UI Intern', 'Develop accessible checkout workflows, integrate banking SDKs, and build micro-animations for transaction dashboards.', 'Proficiency in React.js, Tailwind CSS, TypeScript, and state management.', 'Bengaluru', 'Hybrid', 10, 55000.00, 4, DATE_ADD(CURDATE(), INTERVAL 8 DAY), '2026-05-15', '2026-07-24', 'Open'),
(9, 7, 'Automotive Telemetry & IoT Intern', 'Process high-frequency CAN bus sensor packets, build ingestion services, and alert on battery thermal anomalies.', 'Knowledge of C++, Python, time-series data, and embedded interfaces.', 'Pune', 'On-site', 14, 75000.00, 2, DATE_ADD(CURDATE(), INTERVAL 15 DAY), '2026-06-01', '2026-09-07', 'Open');

-- 9. INTERNSHIP_SKILLS
INSERT INTO internship_skills (internship_id, skill_id, is_required) VALUES
(1, 1, TRUE), (1, 8, TRUE), (1, 10, TRUE), (1, 15, TRUE),
(2, 10, TRUE), (2, 11, TRUE), (2, 1, FALSE), (2, 12, TRUE),
(3, 5, TRUE), (3, 6, TRUE), (3, 7, TRUE), (3, 8, TRUE),
(4, 1, TRUE), (4, 8, TRUE), (4, 13, TRUE),
(5, 2, TRUE), (5, 3, FALSE), (5, 8, TRUE), (5, 15, TRUE),
(6, 7, TRUE), (6, 8, TRUE), (6, 15, TRUE), (6, 5, FALSE),
(7, 3, TRUE), (7, 16, TRUE), (7, 17, TRUE),
(8, 4, TRUE), (8, 5, TRUE), (8, 6, TRUE),
(9, 1, TRUE), (9, 3, TRUE), (9, 16, TRUE);

-- 10. APPLICATIONS
INSERT INTO applications (id, student_id, internship_id, status, cover_letter, resume_url, applied_at) VALUES
(1, 1, 1, 'Offered', 'I have built distributed services and optimized MySQL queries. Passionate about Google Cloud.', 'https://campushire.edu/resumes/2023CSE001.pdf', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(2, 1, 3, 'Shortlisted', 'Strong experience with React, TypeScript, and Express make me a great fit for Azure Dev Experience.', 'https://campushire.edu/resumes/2023CSE001.pdf', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(3, 1, 6, 'Interview Scheduled', 'Financial ledger correctness and idempotency in payments are areas I have researched.', 'https://campushire.edu/resumes/2023CSE001.pdf', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(4, 2, 3, 'Accepted', 'Specialized in frontend design and full-stack development using React and Tailwind.', 'https://campushire.edu/resumes/2023IT014.pdf', DATE_SUB(NOW(), INTERVAL 28 DAY)),
(5, 2, 8, 'Shortlisted', 'Passionate about building fluid, accessible checkout workflows with clean UI animations.', 'https://campushire.edu/resumes/2023IT014.pdf', DATE_SUB(NOW(), INTERVAL 18 DAY)),
(6, 3, 7, 'Offered', 'Extensive experience with embedded C, hardware debugging, and real-time operating systems.', 'https://campushire.edu/resumes/2023ECE022.pdf', DATE_SUB(NOW(), INTERVAL 22 DAY)),
(7, 3, 9, 'Under Review', 'Interested in applying telemetry and CAN bus protocol decoding to electric vehicles.', 'https://campushire.edu/resumes/2023ECE022.pdf', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(8, 4, 4, 'Accepted', 'Data pipelines, relational aggregation, and machine learning models are the core of my coursework.', 'https://campushire.edu/resumes/2023AIDS007.pdf', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(9, 4, 1, 'Rejected', 'Applying my data engineering background to cloud compute monitoring and automated alerting.', 'https://campushire.edu/resumes/2023AIDS007.pdf', DATE_SUB(NOW(), INTERVAL 26 DAY)),
(10, 5, 5, 'Interview Scheduled', 'Strong passion for high-concurrency Java backend services and distributed databases.', 'https://campushire.edu/resumes/2023CSE045.pdf', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(11, 5, 1, 'Applied', 'Eager to learn cloud scalability and distributed storage under Google mentorship.', 'https://campushire.edu/resumes/2023CSE045.pdf', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(12, 6, 7, 'Under Review', 'Background in microcontroller architectures and circuit design suitable for semiconductors.', 'https://campushire.edu/resumes/2023EEE019.pdf', DATE_SUB(NOW(), INTERVAL 8 DAY)),
(13, 7, 3, 'Under Review', 'Excited about web frameworks, accessible components, and modern frontend pipelines.', 'https://campushire.edu/resumes/2023IT039.pdf', DATE_SUB(NOW(), INTERVAL 6 DAY));

-- 11. INTERVIEWS
INSERT INTO interviews (id, application_id, round_number, round_type, scheduled_at, duration_minutes, location_or_link, interviewer_name, result, feedback, rating) VALUES
(1, 1, 1, 'Technical Round 1', DATE_SUB(NOW(), INTERVAL 18 DAY), 60, 'https://meet.google.com/abc-defg-hij', 'Rohit Sen (Senior Staff Engineer)', 'Passed', 'Exceptional grasp of OS concepts, thread synchronization, and SQL locking semantics.', 5),
(2, 1, 2, 'Technical Round 2', DATE_SUB(NOW(), INTERVAL 12 DAY), 60, 'https://meet.google.com/klm-nopq-rst', 'Aditi Kulkarni (Principal Architect)', 'Passed', 'Solid distributed design approach, clean architecture diagrams, and strong problem solving.', 5),
(3, 4, 1, 'Technical Round 1', DATE_SUB(NOW(), INTERVAL 22 DAY), 45, 'https://teams.microsoft.com/l/meetup-join/123', 'Varun Gupta (Lead UI Engineer)', 'Passed', 'Clean React component hierarchy, excellent TypeScript typing, and intuitive performance optimizations.', 4),
(4, 4, 2, 'HR Round', DATE_SUB(NOW(), INTERVAL 16 DAY), 30, 'https://teams.microsoft.com/l/meetup-join/456', 'Kavita Menon (Talent Partner)', 'Passed', 'Cultural fit, collaborative mindset, and great alignment with team mission.', 5),
(5, 6, 1, 'Technical Round 1', DATE_SUB(NOW(), INTERVAL 15 DAY), 60, 'TI Bengaluru Campus, Lab Block B', 'Dr. Sundar Rajan (Hardware Director)', 'Passed', 'Impressive familiarity with register maps, DMA controllers, and oscilloscope debugging.', 4),
(6, 8, 1, 'Technical Round 1', DATE_SUB(NOW(), INTERVAL 24 DAY), 60, 'https://teams.microsoft.com/l/meetup-join/789', 'Deepak V (Data Engineering Manager)', 'Passed', 'Flawless dimensional modeling and SQL window function optimization.', 5),
(7, 3, 1, 'Technical Round 1', DATE_ADD(NOW(), INTERVAL 2 DAY), 60, 'https://stripe.zoom.us/j/987654321', 'Nikhil Agarwal (Staff Engineer)', 'Scheduled', 'Upcoming round focusing on concurrency and idempotency keys.', NULL),
(8, 10, 1, 'Online Assessment', DATE_ADD(NOW(), INTERVAL 3 DAY), 90, 'https://amazon.hirepro.in/test/sde-2026', 'Amazon Automated System', 'Scheduled', 'Coding assessment: Data structures, binary trees, and dynamic programming.', NULL);

-- 12. OFFERS
INSERT INTO offers (id, application_id, offer_letter_url, stipend_offered, benefits_description, joining_date, offer_valid_until, status, responded_at) VALUES
(1, 1, 'https://campushire.edu/letters/OFFER-GOOG-2026-001.pdf', 115000.00, 'Comprehensive health coverage, laptop provided, wellness stipend, and return full-time PPO eligibility.', '2026-06-01', DATE_ADD(CURDATE(), INTERVAL 15 DAY), 'Issued', NULL),
(2, 4, 'https://campushire.edu/letters/OFFER-MSFT-2026-014.pdf', 95000.00, 'Health insurance, home office setup budget, mentorship program, and official Microsoft vouchers.', '2026-05-15', DATE_SUB(CURDATE(), INTERVAL 5 DAY), 'Accepted', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(3, 6, 'https://campushire.edu/letters/OFFER-TI-2026-003.pdf', 60000.00, 'On-campus lab access, subsidized housing near Bagmane Tech Park, and embedded test kit provided.', '2026-06-01', DATE_ADD(CURDATE(), INTERVAL 10 DAY), 'Issued', NULL),
(4, 8, 'https://campushire.edu/letters/OFFER-MSFT-2026-008.pdf', 90000.00, 'Cloud credits, hardware allowance, executive mentorship, and pre-placement interview fast-track.', '2026-05-15', DATE_SUB(CURDATE(), INTERVAL 3 DAY), 'Accepted', DATE_SUB(NOW(), INTERVAL 8 DAY));

-- 13. INTERNSHIP_RECORDS
INSERT INTO internship_records (id, offer_id, student_id, internship_id, official_start_date, official_end_date, supervisor_name, supervisor_email, status, completion_notes) VALUES
(1, 2, 2, 3, '2025-05-15', '2025-08-08', 'Gaurav Bansal', 'gaurav.b@microsoft.com', 'Completed', 'Student successfully delivered the new Azure Resource Visualization dashboard with 99.8% crash-free sessions.'),
(2, 4, 4, 4, '2025-05-15', '2025-08-08', 'Sujata Nair', 'sujata.nair@microsoft.com', 'Completed', 'Engineered an automated streaming ingestion pipeline handling 12,000 events/sec with zero packet loss.');

-- 14. EVALUATIONS
INSERT INTO evaluations (id, internship_record_id, evaluated_by, technical_score, communication_score, punctuality_score, problem_solving_score, overall_score, ppo_offered, qualitative_feedback, evaluated_at) VALUES
(1, 1, 'Gaurav Bansal (Principal Manager)', 5, 5, 4, 5, 4.75, TRUE, 'Priya displayed remarkable technical ownership, architecting intuitive React workflows and assisting peers during code reviews. Unreservedly recommended for a Pre-Placement Offer (PPO).', '2025-08-10 14:30:00'),
(2, 2, 'Sujata Nair (Senior Partner Director)', 5, 4, 5, 5, 4.75, TRUE, 'Sneha solved complex SQL optimization bottlenecks and delivered a production-ready telemetry pipeline ahead of schedule. Outstanding contributor.', '2025-08-11 11:00:00');

SET FOREIGN_KEY_CHECKS = 1;
