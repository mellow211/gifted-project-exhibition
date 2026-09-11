import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

projects = json.load(open(STORE_PATH, encoding='utf-8'))

fixes_applied = []

for p in projects:
    pid = p['id']
    
    # 1. p-eco-quiz-498
    if pid == 'p-eco-quiz-498':
        nq = p.get('next_question', '')
        if nq.startswith('양한'):
            p['next_question'] = nq.replace('양한', '다양한', 1).replace('자유 롭게', '자유롭게')
            fixes_applied.append(f"{pid} [next_question]: 양한 -> 다양한, 자유 롭게 -> 자유롭게")
            
    # 2. p-project-885
    if pid == 'p-project-885':
        mot = p.get('motivation', '')
        if mot.startswith('양한'):
            p['motivation'] = mot.replace('양한', '다양한', 1)
            fixes_applied.append(f"{pid} [motivation]: 양한 -> 다양한")
            
    # 3. p-smart-robot-088
    if pid == 'p-smart-robot-088':
        desc = p.get('description', '')
        if '변수 설정 양한' in desc:
            p['description'] = desc.replace('변수 설정 양한', '변수 설정: 다양한')
            fixes_applied.append(f"{pid} [description]: 변수 설정 양한 -> 변수 설정: 다양한")
            
    # 4. p-project-369
    if pid == 'p-project-369':
        nq = p.get('next_question', '')
        if nq.startswith('양한'):
            p['next_question'] = nq.replace('양한', '다양한', 1).replace('표 현해', '표현해')
            fixes_applied.append(f"{pid} [next_question]: 양한 -> 다양한, 표 현해 -> 표현해")
            
    # 5. p-ant-colony-sim-057
    if pid == 'p-ant-colony-sim-057':
        nq = p.get('next_question', '')
        if '탐색하고다 양한' in nq:
            p['next_question'] = nq.replace('탐색하고다 양한', '탐색하고 다양한')
            fixes_applied.append(f"{pid} [next_question]: 탐색하고다 양한 -> 탐색하고 다양한")

print(f"Fixes applied: {len(fixes_applied)}")
for f in fixes_applied:
    print(" -", f)

# Save to store
with open(STORE_PATH, 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)
print(f"Saved to {STORE_PATH}")

# Sync to sample-projects.ts
sample_content = open(SAMPLE_PATH, encoding='utf-8').read()
header_match = re.search(r'^(.*?export const SAMPLE_PROJECTS: Project\[\] = )', sample_content, re.DOTALL)
if header_match:
    header = header_match.group(1)
    ts_body = json.dumps(projects, ensure_ascii=False, indent=2)
    new_sample_content = header + ts_body + ";\n"
    with open(SAMPLE_PATH, 'w', encoding='utf-8') as f:
        f.write(new_sample_content)
    print(f"Synced {len(projects)} projects into {SAMPLE_PATH}")
else:
    print("Failed to match header in sample-projects.ts")
    sys.exit(1)

print("Finished successfully!")
