import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

projects = json.load(open(STORE_PATH, encoding='utf-8'))
for p in projects:
    if p['id'] == 'p-smart-robot-990':
        nq = p.get('next_question', '')
        p['next_question'] = nq.replace('수 있으면 있었으면 좋겠습니다.', '수 있었으면 좋겠습니다.')
        print('Updated p-smart-robot-990 next_question:', p['next_question'])

with open(STORE_PATH, 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)

sample_content = open(SAMPLE_PATH, encoding='utf-8').read()
header_match = re.search(r'^(.*?export const SAMPLE_PROJECTS: Project\[\] = )', sample_content, re.DOTALL)
if header_match:
    header = header_match.group(1)
    ts_body = json.dumps(projects, ensure_ascii=False, indent=2)
    new_sample_content = header + ts_body + ";\n"
    with open(SAMPLE_PATH, 'w', encoding='utf-8') as f:
        f.write(new_sample_content)
    print('Synced to sample-projects.ts')
else:
    print('Error matching header')
    sys.exit(1)
