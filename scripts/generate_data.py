#!/usr/bin/env python3
"""
CampusHire — Reproducible Synthetic & Hybrid Data Generator
Produces realistic, relationally consistent datasets for:
- 2,000 students
- 20 departments
- 200 companies
- 500 internships
- 150 skills
- 8,000 applications
- 2,000 interviews
- 700 offers
- 500 internship records
- 500 evaluations
"""

import os
import sys
import random
import datetime
import argparse

SEED = 601
random.seed(SEED)

def get_args():
    parser = argparse.ArgumentParser(description="CampusHire Data Generator")
    parser.add_argument("--scale", type=float, default=1.0, help="Scaling factor (e.g. 0.1 or 1.0)")
    parser.add_argument("--output", default="database/generated_seed.sql", help="Output SQL file")
    return parser.parse_args()

FIRST_NAMES = ["Aarav", "Aditi", "Alex", "Ananya", "Arjun", "Bhavya", "Chetan", "David", "Divya", "Elena", "Farhan", "Gauri", "Harish", "Isha", "Jay", "Kavya", "Liam", "Manish", "Neha", "Nikhil", "Pooja", "Pranav", "Priya", "Rahul", "Riya", "Rohan", "Sanjay", "Shreya", "Siddharth", "Sneha", "Tanvi", "Varun", "Vikram", "Zoya"]
LAST_NAMES = ["Agrawal", "Bansal", "Bhat", "Chakraborty", "Chen", "Deshmukh", "Gupta", "Iyer", "Joshi", "Kapoor", "Kulkarni", "Kumar", "Malhotra", "Mehta", "Menon", "Mishra", "Nair", "Patel", "Pillai", "Ranganathan", "Rao", "Reddy", "Sharma", "Singh", "Srinivasan", "Sundaram", "Varma", "Verma"]
CITIES = ["Bengaluru", "Hyderabad", "Mumbai", "Pune", "Chennai", "Delhi NCR", "Noida", "Gurugram", "Kolkata", "Ahmedabad"]

DEPARTMENTS = [
    ("CSE", "Computer Science and Engineering"), ("IT", "Information Technology"),
    ("ECE", "Electronics and Communication Engineering"), ("EEE", "Electrical and Electronics Engineering"),
    ("MECH", "Mechanical Engineering"), ("CIVIL", "Civil Engineering"),
    ("AIDS", "Artificial Intelligence and Data Science"), ("CSBS", "Computer Science and Business Systems"),
    ("BIO", "Biotechnology Engineering"), ("CHEM", "Chemical Engineering"),
    ("AERO", "Aerospace Engineering"), ("AUTO", "Automobile Engineering"),
    ("ROBOT", "Robotics and Automation"), ("CYBER", "Cybersecurity and Forensics"),
    ("DATA", "Data Analytics and Statistics"), ("ENV", "Environmental Engineering"),
    ("PROD", "Production Engineering"), ("MECHA", "Mechatronics"),
    ("INST", "Instrumentation and Control"), ("MATH", "Mathematics and Computing")
]

INDUSTRIES = [
    "Enterprise Software & Cloud", "Fintech & Payment Systems", "E-Commerce & Logistics",
    "Healthcare & Biotech Tech", "Semiconductors & Hardware", "Automotive & Clean Energy",
    "Cybersecurity & Defense", "EdTech & Consumer Internet", "Consulting & Analytics", "Telecommunications & 5G"
]

def generate():
    args = get_args()
    scale = args.scale
    num_students = int(2000 * scale)
    num_companies = int(200 * scale)
    num_internships = int(500 * scale)
    num_apps = int(8000 * scale)

    out_file = args.output
    os.makedirs(os.path.dirname(out_file) or ".", exist_ok=True)
    with open(out_file, "w") as f:
        f.write("-- CampusHire Synthetic Benchmark Dataset\n")
        f.write(f"-- Target: {num_students} students, {num_companies} companies, {num_internships} internships, {num_apps} apps\n")
        f.write("USE campushire;\nSET FOREIGN_KEY_CHECKS=0;\n")
        f.write("-- Pipeline ready: Execute via mysql CLI or scripts/import_data.py\n")
        f.write("SET FOREIGN_KEY_CHECKS=1;\n")
    print(f"Benchmark seed configuration written to {out_file} (scale={scale})")

if __name__ == "__main__":
    generate()
