import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

UPDATES = {
    'p-project-574': {
        'question': "시력이 안 좋은 것과 청력이 안 좋은 것 중 일상생활에서 어떤 감각의 제약이 더 큰 불편을 줄까? 그리고 이 차이를 컴퓨터 시뮬레이션으로 직접 체험하고 비교할 수 있을까?"
    },
    'p-project-276': {
        'question': "학교 급식 식단표 사진을 AI로 분석하여 점심에 섭취한 영양소를 계산하고, 부족한 필수 영양소를 보완해 주는 최적의 저녁 식단을 추천할 수 있을까?"
    },
    'p-project-704': {
        'question': "실제 주사위와 컴퓨터 난수 주사위를 수만 번 반복 시행했을 때, 모든 눈의 출현 확률이 6분의 1로 공평하게 수렴하는 '큰 수의 법칙'을 실증할 수 있을까?"
    },
    'p-smart-planner-676': {
        'question': "종이 플래너와 직접 개발한 파이썬 디지털 플래너를 실제 학습에 적용했을 때, 학습 계획 달성률과 시간 관리 효율성 측면에서 어떤 방식이 더 효과적일까?"
    },
    'p-game-development-553': {
        'question': "단순히 단어장을 눈으로 외우는 방식에서 벗어나, 파이게임(Pygame) 기반의 인터랙티브 타이핑 게임을 통해 영어 단어 암기 효율과 몰입도를 극대화할 수 있을까?"
    },
    'p-ping-pong-ai-408': {
        'question': "인공지능을 강화학습(Q-러닝)으로 학습시킬 때, 에피소드 반복 횟수가 증가함에 따라 핑퐁 게임의 방어 성공률과 플레이 실력은 어떻게 향상될까?"
    },
    'p-project-051': {
        'question': "웹캠을 통해 학생의 시선과 눈동자 움직임을 실시간 추적하여, 집중이 흐트러지거나 멍때리는 순간을 즉각 감지하고 알려줄 수 있을까?"
    },
    'p-game-development-886': {
        'question': "동일한 게임 규칙을 기반으로 AI가 생성한 코드와 사람이 직접 프로그래밍한 게임을 비교했을 때, 구현 완성도와 플레이 만족도 측면에서 어떤 차이가 나타날까?"
    },
    'p-smart-robot-767': {
        'question': "컬러 센서를 장착한 자율주행 로봇이 병원 복도의 유도 라인을 따라 약품을 지정된 병실로 안전하게 자동 배송할 수 있을까?"
    }
}

# 1. Update data/projects-store.json
print("Loading store...")
projects = json.load(open(STORE_PATH, encoding='utf-8'))
updated_store_count = 0

for p in projects:
    pid = p['id']
    if pid in UPDATES:
        up = UPDATES[pid]
        for k, v in up.items():
            p[k] = v
        updated_store_count += 1

with open(STORE_PATH, 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)
print(f"Updated {updated_store_count} projects in {STORE_PATH}")

# 2. Update data/sample-projects.ts
print("Updating sample-projects.ts...")
sample_content = open(SAMPLE_PATH, encoding='utf-8').read()

header_match = re.search(r'^(.*?export const SAMPLE_PROJECTS: Project\[\] = )', sample_content, re.DOTALL)
if header_match:
    header = header_match.group(1)
    ts_body = json.dumps(projects, ensure_ascii=False, indent=2)
    new_sample_content = header + ts_body + ";\n"
    with open(SAMPLE_PATH, 'w', encoding='utf-8') as f:
        f.write(new_sample_content)
    print(f"Successfully serialized all {len(projects)} projects into {SAMPLE_PATH}")
else:
    print("Could not find SAMPLE_PROJECTS array pattern in sample-projects.ts!")

print("All done!")
