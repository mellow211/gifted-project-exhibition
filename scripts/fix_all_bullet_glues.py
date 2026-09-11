import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

projects = json.load(open(STORE_PATH, encoding='utf-8'))

fixes = []

for p in projects:
    pid = p['id']
    desc = p.get('description') or ''
    if not desc:
        continue
    
    original = desc
    
    if pid == 'p-gyeongbokgung-workbook-519':
        desc = desc.replace('실제 체험 결과가. ', '실제 체험 결과: ')
    elif pid == 'p-smart-robot-990':
        desc = desc.replace('로봇 제작 및 분석가.', '로봇 제작 및 분석:')
    elif pid == 'p-autonomous-car-040':
        desc = (
            "로봇 제작 결과: 서보모터와 센서, 적재 공간을 결합한 2륜 구동 프로토타입 카트를 완성했습니다. "
            "주행 안정성을 위해 후면에 볼 캐스터 바퀴를 장착하고 무게 중심을 후방에 배치하여 부드럽고 안전하게 회전하도록 설계했습니다."
        )
    elif pid == 'p-barrier-free-826':
        desc = desc.replace('보행 상태별 동작 검증 결과가. ', '보행 상태별 동작 검증 결과: ')
    elif pid == 'p-project-787':
        desc = desc.replace('절도범죄 발생시간 조사 결과가. ', '절도범죄 발생시간 조사 결과: ')
    elif pid == 'p-eclipse-simulator-969':
        desc = desc.replace('월식 시뮬레이터 제작과 kNN 학습 결과가. ', '월식 시뮬레이터 제작과 kNN 학습 결과: ')
    elif pid == 'p-photo-classifier-693':
        desc = desc.replace('3개과 정으로', '3개 과정으로')

    if desc != original:
        p['description'] = desc
        fixes.append(f"{pid} [description]: fixed bullet/header glue")

print(f"Fixed {len(fixes)} descriptions:")
for f in fixes:
    print(" -", f)

with open(STORE_PATH, 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)
print(f"Saved to {STORE_PATH}")

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
    print("Failed matching header in sample-projects.ts")
    sys.exit(1)

print("All done!")
