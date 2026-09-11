import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

projects = json.load(open(STORE_PATH, encoding='utf-8'))

for p in projects:
    if p['id'] == 'p-project-885':
        p['motivation'] = (
            "다양한 기존 러닝 앱에서는 자신이 달린 거리나 소모한 칼로리, 지나온 길 등의 기록 위주 정보만을 주로 제공합니다. "
            "그러나 이러한 앱은 이미 달린 경로만 보여주기 때문에 매번 비슷한 코스만 달리게 되어 운동이 지루해지기 쉽고, "
            "개인의 체력이나 운동 목표에 딱 맞는 새로운 코스를 직접 찾는 것도 번거롭습니다. "
            "이에 러너의 출발 위치와 희망 거리, 달리기 페이스에 맞춘 최적의 새로운 러닝 코스를 자동으로 추천하고 "
            "지도에 시각화해 주는 프로그램을 개발하고자 탐구를 시작했습니다."
        )
        p['summary'] = (
            "기존 러닝 앱의 단순 기록 한계를 넘어, 러너의 출발 위치, 희망 거리, 달리기 페이스를 종합 반영하여 "
            "지오코딩과 지도 연동으로 개인 맞춤형 최적 러닝 코스를 카드 형태로 추천하고 비교해 주는 스마트 러닝 코칭 프로그램을 개발했습니다."
        )
        p['next_question'] = (
            "구글 지도에 추천 경로 전체를 자동 전달하여 안내하는 내비게이션 기능을 보완하고, "
            "웹/모바일 앱 프레임워크와 실시간 GPS 위치 정보를 연동하여 야외 러닝 시 즉각 활용할 수 있는 러닝 코칭 서비스로 확장할 수 있을까?"
        )
        print("Updated p-project-885 successfully.")

    if p['id'] == 'p-project-574':
        p['reflection'] = (
            "단순한 호기심에서 출발하여 시각과 청각 제한 시뮬레이터를 엔트리로 직접 제작했습니다. "
            "파이썬에서 배운 반복문과 조건문 알고리즘을 블록 코딩으로 구현하며 다양한 감각 제약 환경을 시각화해 보았고, "
            "직접 프로그램을 테스트해 보면서 잘 보이지 않는 상황이 답답함과 불편함을 크게 유발한다는 점을 체감할 수 있었습니다."
        )
        p['next_question'] = (
            "시각과 청각 외에도 촉각이나 후각 등 다양한 감각 제한 요소를 복합적으로 추가하고, "
            "실제 일상 미션 수행 성공률을 정량적으로 측정하여 비교할 수 있는 시뮬레이션으로 확장해 보면 어떨까?"
        )
        print("Updated p-project-574 successfully.")

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
