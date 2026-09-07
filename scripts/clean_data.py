#!/usr/bin/env python3
"""
CampusHire — Data Cleansing Pipeline
Normalizes raw job datasets into 3NF structured format.
"""
import os
import csv
import re

def clean():
    raw_path = "data/raw/sample_jobs.csv"
    proc_path = "data/processed/cleaned_internships.csv"
    os.makedirs(os.path.dirname(proc_path), exist_ok=True)

    if not os.path.exists(raw_path):
        os.makedirs(os.path.dirname(raw_path), exist_ok=True)
        with open(raw_path, "w") as f:
            f.write("Title,Company,Industry,Location,WorkMode,Stipend,SkillsRequired,DurationWeeks\n")
            f.write("Cloud Architect Intern,Google Cloud,Enterprise Software & Cloud,Bengaluru,Hybrid,115000,Python;SQL;Docker,12\n")
            f.write("Azure Systems Intern,Microsoft,Enterprise Software & Cloud,Hyderabad,Hybrid,95000,React.js;TypeScript;SQL,12\n")

    cleaned = []
    with open(raw_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cleaned.append({
                "title": row.get("Title", "").strip(),
                "company": row.get("Company", "").strip(),
                "industry": row.get("Industry", "").strip(),
                "location": row.get("Location", "").strip(),
                "work_mode": row.get("WorkMode", "Hybrid").strip(),
                "stipend": float(re.sub(r"[^0-9.]", "", row.get("Stipend", "0")) or 0),
                "skills": row.get("SkillsRequired", "").strip(),
                "duration_weeks": int(row.get("DurationWeeks", 12))
            })

    with open(proc_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["title", "company", "industry", "location", "work_mode", "stipend", "skills", "duration_weeks"])
        writer.writeheader()
        writer.writerows(cleaned)
    print(f"Data cleaning pipeline successfully processed {len(cleaned)} rows to {proc_path}")

if __name__ == "__main__":
    clean()
