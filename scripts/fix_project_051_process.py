import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

projects = json.load(open(STORE_PATH, encoding='utf-8'))

new_processes = [
    {
        "id": "step-1",
        "project_id": "temp",
        "display_order": 1,
        "title": "알고리즘 구성 및 시선 추적 설계",
        "description": "노트북 웹캠 카메라 영상에서 MediaPipe와 OpenCV를 활용해 사용자의 얼굴과 눈동자를 실시간 인식하고, 눈을 뜬 상태에서 눈동자 좌표의 미세한 움직임을 감지하여 정지 시간을 정밀 측정하는 알고리즘을 설계했습니다."
    },
    {
        "id": "step-2",
        "project_id": "temp",
        "display_order": 2,
        "title": "관찰 상태 분류 기준 정의",
        "description": "사용자의 집중 상태를 객관적으로 판정할 수 있도록 Normal(집중), Eye Closed(눈 감음), Fixed Gaze(5초 정지), ALERT(10초 정지), No Face(얼굴 미인식)의 5가지 관찰 상태 기준을 체계적으로 수립했습니다."
    },
    {
        "id": "step-3",
        "project_id": "temp",
        "display_order": 3,
        "title": "실시간 상태 판별 및 경고음 피드백 구현",
        "description": "실시간 영상 프레임에서 눈동자가 5초 이상 정지하면 Fixed Gaze로 주의를 환기하고, 10초 이상 시선 멈춤(멍때림)이 지속되면 ALERT 상태로 전환하여 Pygame을 통해 짧은 경고 알림음을 재생하도록 구현했습니다."
    },
    {
        "id": "step-4",
        "project_id": "temp",
        "display_order": 4,
        "title": "OpenCV 상태 시각화 및 6인 실증 실험",
        "description": "카메라 화면 위에 사용자의 실시간 상태와 누적 정지 시간을 HUD로 직관적으로 표시하고, 6명의 참여자를 대상으로 5분간의 학습 작업을 수행하며 멍때림 감지 정확도와 집중 보조 효과를 정량적으로 실증했습니다."
    }
]

target_found = False
for p in projects:
    if p['id'] == 'p-project-051':
        p['processes'] = new_processes
        target_found = True
        print(f"Updated {p['id']} ({p.get('title')}) processes successfully.")
        break

if not target_found:
    print("Error: p-project-051 not found!")
    sys.exit(1)

with open(STORE_PATH, 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)
print(f"Successfully saved to {STORE_PATH}")

sample_content = open(SAMPLE_PATH, encoding='utf-8').read()
header_match = re.search(r'^(.*?export const SAMPLE_PROJECTS: Project\[\] = )', sample_content, re.DOTALL)
if header_match:
    header = header_match.group(1)
    ts_body = json.dumps(projects, ensure_ascii=False, indent=2)
    new_sample_content = header + ts_body + ";\n"
    with open(SAMPLE_PATH, 'w', encoding='utf-8') as f:
        f.write(new_sample_content)
    print(f"Successfully synchronized {len(projects)} projects into {SAMPLE_PATH}")
else:
    print("Error: Header match failed in sample-projects.ts")
    sys.exit(1)

print("Process update complete!")
