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
    
    # 1. p-smart-robot-990 (the main reported issue)
    if pid == 'p-smart-robot-990':
        nq = p.get('next_question', '')
        # Fix '다 음에는' -> '다음에는', and smooth ending
        if '다 음에는' in nq:
            new_nq = nq.replace('다 음에는', '다음에는')
            if new_nq.endswith('좋겠음.'):
                new_nq = new_nq[:-4] + '있었으면 좋겠습니다.'
            p['next_question'] = new_nq
            fixes_applied.append(f"{pid} [next_question]: '다 음에는' -> '다음에는'")
            
        ref = p.get('reflection', '')
        if '사용함다.' in ref or '만들 수 있음 스파이크' in ref:
            ref = ref.replace('사용함다.', '사용하였습니다.')
            ref = ref.replace('만들 수 있음 스파이크', '만들 수 있음을 확인했습니다. 스파이크')
            ref = ref.replace('동작함을 보임.', '동작함을 입증했습니다.')
            p['reflection'] = ref
            fixes_applied.append(f"{pid} [reflection]: grammar & spacing cleaned")
            
    # 2. Fix other spacing artifacts in reflection/next_question
    for f in ['reflection', 'next_question', 'motivation', 'summary', 'description']:
        val = p.get(f) or ''
        if not isinstance(val, str):
            continue
        original = val
        val = re.sub(r'다\s+음에는', '다음에는', val)
        val = re.sub(r'프로\s+그램', '프로그램', val)
        val = re.sub(r'개\s+선', '개선', val)
        if val != original:
            p[f] = val
            fixes_applied.append(f"{pid} [{f}]: fixed spacing artifact")

print(f"Applied {len(fixes_applied)} fixes:")
for f in fixes_applied:
    print(" -", f)

# Save store
with open(STORE_PATH, 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)
print(f"Saved to {STORE_PATH}")

# Sync sample-projects.ts
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

print("Spacing fix finished!")
