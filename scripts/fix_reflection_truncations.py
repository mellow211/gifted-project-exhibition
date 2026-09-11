import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

STORE_PATH = 'data/projects-store.json'
SAMPLE_PATH = 'data/sample-projects.ts'

UPDATES = {
    'p-pet-care-378': {
        'reflection': "공공데이터를 수집하고 전처리하는 과정이 예상했던 것보다 훨씬 많은 시간과 정밀함을 필요로 했습니다. 단순한 코딩 작업 자체보다 무엇을, 왜, 어떻게 분석할 것인지 계획하고 모델을 결정하는 과정이 훨씬 중요하다는 것을 깨달았습니다. 특히 생성형 AI(GPT)와의 협업을 통해 최적의 랜덤포레스트 모델을 선정하고 Streamlit 어플 구조와 실행 코드를 체계적으로 완성할 수 있었습니다.",
        'growth': "20만 건이 넘는 실제 유기견 공공데이터를 정제하고 머신러닝 모델을 평가하면서 실전 데이터 과학의 전 과정을 체득했습니다. 또한 데이터의 나이·체중·지역 변수를 더 세분화하면 예측 정밀도를 더욱 높일 수 있다는 점을 파악하여, 기술을 통해 생명을 살리는 실질적인 사회 문제 해결 역량과 탐구 시야를 크게 확장했습니다."
    },
    'p-safety-helper-988': {
        'reflection': "스파이크 프라임의 초음파 센서와 힘 센서를 활용하여 속도별 안전 제동 거리를 제어하는 실험을 진행했습니다. 고속 주행 시 센서 인식 지연으로 인해 정지하지 못하고 충돌하는 한계를 경험하며, 복잡한 제어 로직을 함수 단위로 모듈화하고 센서 반응 감도를 세밀하게 튜닝하는 것이 자율주행 안전에 얼마나 중요한지 깊이 배웠습니다.",
        'growth': "반복적인 주행 충돌 실험을 통해 운전자의 시선 이탈 경고음과 감속 로직을 추가하며 다중 안전 시스템의 필요성을 체득했습니다. 제어 알고리즘의 예외 상황을 고려하고 충돌 방지 정확도를 단계별로 끌어올리는 SW·HW 융합 문제 해결 역량을 키웠습니다."
    },
    'p-project-941': {
        'reflection': "아두이노 우노와 3축 자이로 센서를 결합한 모션 펜 하드웨어를 제작하고, 시리얼 통신으로 파이썬 화면에 궤적 좌표를 실시간 드로잉하는 전체 파이프라인을 구현했습니다. 센서 데이터의 떨림과 노이즈를 보정하고 사용자가 쥐기 편한 외형 케이스를 설계하면서, 하드웨어와 소프트웨어를 유기적으로 융합하는 개발 프로세스를 체득했습니다.",
        'growth': "단순한 이론 조사를 넘어 3차원 공간 모션 인식 장치를 손수 설계하고 파이썬 그래픽 인터페이스와 연결하는 전 과정을 스스로 디버깅하며 완성했습니다. 센서 오차 보정과 사용자 편의성을 고려한 외형 개선 등 실용적인 창작 소프트웨어 개발의 자신감을 얻었습니다."
    },
    'p-game-development-886': {
        'reflection': "동일한 게임 알고리즘을 바탕으로 직접 구현한 게임과 AI가 생성한 코드를 친구들과 비교 체험해 보았습니다. AI를 활용하면 개발 속도가 빠르지만 세밀한 배경음악 설정이나 독창적인 규칙 추가에는 사람이 직접 설계하는 것이 훨씬 높은 만족도를 준다는 점을 배웠습니다. 또한 AI에게 구체적인 피드백을 반복하여 체력바 시스템 등의 한계를 단계별로 보완해 나가는 협업 프로세스를 익혔습니다.",
        'growth': "AI 도구의 장점과 한계를 비판적으로 검증하고 사용자의 피드백을 반영하여 게임성을 개선하는 사용자 중심 개발 태도를 길렀습니다. 사람이 기획하는 창의적 요소와 AI의 신속한 코드 생성 능력을 결합했을 때 최상의 시너지를 낼 수 있음을 깨달았습니다."
    },
    'p-vocab-learner-229': {
        'reflection': "OpenCV 이미지 전처리와 EasyOCR 딥러닝 라이브러리를 결합하여 단어장 사진에서 텍스트와 바운딩 박스 좌표를 정밀하게 추출하는 시스템을 구현했습니다. 무작위로 추출되는 노이즈 텍스트를 동일 행 좌표 기준으로 정렬하고 정규표현식으로 불필요한 기호를 필터링하는 전처리 과정을 거치며 실전 컴퓨터 비전과 데이터 정제 기술을 깊이 체득했습니다.",
        'growth': "다양한 교재의 폰트와 인쇄 상태에 따라 발생하는 OCR 인식 오류를 진단하고, 번역 검증 및 유사 자모 오인 방지 알고리즘을 모색하면서 실제 사용자의 불편을 해소하는 실용적 소프트웨어 엔지니어링 역량을 크게 함양했습니다."
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
        if 'reflection' in up:
            p['reflection'] = up['reflection']
        if 'growth' in up:
            p['growth'] = up['growth']
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
