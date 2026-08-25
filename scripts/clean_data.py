"""Data ingestion stage placeholder for public job feeds: validates and normalizes fields before import."""
import csv, pathlib
src=pathlib.Path('data/raw'); dst=pathlib.Path('data/processed'); dst.mkdir(exist_ok=True)
for file in src.glob('*.csv'):
 with file.open() as f: rows=list(csv.DictReader(f))
 clean=[{k:(v or '').strip() for k,v in r.items()} for r in rows]
 with (dst/file.name).open('w',newline='') as f:
  if clean:
   w=csv.DictWriter(f,fieldnames=clean[0]);w.writeheader();w.writerows(clean)
print('Cleaned raw CSV files into normalized staging files.')
