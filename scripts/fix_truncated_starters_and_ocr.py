import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

UPDATES = {
    'p-ping-pong-ai-408': {
        'motivation': "바둑, 체스, 비디오 게임처럼 사람이 오래 연습해야 잘하게 되는 일을 요즘은 인공지능(AI)이 해낸다. 이런 AI의 상당수는 '강화학습'으로 만들어진다. 강화학습은 정답을 알려 주지 않고 잘하면 보상을 주고 못하면 벌을 주는 것만으로 AI가 스스로 최적의 행동 방법을 찾아내게 하는 학습 방식이다. 이에 인공지능을 얼마나 오래 학습시켜야 핑퐁 게임을 잘 칠 수 있을지 직접 실증해보고자 탐구를 시작했다.",
        'reflection': "Q-러닝 강화학습에서 에피소드 학습량이 증가함에 따라 패들의 방어 성공률이 계단식으로 급격히 상승(1,000~2,000회 구간)한 뒤 안정화되는 수렴 과정을 관찰했습니다. 보상 설계와 상태 테이블(Q-Table) 크기가 인공지능의 학습 효율과 경기 성능에 미치는 영향을 데이터로 확인하며 강화학습의 핵심 원리를 깊이 체득했습니다.",
        'next_question': "상대 봇의 난이도를 다양화하고 딥러닝 기반 DQN 알고리즘을 도입한다면 공의 회전과 불규칙 바운드 상황에서도 적응하여 승률을 높일 수 있을까?"
    },
    'p-smart-robot-894': {
        'summary': "고령층이 식당 테이블 오더 사용 시 화면을 보기 위해 몸과 고개를 비틀어야 하는 불편을 해소하기 위해, 초음파 거리 측정 센서와 연속 감지 알고리즘을 기반으로 착석한 사용자의 위치(20°~60°)를 스스로 인식하여 화면이 사용자를 향해 부드럽게 회전한 뒤 정지하는 지능형 테이블 오더 로봇을 개발했습니다."
    },
    'p-gyeongbokgung-workbook-519': {
        'next_question': "경복궁뿐만 아니라 창덕궁, 국립중앙박물관, 과학관 등 다양한 현장 체험학습 장소로 확장하고, GPS 위치 기반 미션 안내 및 사진 인증 기능을 추가하여 더욱 입체적인 에듀테인먼트 워크북으로 발전시킬 수 있을까?"
    },
    'p-project-051': {
        'reflection': "노트북 웹캠과 OpenCV, MediaPipe를 활용하여 얼굴과 눈동자 좌표를 실시간 추적하고, 10초 이상 눈동자 멈춤(멍때림) 감지 시 Pygame으로 경고음을 재생하는 집중력 케어 프로그램을 개발했습니다. 6명의 참여자를 대상으로 실험하며 시선 인식 정확도와 적정 알림 임계값 설정의 중요성을 체득했습니다."
    },
    'p-drowsiness-prevention-291': {
        'next_question': "운전자 체형별 고개 숙임 각도와 지속시간의 최적 임계값을 세분화하고, 단순 기울기뿐 아니라 기울어지는 가속도와 반복적인 끄덕임 패턴을 복합 분석하여 졸음 감지 정확도를 더욱 높일 수 있을까?"
    },
    'p-smart-robot-790': {
        'next_question': "스파이크 프라임의 기본 센서를 넘어 고정밀 자이로 센서와 다관절 모터를 장착하고 필기 압력 감지 로직을 추가하여, 학생의 손글씨 궤적을 실시간으로 교정해 주는 고급 글쓰기 훈련 로봇으로 고도화할 수 있을까?"
    },
    'p-emotion-diary-340': {
        'next_question': "PC 콘솔 환경을 넘어 스마트폰 모바일 앱으로 확장하고, 친구들과 주간 기분 변화 및 학습 패턴 통계를 공유·비교할 수 있는 다중 사용자 감정 케어 플랫폼을 구축할 수 있을까?"
    },
    'p-project-941': {
        'next_question': "자이로 센서의 3차원 기울기뿐만 아니라 모션 펜 끝의 가속도와 압력 센서를 융합하여 선의 굵기와 입체적인 3D 공간 드로잉까지 지원하는 차세대 에어 스케치 시스템으로 발전시킬 수 있을까?"
    },
    'p-smart-robot-389': {
        'next_question': "바닥 라인 추종 방식을 넘어 AI 비전 카메라와 자율주행 SLAM 라이다를 탑재한다면 복잡한 미술관 공간에서도 관람객의 이동 동선에 맞춰 유연하게 작품을 안내할 수 있을까?"
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
