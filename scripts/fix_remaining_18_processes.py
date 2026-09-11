import json

# Load projects
with open('data/projects-store.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

REMAINING_UPDATES = {
    'p-smart-planner-676': [
        {
            "id": "step-1",
            "project_id": "p-smart-planner-676",
            "title": "자료 조사 및 Tkinter GUI 학습",
            "description": "Python 교재와 자료를 참고하여 Tkinter 라이브러리를 활용한 학습 플래너 GUI 인터페이스 구현 방법을 학습함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-smart-planner-676",
            "title": "디지털 플래너 GUI 프로그램 제작",
            "description": "Python Tkinter를 활용하여 과목 선택, 공부 계획·실천 기록, 결과 확인 기능이 포함된 데스크톱 플래너를 제작함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-smart-planner-676",
            "title": "종이 플래너와 비교 사용 실험",
            "description": "디지털 플래너와 동일한 항목의 종이 플래너를 병행 사용하여 계획 달성률과 시간 관리 효율을 정량 비교함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-smart-planner-676",
            "title": "플래너 데이터 구조 및 저장 설계",
            "description": "일별 공부 기록을 날짜별 파일(txt)로 자동 분할 저장하고 불러올 수 있도록 데이터 저장 구조를 설계함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-smart-planner-676",
            "title": "사용자 피드백 반영 및 기능 개선",
            "description": "날짜별 기록 구분과 누적 통계 확인이 용이하도록 UI를 개선하고 계획 관리 기능을 고도화함.",
            "display_order": 5
        }
    ],

    'p-vocab-learner-163': [
        {
            "id": "step-1",
            "project_id": "p-vocab-learner-163",
            "title": "단어장 수집 및 최소 기능(MVP) 정의",
            "description": "파이썬 공식 문서를 참고하고 필수 영어 단어 데이터를 수집하여 단어 퀴즈에 필요한 최소 기능 요구사항을 도출함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-vocab-learner-163",
            "title": "조건문·반복문 기반 단어 퀴즈 프로그램 코딩",
            "description": "파이썬의 조건문과 반복문을 활용하여 단어 출제, 사용자 입력, 정답 판정 알고리즘을 작성함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-vocab-learner-163",
            "title": "정답 판정 및 오답 노트 재도전 기능 구현",
            "description": "오답을 별도로 수집하여 틀린 단어만 모아서 다시 푸는 복습 알고리즘을 구현함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-vocab-learner-163",
            "title": "오답 학습 전후 성취도 비교 검증",
            "description": "1차 점수와 오답 재도전 후 2차 점수를 정량 비교하여 단어 학습 프로그램의 실질적 성취도 향상 효과를 확인함.",
            "display_order": 4
        }
    ],

    'p-game-development-521': [
        {
            "id": "step-1",
            "project_id": "p-game-development-521",
            "title": "모험 스토리 및 스테이지 흐름 기획",
            "description": "숲에서 야생 몬스터를 만나 배틀하고 마지막 보스를 이기는 전체 모험 스토리와 게임의 기본 규칙을 기획함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-game-development-521",
            "title": "시작 포켓몬별 능력치 및 밸런스 설정",
            "description": "플레이어가 전략적으로 캐릭터를 선택할 수 있도록 세 마리 포켓몬의 체력(HP)과 공격력을 다르게 설정함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-game-development-521",
            "title": "야생 몬스터 랜덤 조우 및 전투 시스템",
            "description": "랜덤 모듈을 활용하여 구구, 캐터피, 꼬렛 등 야생 몬스터가 무작위 체력과 공격력을 가지고 출현하도록 코딩함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-game-development-521",
            "title": "확률 기반 몬스터볼 포획 기능 구현",
            "description": "단순 공격 외에 야생 몬스터의 남은 체력이 낮을수록 포획 성공 확률이 높아지는 몬스터볼 투척 기능을 구현함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-game-development-521",
            "title": "최종 보스 배틀 및 승리 연출 완성",
            "description": "포획한 동료 포켓몬들과 함께 마지막 라이벌에게 도전하여 승리하는 엔딩 시퀀스를 완성함.",
            "display_order": 5
        }
    ],

    'p-gyeongbokgung-workbook-519': [
        {
            "id": "step-1",
            "project_id": "p-gyeongbokgung-workbook-519",
            "title": "경복궁 역사 및 주요 전각 자료 조사",
            "description": "초등 사회 교과서와 국가유산포털 자료를 기반으로 경복궁의 주요 전각 역사와 관람 포인트를 체계적으로 정리함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-gyeongbokgung-workbook-519",
            "title": "관람객 맞춤형 퀴즈 및 미션 문항 개발",
            "description": "초등학생이 경복궁을 직접 둘러보며 흥미롭게 풀 수 있는 장소별 현장 체험 퀴즈와 탐방 미션을 개발함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-gyeongbokgung-workbook-519",
            "title": "Python Tkinter 기반 대화형 워크북 코딩",
            "description": "Python Tkinter를 활용하여 장소 선택, 문제 풀이, 정답 해설 및 점수 집계가 가능한 인터랙티브 GUI 앱을 제작함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-gyeongbokgung-workbook-519",
            "title": "모바일(Pydroid3) 현장 체험 및 사용성 검증",
            "description": "스마트폰 Pydroid3 환경에서 프로그램을 구동하며 실제 경복궁 현장에서 관람객 체험을 진행하고 설문을 수렴함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-gyeongbokgung-workbook-519",
            "title": "피드백 반영 및 해설 콘텐츠 보완",
            "description": "현장 테스트에서 발견된 불편 사항과 퀴즈 난이도를 조정하여 누구나 쉽게 즐길 수 있는 디지털 워크북을 완성함.",
            "display_order": 5
        }
    ],

    'p-ai-styling-580': [
        {
            "id": "step-1",
            "project_id": "p-ai-styling-580",
            "title": "날씨 및 감정 기반 스타일링 규칙 정의",
            "description": "기온별 14단계, 기분 상태 10가지, 강수 여부 등 다양한 환경 변수에 대응하는 의상 추천 규칙(Rule)을 정립함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-ai-styling-580",
            "title": "OpenWeatherMap API 실시간 기상 데이터 연동",
            "description": "전 세계 실시간 기상 데이터를 JSON으로 제공하는 외부 날씨 API를 연동하여 현지 기온과 날씨 정보를 수신함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-ai-styling-580",
            "title": "Streamlit 기반 사용자 맞춤형 웹 UI 구현",
            "description": "성별, 기분, 날씨를 직관적으로 선택하고 추천 결과를 한눈에 확인할 수 있는 Streamlit 웹 인터페이스를 구축함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-ai-styling-580",
            "title": "사용자 옷장 데이터 연동 및 맞춤 코디 완성",
            "description": "추천된 코디와 실제 사용자가 보유한 옷 목록을 비교 분석하여 실생활에서 바로 입을 수 있는 맞춤형 스타일링을 제안함.",
            "display_order": 4
        }
    ],

    'p-pet-care-423': [
        {
            "id": "step-1",
            "project_id": "p-pet-care-423",
            "title": "반려견 돌봄 애플리케이션 기능 조사",
            "description": "기존 스마트폰 강아지 돌봄 앱들의 주요 기능과 장단점을 비교 분석하여 가족 공유 프로그램의 차별점을 도출함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-pet-care-423",
            "title": "가족 공유 돌봄 필수 기능 요구사항 도출",
            "description": "사료 급여, 간식, 산책 여부를 가족 구성원 모두가 한눈에 확인하고 중복 급여를 방지할 수 있는 필수 기능을 정리함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-pet-care-423",
            "title": "가족 간 실시간 메모 및 행동 기록 기능 설계",
            "description": "돌봄 행동 체크 버튼과 특이사항을 기록할 수 있는 공유 메모장 모듈을 기획함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-pet-care-423",
            "title": "Python Tkinter 기반 GUI 프로그램 제작",
            "description": "버튼 클릭 한 번으로 행동을 기록하고 일별 통계를 확인할 수 있는 직관적인 데스크톱 GUI 프로그램을 완성함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-pet-care-423",
            "title": "가족 실사용 테스트 및 편의 기능 개선",
            "description": "실제 가족 구성원들이 프로그램을 사용해보며 발견한 불편 사항을 수정하고 입력 편의성을 개선함.",
            "display_order": 5
        }
    ],

    'p-project-574': [
        {
            "id": "step-1",
            "project_id": "p-project-574",
            "title": "시각·청각 제한 상황의 일상 불편도 비교 기획",
            "description": "시력 저하 상황과 청력 저하 상황이 일상생활에 미치는 불편의 차이를 객관적으로 비교·체험하는 시뮬레이션을 기획함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-574",
            "title": "시각 vs 청각 제한 모의 실험 환경 설계",
            "description": "화면 블러 처리(시각 제한)와 음향 차단(청각 제한)을 동일한 미션 과제에 적용하여 난이도 차이를 설계함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-574",
            "title": "센서 및 미디어 제어 프로그램 코딩",
            "description": "시청각 자극의 유무에 따른 반응 속도와 미션 수행 시간을 정밀 측정하는 인터랙티브 프로그램을 제작함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-574",
            "title": "사용자 체험 실험 및 반응 데이터 수집",
            "description": "피험자들에게 시각 제한 모드와 청각 제한 모드를 번갈아 체험하게 하고 소요 시간과 오류 횟수를 수집함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-project-574",
            "title": "감각 장애 체험 결과 분석 및 배려 인식 제언",
            "description": "실험 데이터를 바탕으로 두 감각 제한의 불편 특성을 분석하고 장애 인식 개선을 위한 실천 방안을 제시함.",
            "display_order": 5
        }
    ],

    'p-eco-quiz-498': [
        {
            "id": "step-1",
            "project_id": "p-eco-quiz-498",
            "title": "Python Tkinter 기반 GUI 환경 구성",
            "description": "Python IDLE과 Tkinter 라이브러리를 활용하여 퀴즈 진행창, 문항 표시부, 점수 집계 인터페이스를 구축함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-eco-quiz-498",
            "title": "환경 상식 20문항 엄선 및 오해 바로잡기 해설 작성",
            "description": "분리수거, 기후변화 등 일상 속에서 잘못 알려진 환경 상식 20문항을 선별하고 명확한 해설을 정리함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-eco-quiz-498",
            "title": "점수 집계 및 등급 판정(입문자·숙련자·만점자) 조건문 구현",
            "description": "정답 개수에 따라 3단계 환경 상식 등급을 시각적으로 출력하는 조건문 로직을 코딩함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-eco-quiz-498",
            "title": "사용자 응답 처리 및 즉각 피드백 연동",
            "description": "버튼 클릭 즉시 정답 여부와 상세 설명을 팝업으로 안내하여 자연스럽게 환경 지식을 습득하도록 유도함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-eco-quiz-498",
            "title": "친구 대상 시연 및 퀴즈 난이도 보정",
            "description": "실제 친구들에게 프로그램을 실행하게 한 뒤 이해하기 어려운 문항과 피드백 문구를 보완하여 완성함.",
            "display_order": 5
        }
    ],

    'p-emotion-diary-340': [
        {
            "id": "step-1",
            "project_id": "p-emotion-diary-340",
            "title": "감정과 학습 능률의 상관관계 가설 수립",
            "description": "기분과 정서 상태가 공부 집중도와 성취도에 미치는 영향을 조사하고 감정 연계 학습 플래너의 필요성을 정립함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-emotion-diary-340",
            "title": "학습·감정 복합 데이터 입력 인터페이스 설계",
            "description": "공부 전후의 기분 선택(5단계)과 과목별 학습 시간, 집중도를 동시에 기록할 수 있는 화면 흐름을 기획함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-emotion-diary-340",
            "title": "Python 기반 감정 다이어리 GUI 코딩",
            "description": "사용자가 직관적으로 아이콘을 클릭하여 감정과 일과를 저장할 수 있는 다이어리 프로그램을 제작함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-emotion-diary-340",
            "title": "감정 상태별 학습 패턴 누적 분석 알고리즘",
            "description": "어떤 감정 상태일 때 어떤 과목의 집중도가 높았는지 상관관계를 도출하는 통계 분석 로직을 구현함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-emotion-diary-340",
            "title": "맞춤형 감정 코칭 및 자기주도학습 리포트 제공",
            "description": "공부 시작 전 불안이나 피로를 느낄 때 스트레칭이나 마인드컨트롤 팁을 안내하는 피드백 시스템을 완성함.",
            "display_order": 5
        }
    ],

    'p-game-development-553': [
        {
            "id": "step-1",
            "project_id": "p-game-development-553",
            "title": "Pygame 기반 단어 암기 게임 기획",
            "description": "단순 암기의 지루함을 해소하기 위해 게임의 재미 요소와 타이핑 암기를 결합한 단어 게임 아키텍처를 수립함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-game-development-553",
            "title": "Visual Studio Code 및 Pygame 개발 환경 구축",
            "description": "VS Code에서 Pygame 라이브러리를 연동하고 게임 화면 해상도, 배경 그래픽, 텍스트 렌더링 루프를 구축함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-game-development-553",
            "title": "영어 단어·한글 뜻 데이터베이스 구축",
            "description": "주제별 필수 영어 단어와 한글 뜻 쌍을 딕셔너리 구조로 정리하여 무작위 출제되도록 구현함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-game-development-553",
            "title": "실시간 타이핑 입력 및 대소문자 무시 정답 판정",
            "description": "한글 뜻을 보고 영어 철자를 직접 입력하도록 하고, lower() 함수를 활용해 대소문자 구분 없이 유연하게 채점함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-game-development-553",
            "title": "점수 집계, 콤보 보너스 및 게임 오버 시스템 완성",
            "description": "연속 정답 시 추가 점수와 효과음을 부여하고, 틀릴 경우 생명력이 감소하는 완성도 높은 게임을 완성함.",
            "display_order": 5
        }
    ],

    'p-piano-analysis-630': [
        {
            "id": "step-1",
            "project_id": "p-piano-analysis-630",
            "title": "효율적 피아노 연습법 및 정량 평가 기준 정립",
            "description": "음악 전문가 인터뷰와 문헌 조사를 통해 메트로놈 BPM, 템포 유지력, 미스 터치율 등 정량 지표를 수립함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-piano-analysis-630",
            "title": "8주간 24회 실전 연습 데이터 수집",
            "description": "실험 참가자들의 연습 시간, 목표 BPM, 실제 달성 BPM, 실수 횟수를 주차별로 정밀 기록하여 데이터셋을 구축함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-piano-analysis-630",
            "title": "Pandas 및 Matplotlib 기반 연주 분석 프로그램 제작",
            "description": "연습 데이터를 표 형태로 가공하여 평균 성장률을 산출하고, 주차별 변화를 꺾은선 그래프로 자동 시각화함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-piano-analysis-630",
            "title": "점수 계산 알고리즘 및 취약 구간 맞춤 피드백 구현",
            "description": "박자 정확도와 미스터치 빈도를 종합해 점수를 도출하고, 부족한 부분에 맞는 구간 반복 연습법을 자동 추천함.",
            "display_order": 4
        }
    ],

    'p-project-276': [
        {
            "id": "step-1",
            "project_id": "p-project-276",
            "title": "학교 급식 식단표 분석 AI 시스템 기획",
            "description": "식단표 사진을 촬영하면 AI가 영양소를 자동 분석하고 저녁 식단으로 부족한 영양소를 채우는 도우미를 기획함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-276",
            "title": "식품 영양 데이터베이스 조사 및 영양사 자문",
            "description": "학교 영양사 선생님 면담을 통해 청소년 권장 영양소 기준치와 음식별 주요 영양 성분 데이터를 정리함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-276",
            "title": "OpenAI 멀티모달 API 연동 및 이미지 Base64 변환",
            "description": "식단표 이미지 파일을 Base64로 인코딩하여 AI 비전 모델로 전송하고 메뉴와 영양소를 자동 파싱하는 파이프라인을 구축함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-276",
            "title": "Tkinter 기반 멀티스레드 GUI 인터페이스 구현",
            "description": "AI 응답 대기 중 화면이 멈추지 않도록 스레딩을 적용하고 파일 선택기와 분석 결과 표(Treeview)를 구현함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-project-276",
            "title": "영양소 과부족 판정 및 맞춤형 저녁 메뉴 추천 완성",
            "description": "점심 급식에서 섭취한 탄단지 및 비타민을 계산하여 저녁 식사에 필요한 최적의 추천 메뉴를 안내하도록 완성함.",
            "display_order": 5
        }
    ],

    'p-project-392': [
        {
            "id": "step-1",
            "project_id": "p-project-392",
            "title": "학생 상벌점 관리 프로그램 요구사항 도출",
            "description": "학교 현장에서 학급 학생들의 상점과 벌점을 공정하고 투명하게 기록·조회할 수 있는 필수 기능을 정리함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-392",
            "title": "Python 및 Tkinter 기반 학생 관리 GUI 코딩",
            "description": "학생 명단 불러오기, 상벌점 부여 버튼, 누적 점수 테이블 뷰, 파일 입출력(CSV) 모듈을 구현함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-392",
            "title": "데이터 무결성 검증 및 예외 처리 로직 보완",
            "description": "점수 오입력, 중복 등록, 파일 저장 오류를 방지하기 위해 입력값 유효성 검사 및 확인 대화상자를 추가함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-392",
            "title": "기준 점수별 학생 자동 분류 및 통계 리포트 완성",
            "description": "모범 학생 및 지도 대상 학생을 설정된 기준 점수에 따라 자동 필터링하고 학기말 통계를 생성하도록 완성함.",
            "display_order": 4
        }
    ],

    'p-project-885': [
        {
            "id": "step-1",
            "project_id": "p-project-885",
            "title": "러닝 코스 특성 및 선호 요인 분석",
            "description": "온라인 러닝 커뮤니티 데이터와 지역 산책로 현장 조사를 통해 코스 거리, 노면 상태, 고도 변화 등 핵심 요소를 분석함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-885",
            "title": "사용자 러닝 조건(거리·페이스·선호도) 입력 인터페이스 설계",
            "description": "러너가 자신의 체력 수준과 희망 거리, 달리기 목적을 선택할 수 있는 입력 항목과 추천 기준을 기획함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-885",
            "title": "Python Tkinter 기반 코스 추천 GUI 프로그램 제작",
            "description": "조건을 입력하면 주변 공원 및 산책로 중 최적의 러닝 코스 목록과 상세 설명, 예상 소요 시간을 안내하는 GUI를 구축함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-885",
            "title": "현장 실측 검증 및 코스 데이터베이스 고도화",
            "description": "추천된 코스를 직접 달리며 기록된 거리와 실제 소요 시간 오차를 보정하여 신뢰도 높은 맞춤형 러닝 코치를 완성함.",
            "display_order": 4
        }
    ],

    'p-project-077': [
        {
            "id": "step-1",
            "project_id": "p-project-077",
            "title": "학생 시간 관리 및 여행 테마 게이미피케이션 기획",
            "description": "할 일을 완료하면 가상 여행지 사진을 획득하는 보상 시스템을 결합하여 학습 동기를 부여하는 플래너를 기획함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-077",
            "title": "CustomTkinter 기반 8개 화면 멀티 프레임 UI 구축",
            "description": "오늘의 목표, 플래너, 여권 기록 등 8개의 Frame 화면을 매끄럽게 전환하는 모던 GUI 환경을 개발함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-077",
            "title": "날짜별 텍스트 파일 자동 분할 저장 시스템 구현",
            "description": "별도 저장 버튼 없이 입력 즉시 날짜별 파일에 자동 기록되고 지난 기록을 여권에서 다시 볼 수 있도록 코딩함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-077",
            "title": "과목별 목표 달성 시 랜덤 여행 사진 보상 모듈 완성",
            "description": "할 일 체크박스를 완료하면 해당 과목에 배정된 세계 명소 사진과 여행 스탬프가 찍히는 보상 메커니즘을 완성함.",
            "display_order": 4
        }
    ],

    'p-project-792': [
        {
            "id": "step-1",
            "project_id": "p-project-792",
            "title": "학원 시간 알리미 필수 기능 및 알람 흐름 정의",
            "description": "학원명, 수업 요일, 시작 시간을 등록하면 수업 전 지정된 시간(5분 전 등)에 미리 알람을 울려주는 기능을 정의함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-792",
            "title": "App Inventor 기반 모바일 인터페이스 구축",
            "description": "일정 목록 화면, 학원 추가 입력 화면, 알람 설정 화면 등 3개 모바일 스크린을 직관적으로 레이아웃함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-792",
            "title": "TinyDB 로컬 데이터베이스 일정 저장 모듈 구현",
            "description": "입력된 학원 시간표 데이터를 스마트폰 내 TinyDB에 영구 저장하고 앱 재시작 시 자동으로 불러오도록 연동함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-792",
            "title": "WeeklyAlarm 확장 컴포넌트 연동 및 주간 알람 예약",
            "description": "매주 정해진 요일과 시간에 반복 작동하는 백그라운드 알람 예약 시스템을 구축함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-project-792",
            "title": "알람 정시 울림 테스트 및 예외 처리 완성",
            "description": "미입력 필드 안내, 시간 충돌 확인 등 사용자 오류를 방지하고 정확한 시간에 알림이 울리도록 검증함.",
            "display_order": 5
        }
    ],

    'p-smart-robot-990': [
        {
            "id": "step-1",
            "project_id": "p-smart-robot-990",
            "title": "비접촉 자동 수도꼭지 제어 로봇 아이디어 기획",
            "description": "직접 손을 대지 않고 손을 가까이 대면 자동으로 물이 나오고 30초 손씻기 후 멈추는 위생 절수 로봇을 기획함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-smart-robot-990",
            "title": "스파이크 프라임 거리 센서 및 회전 모터 기구학 설계",
            "description": "수도꼭지 레버를 감싸고 정해진 각도만큼 회전시켜 밸브를 열고 잠그는 기어 메커니즘을 제작함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-smart-robot-990",
            "title": "손 감지 및 자동 급수 타이머 제어 프로그램 작성",
            "description": "초음파 거리 센서로 손 접근을 인식하면 모터가 수도꼭지를 열고, 30초 후 자동으로 잠그는 코드를 작성함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-smart-robot-990",
            "title": "실제 수도꼭지 장착 및 개폐 토크 성능 검증",
            "description": "다양한 형태의 수도꼭지 레버에 장착하여 모터 토크와 회전 각도를 미세 조정하고 안정적인 절수 효과를 확인함.",
            "display_order": 4
        }
    ],

    'p-safety-helper-547': [
        {
            "id": "step-1",
            "project_id": "p-safety-helper-547",
            "title": "주행 속도별 제동 거리 및 관성 법칙 이론 분석",
            "description": "차량 속도가 빠를수록 관성에 의해 제동 거리가 늘어나는 물리 법칙을 분석하고 10cm 정밀 정차 목표를 설정함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-safety-helper-547",
            "title": "스파이크 프라임 충격 흡수 서스펜션 차체 제작",
            "description": "충돌 충격을 완화하는 독립 서스펜션 구조를 적용하고 수직 방향으로 초음파 센서를 장착한 주행 로봇을 조립함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-safety-helper-547",
            "title": "속도별(25%~100%) 사전 제동 감지 거리 수식 도출",
            "description": "속도가 빠를수록 더 먼 거리에서 브레이크를 동작시켜 어떤 속도에서도 정확히 10cm 앞에서 멈추는 수식을 계산함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-safety-helper-547",
            "title": "주행 속도별 정지 거리 반복 실험 및 오차 보정",
            "description": "속도 단계별로 반복 주행 실험을 수행하여 센서 측정 지연과 모터 관성을 보정하고 안전거리 10cm 정차를 완성함.",
            "display_order": 4
        }
    ]
}

# Update
for p in projects:
    pid = p['id']
    if pid in REMAINING_UPDATES:
        p['processes'] = REMAINING_UPDATES[pid]

# Save projects-store.json
with open('data/projects-store.json', 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)

print("Saved data/projects-store.json with remaining 18 fixes.")

# Synchronize sample-projects.ts
ts_content = f"""import {{ Project }} from "@/types/project";

export const SAMPLE_PROJECTS: Project[] = {json.dumps(projects, ensure_ascii=False, indent=2)};

export const sampleProjects = SAMPLE_PROJECTS;
"""

with open('data/sample-projects.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Synchronized data/sample-projects.ts")
