import json

# Load projects
with open('data/projects-store.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

SUMMARY_UPDATES = {
    'p-ship-survival-ai-530': {
        'summary': "지난 300년간 발생한 18개 주요 선박 사고의 승객 15,000명 빅데이터를 분석하여, 성별·나이·승무원 여부·동승자 유무에 따른 생존 요인(factor)을 도출하고 머신러닝 로지스틱 회귀 모델을 통해 개인별 생존 확률을 예측하는 AI 시스템을 개발했습니다.",
        'motivation': "선박 사고는 자동차 사고보다 발생 빈도는 낮지만, 한 번 발생하면 대형 참사로 이어지기 쉽습니다. 만약 개인별 생존률을 사전에 과학적으로 예측할 수 있다면, 위급 상황 발생 시 취약 계층을 우선 대피시키고 최적의 구조 순서를 결정하여 소중한 생명을 더 많이 구할 수 있다는 생각에서 탐구를 시작했습니다."
    },
    'p-waste-sorting-robot-543': {
        'summary': "레고 스파이크 프라임 키트와 컬러·거리 센서를 활용하여 쓰레기를 직접 탐색하고 수거한 뒤, 재활용 종류별로 자동 분류하여 분리수거 효율을 높이는 스마트 환경 로봇 '배달의 로봇'을 개발했습니다."
    },
    'p-safety-helper-073': {
        'summary': "노약자와 보행 약자의 안전한 실내 이동을 지원하기 위해, 컬러 센서로 바닥의 유도 경로를 스스로 추종하고 초음파 센서로 전방 장애물을 회피하며 비상 정지 버튼을 갖춘 자율주행 휠체어 시스템을 구현했습니다."
    },
    'p-fire-escape-robot-398': {
        'summary': "화재 발생 시 골든타임을 확보하기 위해 컬러 센서로 불꽃을 즉시 감지하고, 유독가스를 차단하는 접이식 대피 튜브를 자동 전개하여 안전한 탈출로를 안내하는 스마트 화재 대피 로봇을 개발했습니다."
    },
    'p-water-fountain-980': {
        'summary': "탁도 센서로 실시간 수질 상태를 모니터링하고, 인체 감지 센서 및 서보모터와 연동된 자동 개폐 위생 덮개와 UV 살균 램프를 장착하여 누구나 안심하고 이용할 수 있는 스마트 위생 음수대를 제작했습니다."
    },
    'p-project-787': {
        'summary': "공공 통계 데이터를 기반으로 절도 범죄의 시간대별 발생 특성을 분석하고, 조도 센서로 주변 조도를 실시간 감지하여 어두워지면 자동으로 출입문 락을 체결하는 아두이노 스마트 방범 시스템을 개발했습니다."
    },
    'p-project-398': {
        'summary': "화재 현장 진입 전 소방관의 생명을 보호하기 위해 아두이노 UNO, LM35 온도 센서, MQ-2 유해가스 센서, 블루투스 모듈을 내열 캡슐에 탑재하여 현장 내부 위험 데이터를 무선으로 실시간 전송하는 세이프티 캡슐을 개발했습니다."
    },
    'p-gyeongbokgung-workbook-519': {
        'summary': "종이 워크북의 휴대성과 채점 불편을 해소하기 위해, 경복궁 주요 전각별 역사 퀴즈와 현장 미션을 풀고 점수와 해설을 모바일에서 즉시 확인할 수 있는 Python Tkinter 대화형 디지털 워크북을 개발했습니다."
    },
    'p-pet-care-423': {
        'summary': "바쁜 가족 구성원 간에 반려견의 식사, 간식, 산책 여부를 원클릭으로 공유하여 중복 급여를 방지하고 일일 돌봄 기록과 특이사항 메모를 한눈에 관리하는 Python Tkinter 데스크톱 프로그램을 구현했습니다."
    },
    'p-pet-care-378': {
        'summary': "최근 3개년 31만 건의 유기동물 공공데이터를 전처리하고 머신러닝 분류 모델을 구축하여, 품종·체중·성별·구조지역 등 특성에 따른 구조견의 입양 가능성을 예측하고 안락사 방지를 위한 맞춤형 관리 방안을 도출했습니다."
    },
    'p-project-051': {
        'summary': "웹캠을 통해 학습자의 얼굴과 시선 위치를 컴퓨터 비전으로 실시간 추적하고, 눈동자 정지 시간과 이탈 패턴을 측정하여 집중력이 흐트러졌을 때 즉각 시각·청각 알림을 제공하는 집중력 보조 프로그램을 개발했습니다."
    },
    'p-project-315': {
        'summary': "학생들의 학업 일정과 과제 마감을 체계적으로 관리할 수 있도록, 파이썬 기초 문법과 파일 입출력, 예외 처리 방어 로직을 적용하여 프로그램 재실행 시에도 데이터가 영구 보존되는 안정적인 학업 관리 소프트웨어를 구현했습니다."
    },
    'p-emotion-diary-340': {
        'summary': "공부 전후의 기분 상태와 과목별 학습 시간, 집중도를 복합 기록·분석하여 감정과 학습 효율 간의 상관관계를 시각화하고, 자기주도학습을 위한 맞춤형 감정 조절 피드백을 제공하는 인터랙티브 다이어리 프로그램을 개발했습니다."
    },
    'p-project-250': {
        'summary': "복잡한 외부 딥러닝 라이브러리에 의존하지 않고 파이썬 순수 기본 문법만으로 Q-Learning 강화학습 알고리즘을 직접 구현하여, 보상 체계와 상태 변화에 따라 AI 에이전트가 최단 탈출 경로를 스스로 학습하는 미로 시뮬레이터를 개발했습니다."
    },
    'p-smart-robot-790': {
        'summary': "손가락 근력이 약하거나 손이 불편한 학습자를 돕기 위해, 자이로 센서와 펜 거치 휠 메커니즘을 결합하여 손의 미세한 움직임을 감지하고 단계별 난이도에 맞춰 바른 글씨 쓰기를 유도하는 스마트 훈련 로봇을 제작했습니다."
    },
    'p-project-785': {
        'summary': "바쁜 등교 및 대중교통 탑승 시 교통카드를 찾지 못해 발생하는 시간 지연을 예방하기 위해, 버튼 조작이나 스마트폰 호출 시 부저와 LED로 위치를 즉시 알려주는 아두이노 스마트 위치 알림 카드지갑을 제작했습니다."
    },
    'p-game-development-886': {
        'summary': "생성형 AI와 인간 개발자가 각각 동일한 기획으로 파이썬 텍스트 어드벤처 게임을 직접 제작한 뒤, 코드 구조, 완성도, 개발 효율성, 플레이 만족도를 다각도로 정량 비교 분석한 실증 연구를 수행했습니다."
    },
    'p-kickboard-safety-073': {
        'summary': "청소년의 무면허 전동 킥보드 탑승 사고를 사전에 차단하기 위해, 면허증 등록 여부와 진위 확인 알고리즘을 거쳐야만 킥보드 락이 해제되는 실시간 면허 인증 방어 시스템 프로그램을 구축했습니다."
    },
    'p-project-793': {
        'summary': "대전 주요 공공기관 및 전국 교육 프로그램의 신규 공고와 비정형 포스터 이미지를 멀티모달 AI로 실시간 수집·분석하여, 놓치기 쉬운 유익한 학생 교육 기회를 한눈에 확인하고 지원할 수 있는 반응형 웹 알림 서비스를 완성했습니다."
    },
    'p-photo-classifier-693': {
        'summary': "Google Colab 환경에서 Python과 TensorFlow 전이학습(MobileNetV2)을 활용하여, 대량의 일상 사진을 사용자가 원하는 카테고리별로 즉석 학습시키고 높은 정확도로 자동 분류·정리하는 스마트 딥러닝 사진 분류 시스템을 구현했습니다."
    }
}

count = 0
for p in projects:
    pid = p['id']
    if pid in SUMMARY_UPDATES:
        updates = SUMMARY_UPDATES[pid]
        if 'summary' in updates:
            p['summary'] = updates['summary']
        if 'motivation' in updates:
            p['motivation'] = updates['motivation']
        count += 1

print(f"Updated {count} projects summary & motivation.")

# Save data/projects-store.json
with open('data/projects-store.json', 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)

print("Saved data/projects-store.json")

# Sync data/sample-projects.ts
ts_content = f"""import {{ Project }} from "@/types/project";

export const SAMPLE_PROJECTS: Project[] = {json.dumps(projects, ensure_ascii=False, indent=2)};

export const sampleProjects = SAMPLE_PROJECTS;
"""

with open('data/sample-projects.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Synchronized data/sample-projects.ts")
