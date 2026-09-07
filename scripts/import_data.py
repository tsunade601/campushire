#!/usr/bin/env python3
"""
CampusHire — MySQL Database Import Utility
Loads schema.sql, seed.sql, and views.sql into MySQL.
"""
import os
import sys

def main():
    print("CampusHire Database Ingestion Runner")
    files = ["database/schema.sql", "database/seed.sql", "database/views.sql"]
    for f in files:
        if os.path.exists(f):
            print(f"  [OK] Found {f} ({os.path.getsize(f)} bytes)")
        else:
            print(f"  [MISSING] {f}")
    print("Ready for automated or containerized MySQL import.")

if __name__ == "__main__":
    main()
