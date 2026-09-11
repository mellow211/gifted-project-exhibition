import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

projects = json.load(open(STORE_PATH, encoding='utf-8'))

for p in projects:
    if p['id'] == 'p-waste-sorting-robot-543':
        p['motivation'] = (
            "우리는 생활 속에서 매일 많은 쓰레기를 버리지만, 제대로 분리되지 않은 쓰레기는 다시 분류해야 하므로 많은 시간과 노력이 소모됩니다. "
            "특히 환경미화원분들이 제대로 분리되지 않은 쓰레기를 일일이 다시 정리하는 모습을 보며 분리수거를 더 편리하게 도울 방법을 고민했습니다. "
            "이에 레고 스파이크 프라임의 거리 센서와 컬러 센서를 활용해 쓰레기를 스스로 발견하고 집어서 알맞은 곳까지 가져다주는 '배달의 로봇'을 제작하게 되었습니다."
        )
        p['description'] = (
            "물체를 초음파 센서로 감지하고 집게로 집어 이동하며 색을 구별하는 '배달의 로봇'을 완성했습니다. "
            "제작 과정에서 집게 크기를 키우자 물체 파지는 개선되었으나 무게 중심이 앞으로 쏠리는 문제가 발생하여, "
            "후면에 부품을 추가해 무게 균형을 맞추고 집게 작동 각도를 45도로 최적화하여 안정적인 이송 구조를 구현했습니다."
        )
        p['reflection'] = (
            "레고 스파이크 프라임의 센서와 모터를 활용하여 쓰레기를 감지하고 집어서 이동하며 색을 구별하는 '배달의 로봇'을 제작했습니다. "
            "제작 과정에서 연결선 간섭, 집게 크기와 각도, 무게 중심 등의 문제를 겪으며 구조와 코드를 보완했고, "
            "로봇은 구조, 무게, 센서, 모터와 프로그램이 유기적으로 영향을 주고받으며 작동한다는 것을 배웠습니다."
        )
        p['next_question'] = (
            "분리수거함의 뚜껑을 여는 기능까지는 구현하지 못하였다. "
            "앞으로 집게를 더 가볍고 안정적인 구조로 개선하고, "
            "다양한 크기와 모양의 물체를 이용하여 작동 상태를 확인해 보고 싶다."
        )
        print("Updated p-waste-sorting-robot-543 successfully.")

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
