import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

projects = json.load(open(STORE_PATH, encoding='utf-8'))

for p in projects:
    if p['id'] == 'p-autonomous-car-040':
        p['motivation'] = (
            "대형 마트에서 부모님 대신 카트를 직접 끌고 다니다 보면 두 손이 묶여 자유롭게 장을 보거나 시식을 즐기기 어렵고, "
            "장애인이나 노약자에게도 무거운 카트를 계속 미는 일은 큰 부담이 됩니다. "
            "이에 사용자의 위치와 거리를 감지하여 자동으로 안전하게 뒤따라오는 추종 자율주행 마트 카트를 제작하여 "
            "장보기의 편의성과 즐거움을 높이고자 탐구를 시작했습니다."
        )
        p['reflection'] = (
            "초음파 센서만 사용하여 추종 로봇을 만드는 것은 매우 힘들고, 정확도에 한계가 있다는 점을 뼈저리게 깨달았습니다. "
            "센서 하나에 의존하기보다 다양한 복합 센서의 융합과 정밀한 타이밍 제어가 자율주행의 핵심 기술임을 배웠습니다."
        )
        p['next_question'] = (
            "초음파 센서의 한계를 넘어 LiDAR 센서와 카메라 비전을 추가하고, "
            "마트 안의 복잡한 진열대와 보행자 장애물을 유연하게 회피하며 주행할 수 있는 고정밀 자율주행 카트로 발전시킬 수 있을까?"
        )
        print("Updated p-autonomous-car-040 successfully.")

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
    print("Header match failed in sample-projects.ts")
    sys.exit(1)

print("Update complete!")
