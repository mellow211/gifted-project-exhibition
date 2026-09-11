import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

UPDATES = {
    'p-project-704': {
        'motivation': "평소에 보드게임을 하면서 주사위를 던졌을 때 2가 연속으로 4번 나오고 1은 한 번도 안 나와서, 주사위가 정말 공평한지 의문이 생겼습니다. 주사위 눈은 1부터 6까지이므로 각 눈이 나올 수학적 확률은 공평하게 1/6이어야 하는데, 실제로 던졌을 때는 왜 이렇게 특정 숫자가 연속해서 나오는지 궁금했습니다. 던지는 횟수가 적을 때와 많을 때 확률이 어떻게 달라지는지 수학과 코딩으로 직접 증명해보고자 탐구를 시작했습니다.",
        'summary': "실제 주사위 던지기 실험(10회·30회·50회)과 Python 난수 반복 알고리즘을 활용한 대규모 주사위 시뮬레이터를 직접 개발하여, 시행 횟수 증가에 따라 각 눈의 출현율이 이론적 1/6 수학적 확률로 정밀하게 수렴하는 '큰 수의 법칙'을 실증적으로 규명했습니다.",
        'description': "실제 손으로 주사위를 10회, 30회, 50회 던지는 실험과 Python For문·If문·리스트를 활용한 대규모 난수 시뮬레이터(최대 1,000회 이상)를 비교 분석했습니다. 던진 횟수가 적을 때는 특정 눈이 편중되어 불공평해 보이지만, 시행 횟수가 늘어날수록 모든 눈의 출현율이 이론적 1/6(약 16.7%) 확률에 오차 없이 수렴하는 '큰 수의 법칙'을 데이터로 증명했습니다.",
        'reflection': "주사위는 적게 던졌을 때는 불공평해 보이지만, 많이 던질수록 1/6 확률에 가까워지면서 공평해진다는 '큰 수의 법칙'을 직접 코딩과 실험으로 확인했습니다. 일상 속 단순한 보드게임 규칙 속에 숨어 있는 확률과 통계의 수학적 원리를 파이썬 프로그램을 통해 직접 검증하면서 데이터 분석의 즐거움과 신뢰성을 체득했습니다.",
        'next_question': "주사위 1개를 넘어 2개의 주사위 눈의 합이나 동전 던지기 등 다양한 확률 모델에서도 대규모 시뮬레이션을 통해 정규분포와 큰 수의 법칙을 일관되게 검증할 수 있을까?"
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
