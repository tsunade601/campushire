-- =============================================================================
-- CampusHire — Student Internship & Recruitment Management System
-- Relational Database Schema (MySQL 8.0+)
-- 3NF Normalized Relational Design with Constraints, Indexes, and Cascades
-- =============================================================================

DROP DATABASE IF EXISTS campushire;
CREATE DATABASE campushire CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campushire;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS internship_records;
DROP TABLE IF EXISTS offers;
DROP TABLE IF EXISTS interviews;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS internship_skills;
DROP TABLE IF EXISTS internships;
DROP TABLE IF EXISTS student_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------------
-- Table 1: USERS (Core Authentication & System Accounts)
-- -----------------------------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('student', 'admin', 'company') NOT NULL DEFAULT 'student',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role_active (role, is_active),
    INDEX idx_users_email (email)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 2: DEPARTMENTS (Academic Branches)
-- -----------------------------------------------------------------------------
CREATE TABLE departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    faculty_in_charge VARCHAR(150) NULL,
    contact_email VARCHAR(191) NULL,
    phone VARCHAR(30) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 3: INDUSTRIES (Business Domains)
-- -----------------------------------------------------------------------------
CREATE TABLE industries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 4: COMPANIES (Corporate Partners & Recruiters)
-- -----------------------------------------------------------------------------
CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    industry_id INT NOT NULL,
    website VARCHAR(255) NULL,
    logo_url VARCHAR(255) NULL,
    description TEXT NULL,
    address VARCHAR(255) NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    hr_name VARCHAR(150) NOT NULL,
    hr_email VARCHAR(191) NOT NULL,
    hr_phone VARCHAR(30) NULL,
    status ENUM('pending', 'approved', 'blacklisted') NOT NULL DEFAULT 'approved',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_companies_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_companies_industry FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE RESTRICT,
    INDEX idx_companies_industry (industry_id),
    INDEX idx_companies_city (city),
    INDEX idx_companies_status (status)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 5: SKILLS (Normalized Technical & Soft Competencies)
-- -----------------------------------------------------------------------------
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    category ENUM('Programming', 'Database', 'Web Development', 'Cloud/DevOps', 'Data Science/AI', 'Mobile', 'Soft Skill', 'Core Engineering') NOT NULL DEFAULT 'Programming',
    description VARCHAR(255) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_skills_category (category)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 6: STUDENTS (Undergraduate & Postgraduate Candidate Profiles)
-- -----------------------------------------------------------------------------
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL,
    batch_year INT NOT NULL,
    current_semester INT NOT NULL DEFAULT 6,
    cgpa DECIMAL(3, 2) NOT NULL,
    phone VARCHAR(30) NULL,
    address TEXT NULL,
    linkedin_url VARCHAR(255) NULL,
    github_url VARCHAR(255) NULL,
    resume_url VARCHAR(255) NULL,
    bio TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_student_cgpa CHECK (cgpa >= 0.00 AND cgpa <= 10.00),
    CONSTRAINT chk_student_semester CHECK (current_semester BETWEEN 1 AND 8),
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_students_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT,
    INDEX idx_students_dept (department_id),
    INDEX idx_students_cgpa (cgpa),
    INDEX idx_students_batch (batch_year)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 7: STUDENT_SKILLS (M:N Junction between Students and Skills)
