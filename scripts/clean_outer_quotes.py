import json
import re

store_path = 'data/projects-store.json'
with open(store_path, 'r', encoding='utf-8') as f:
    projects = json.load(f)

for p in projects:
    if p.get('question'):
        p['question'] = re.sub(r'^[“"\'‘]+|[”"\'’]+$', '', p['question']).strip()
    if p.get('next_question'):
        p['next_question'] = re.sub(r'^[“"\'‘]+|[”"\'’]+$', '', p['next_question']).strip()

with open(store_path, 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)

ts_path = 'data/sample-projects.ts'
with open(ts_path, 'w', encoding='utf-8') as f:
    f.write(f"import {{ Project }} from '@/types/project';\n\nexport const SAMPLE_PROJECTS: Project[] = {json.dumps(projects, ensure_ascii=False, indent=2)};\n")

print("Cleaned quotes in all 83 projects successfully!")
