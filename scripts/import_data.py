"""Import stage: run schema.sql and seed.sql first; generated CSVs are staging inputs.
A production ETL job can map these rows to users/students with parameterized inserts.
"""
print('Import contract: MySQL init scripts load database/schema.sql and database/seed.sql.')
