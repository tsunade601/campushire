"""Reproducible synthetic transactional data generator.
Writes CSV inputs for the normalized loader; no claims of real student data are made.
"""
import csv, random, pathlib
from datetime import date,timedelta
random.seed(601)
out=pathlib.Path('data/processed');out.mkdir(parents=True,exist_ok=True)
names=['Aarav Mehta','Maya Shah','Kabir Rao','Ira Sen','Vihaan Das','Anaya Iyer']
with (out/'students.csv').open('w',newline='') as f:
 w=csv.writer(f);w.writerow(['full_name','email','roll_number']);
 for i in range(1,201): w.writerow([random.choice(names)+f' {i}',f'student{i}@campushire.edu',f'CH{2026+i:04d}'])
with (out/'README.txt').open('w') as f:f.write('Generated with Python random seed 601. Transactional records are intentionally synthetic.\n')
print('Generated 200 reproducible student seed rows in data/processed/')