-- -----------------------------------------------------------------------------
CREATE TABLE student_skills (
    student_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') NOT NULL DEFAULT 'Intermediate',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, skill_id),
    CONSTRAINT fk_studskills_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_studskills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    INDEX idx_studskills_skill (skill_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 8: INTERNSHIPS (Role Postings)
-- -----------------------------------------------------------------------------
CREATE TABLE internships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NULL,
    location VARCHAR(150) NOT NULL,
    work_mode ENUM('On-site', 'Remote', 'Hybrid') NOT NULL DEFAULT 'Hybrid',
    duration_weeks INT NOT NULL DEFAULT 12,
    stipend_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    openings INT NOT NULL DEFAULT 1,
    deadline DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('Draft', 'Open', 'Closed', 'Archived') NOT NULL DEFAULT 'Open',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_internship_openings CHECK (openings >= 1),
    CONSTRAINT chk_internship_duration CHECK (duration_weeks >= 1),
    CONSTRAINT chk_internship_dates CHECK (end_date >= start_date),
    CONSTRAINT fk_internships_company FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_internships_company (company_id),
    INDEX idx_internships_status_deadline (status, deadline),
    INDEX idx_internships_workmode (work_mode),
    INDEX idx_internships_stipend (stipend_amount)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 9: INTERNSHIP_SKILLS (M:N Junction between Internships and Required Skills)
-- -----------------------------------------------------------------------------
CREATE TABLE internship_skills (
    internship_id INT NOT NULL,
    skill_id INT NOT NULL,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (internship_id, skill_id),
    CONSTRAINT fk_intskills_internship FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    CONSTRAINT fk_intskills_skill FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    INDEX idx_intskills_skill (skill_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 10: APPLICATIONS (Transactional Student Applications)
-- -----------------------------------------------------------------------------
CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    internship_id INT NOT NULL,
    status ENUM(
        'Applied',
        'Under Review',
        'Shortlisted',
        'Interview Scheduled',
        'Rejected',
        'Offered',
        'Accepted',
        'Declined',
        'Withdrawn'
    ) NOT NULL DEFAULT 'Applied',
    cover_letter TEXT NULL,
    resume_url VARCHAR(255) NULL,
    notes TEXT NULL,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT uq_student_internship UNIQUE (student_id, internship_id),
    CONSTRAINT fk_apps_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_apps_internship FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    INDEX idx_apps_student (student_id),
    INDEX idx_apps_internship (internship_id),
    INDEX idx_apps_status (status),
    INDEX idx_apps_applied_at (applied_at)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 11: INTERVIEWS (Selection Rounds)
-- -----------------------------------------------------------------------------
CREATE TABLE interviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL,
    round_number INT NOT NULL DEFAULT 1,
    round_type ENUM(
        'Online Assessment',
        'Technical Round 1',
        'Technical Round 2',
        'Managerial Round',
        'HR Round'
    ) NOT NULL DEFAULT 'Technical Round 1',
    scheduled_at DATETIME NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 45,
    location_or_link VARCHAR(255) NOT NULL,
    interviewer_name VARCHAR(150) NULL,
    result ENUM('Scheduled', 'Passed', 'Failed', 'No Show', 'Cancelled') NOT NULL DEFAULT 'Scheduled',
    feedback TEXT NULL,
    rating INT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_interview_rating CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
    CONSTRAINT fk_interviews_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_interviews_app (application_id),
    INDEX idx_interviews_scheduled (scheduled_at),
    INDEX idx_interviews_result (result)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 12: OFFERS (Recruitment Offers Generated for Shortlisted Candidates)
-- -----------------------------------------------------------------------------
CREATE TABLE offers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    application_id INT NOT NULL UNIQUE,
    offer_letter_url VARCHAR(255) NULL,
    stipend_offered DECIMAL(10, 2) NOT NULL,
    benefits_description TEXT NULL,
    joining_date DATE NOT NULL,
    offer_valid_until DATE NOT NULL,
    status ENUM('Issued', 'Accepted', 'Rejected', 'Expired') NOT NULL DEFAULT 'Issued',
    responded_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_offers_app FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    INDEX idx_offers_status (status),
    INDEX idx_offers_validity (offer_valid_until)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 13: INTERNSHIP_RECORDS (Tracked Active/Completed Internships)
-- -----------------------------------------------------------------------------
CREATE TABLE internship_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    offer_id INT NOT NULL UNIQUE,
    student_id INT NOT NULL,
    internship_id INT NOT NULL,
    official_start_date DATE NOT NULL,
    official_end_date DATE NOT NULL,
    supervisor_name VARCHAR(150) NOT NULL,
    supervisor_email VARCHAR(191) NOT NULL,
    status ENUM('Active', 'Completed', 'Terminated', 'Extended') NOT NULL DEFAULT 'Active',
    completion_notes TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_record_dates CHECK (official_end_date >= official_start_date),
    CONSTRAINT fk_records_offer FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE RESTRICT,
    CONSTRAINT fk_records_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_records_internship FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
    INDEX idx_records_student (student_id),
    INDEX idx_records_internship (internship_id),
    INDEX idx_records_status (status)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- Table 14: EVALUATIONS (Performance Appraisal & PPO Recommendations)
-- -----------------------------------------------------------------------------
CREATE TABLE evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    internship_record_id INT NOT NULL UNIQUE,
    evaluated_by VARCHAR(150) NOT NULL DEFAULT 'Company Mentor',
    technical_score INT NOT NULL,
    communication_score INT NOT NULL,
    punctuality_score INT NOT NULL,
    problem_solving_score INT NOT NULL,
    overall_score DECIMAL(3, 2) NOT NULL,
    ppo_offered BOOLEAN NOT NULL DEFAULT FALSE,
    qualitative_feedback TEXT NULL,
    evaluated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_eval_tech CHECK (technical_score BETWEEN 1 AND 5),
    CONSTRAINT chk_eval_comm CHECK (communication_score BETWEEN 1 AND 5),
    CONSTRAINT chk_eval_punct CHECK (punctuality_score BETWEEN 1 AND 5),
    CONSTRAINT chk_eval_prob CHECK (problem_solving_score BETWEEN 1 AND 5),
    CONSTRAINT chk_eval_overall CHECK (overall_score >= 1.00 AND overall_score <= 5.00),
    CONSTRAINT fk_eval_record FOREIGN KEY (internship_record_id) REFERENCES internship_records(id) ON DELETE CASCADE,
    INDEX idx_eval_ppo (ppo_offered),
    INDEX idx_eval_overall (overall_score)
) ENGINE=InnoDB;
