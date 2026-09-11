import json
import re

# Load projects
with open('data/projects-store.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

# Define exact cleaned processes for the 26 target projects
PROCESS_UPDATES = {
    'p-safety-helper-004': [
        {
            "id": "step-1",
            "project_id": "p-safety-helper-004",
            "title": "평지·경사로·장애물 환경 주행 실험",
            "description": "유모차 모형을 평지, 오르막길, 내리막길, 장애물 접근, 손잡이를 놓은 돌발 상황 등 다양한 환경에서 반복 주행하며 안정성을 검증함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-safety-helper-004",
            "title": "유모차 차체 제작 및 센서 연동 (1차)",
            "description": "좌우 구동 모터를 장착하여 주행 차체를 조립하고, 손잡이 힘센서, 전방 거리센서, 자이로센서를 하드웨어에 연동하여 기본 작동을 확인함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-safety-helper-004",
            "title": "상황별 다중 안전 제어 로직 구현 (2차)",
            "description": "손잡이를 놓으면 즉시 감속 후 정지하는 손 놓음 안전 기능과, 30cm 이내 장애물 접근 시 속도를 20%로 감속하는 충돌 방지 알고리즘을 코딩함.",
            "display_order": 3
        }
    ],

    'p-waste-sorting-robot-543': [
        {
            "id": "step-1",
            "project_id": "p-waste-sorting-robot-543",
            "title": "레고 스파이크 프라임 키트 환경 구성",
            "description": "스파이크 프라임 교육용 키트 2세트와 공식 제어 프로그램을 활용하여 로봇 구동 환경을 구축하고 문제 해결형 탐구 방식을 수립함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-waste-sorting-robot-543",
            "title": "초기 로봇 설계 및 포트 제어 최적화",
            "description": "허브 2개와 바퀴 4개로 초기 설계를 진행했으나, 제어 복잡도와 포트 부족 문제를 해결하기 위해 메인 허브와 모터 배치를 최적화함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-waste-sorting-robot-543",
            "title": "연결선 배선 정리 및 주행 성능 개선",
            "description": "전진 주행 시 연결선 간섭으로 인한 움직임 방해 문제를 해결하기 위해 배선을 깔끔히 정리하고 부품 위치를 재배치함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-waste-sorting-robot-543",
            "title": "집게 크기 확장 및 파지 각도 기구학 수정",
            "description": "소형 집게로 인한 물체 낙하 문제를 개선하기 위해 대형 집게로 교체하고, 쓰레기를 안정적으로 잡을 수 있도록 모터 작동 각도를 수정함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-waste-sorting-robot-543",
            "title": "무게중심 후방 밸런싱 및 최종 차체 완성",
            "description": "대형 집게 장착으로 전방으로 쏠린 무게중심을 맞추기 위해 차체 후방에 볼캐스터와 보조 중량 바퀴를 추가하여 완벽한 균형을 완성함.",
            "display_order": 5
        }
    ],

    'p-autonomous-car-040': [
        {
            "id": "step-1",
            "project_id": "p-autonomous-car-040",
            "title": "구동 메커니즘 설계 및 2륜 구동 차체 제작",
            "description": "부품 공간과 모터 제어 효율성을 고려하여 4륜 대신 2개 구동 바퀴와 보조 볼캐스터 구조로 최적화하고 카트 프레임을 제작함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-autonomous-car-040",
            "title": "초음파 및 컬러 복합 센서 통합 마운트 장착",
            "description": "추종 대상의 색상과 거리를 동시에 스캔할 수 있도록 서보모터 상단에 초음파 센서와 컬러센서를 통합 마운트하고 수납공간을 구현함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-autonomous-car-040",
            "title": "시야 이탈 감지 및 양륜 차동 조향 알고리즘",
            "description": "0.1초 단위 거리차를 계산하여 추종 대상이 시야에서 벗어나면 좌우 5도씩 탐색한 뒤 바퀴 속도차를 이용해 추종하도록 코딩함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-autonomous-car-040",
            "title": "레이더 방식 광각 스캔 기법 및 추종 고도화",
            "description": "물체 인식 사각지대를 보완하기 위해 전방 -70도~+70도 영역을 5도 단위로 레이더 스캔하여 정확한 추종 주행을 완성함.",
            "display_order": 4
        }
    ],

    'p-safety-helper-073': [
        {
            "id": "step-1",
            "project_id": "p-safety-helper-073",
            "title": "거리 센서 기반 전방 장애물 감지 및 회피 메커니즘",
            "description": "전방 초음파 거리 센서를 장착하여 장애물을 감지하면 자동으로 감속·정지하거나 안전한 방향으로 회피하는 주행 알고리즘을 구현함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-safety-helper-073",
            "title": "컬러 센서를 활용한 유도 경로 자율 주행",
            "description": "바닥 면을 향한 컬러 센서로 실내 안전 유도선의 색상을 실시간 인식하여 경로를 이탈하지 않고 안전하게 주행하도록 제어함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-safety-helper-073",
            "title": "힘 센서 기반 비상 정지 안전 시스템",
            "description": "응급 상황 발생 시 탑승자가 누를 수 있는 힘 센서 비상 버튼을 구성하여, 입력 즉시 모든 모터를 강제 셧다운하는 안전장치를 완성함.",
            "display_order": 3
        }
    ],

    'p-fire-escape-robot-398': [
        {
            "id": "step-1",
            "project_id": "p-fire-escape-robot-398",
            "title": "스마트 소방 기술 및 센서 메커니즘 분석",
            "description": "스파이크 프라임의 컬러 센서 알고리즘과 로봇 링크 구조, 열화상 감지 원리를 학습하여 화재 대피 로봇의 기본 프레임워크를 마련함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-fire-escape-robot-398",
            "title": "최신 스마트 소방시설 분석 및 탈출로 기획",
            "description": "언론 보도 및 최신 스마트 소방시설 기술 수준을 조사하여 아파트 화재 시 골든타임을 확보할 수 있는 신속 탈출 메커니즘을 구상함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-fire-escape-robot-398",
            "title": "컬러 센서 기반 화재 불꽃 감지 시스템 구축",
            "description": "컬러 센서를 불꽃 감지 센서 대용으로 활용하여 붉은색, 노란색 등 화재 불꽃 특유의 색상을 실시간 감지하도록 설계함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-fire-escape-robot-398",
            "title": "접이식 대피 튜브 전개 구동부 제작",
            "description": "메인 허브 양옆에 소형 모터 2개와 플렉시블 튜브를 연결하여 화재 신호 감지 시 접이식 탈출 튜브가 신속히 팽창하는 메커니즘을 완성함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-fire-escape-robot-398",
            "title": "하드웨어 통합 및 오인 감지 방지 보정",
            "description": "사람 모형의 노란색 옷을 화재로 오인하지 않도록 컬러 센서와 초음파 센서의 임계 조건을 보정하고 종합 대피 시스템을 완성함.",
            "display_order": 5
        }
    ],

    'p-smart-robot-389': [
        {
            "id": "step-1",
            "project_id": "p-smart-robot-389",
            "title": "도슨트 로봇 핵심 기능 및 전시 안내 기획",
            "description": "관람객 안내 및 미술관 작품 해설을 자율적으로 수행하기 위한 핵심 주행·해설 기능과 소프트웨어 구조를 기획함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-smart-robot-389",
            "title": "스파이크 프라임 기반 도슨트 로봇 차체 조립",
            "description": "스파이크 프라임 허브와 모터를 결합하여 미술관 내를 안정적으로 주행할 수 있는 소형 도슨트 로봇 하드웨어를 제작함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-smart-robot-389",
            "title": "열린수장고 모형 제작 및 주행 테스트",
            "description": "대전시립미술관 열린수장고의 전시 공간과 작품 배치를 단순화한 축소 모형을 제작하여 로봇의 자율 이동성을 테스트함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-smart-robot-389",
            "title": "라인트레이싱 경로 설계 및 작품 위치 마킹",
            "description": "검은색 마스킹 테이프로 이동 경로를 구성하고, 작품 전시 위치마다 컬러 색종이로 표식을 부착하여 해설 지점을 설계함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-smart-robot-389",
            "title": "컬러·거리 복합 센서 연동 및 자율 해설 완성",
            "description": "바닥 색상 표식을 감지해 해당 작품 설명을 LCD에 표출하고, 관람객 등 장애물 감지 시 안전 정지 후 재출발하도록 완성함.",
            "display_order": 5
        }
    ],

    'p-smart-robot-790': [
        {
            "id": "step-1",
            "project_id": "p-smart-robot-790",
            "title": "자이로 센서 연동 및 난이도 조절 인터페이스",
            "description": "허브 버튼으로 훈련 난이도를 설정하고 힘센서 입력을 통해 손의 기울기와 펜의 이동 방향을 연동하는 기초 인터페이스를 구축함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-smart-robot-790",
            "title": "글쓰기 훈련 로봇 차체 4차 설계 및 개선",
            "description": "손의 움직임을 펜 부착 바퀴에 효과적으로 전달하기 위해 4차례에 걸쳐 하드웨어를 수정·보완하여 안정적인 쓰기 로봇을 제작함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-smart-robot-790",
            "title": "모터 속도 및 정지 제어 소프트웨어 코딩",
            "description": "모터 회전 속도 파라미터를 최적화하고 정지 변수 제어를 통해 손 근력이 약한 사용자도 단계별로 글씨를 연습할 수 있도록 구현함.",
            "display_order": 3
        }
    ],

    'p-smart-robot-767': [
        {
            "id": "step-1",
            "project_id": "p-smart-robot-767",
            "title": "병원 약품 배송 로봇 목표 수립",
            "description": "병원 복도를 자율 주행하며 환자 병실까지 약과 의료 물품을 안전하게 전달하는 배송 로봇 구조를 기획함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-smart-robot-767",
            "title": "자율주행 및 배송 시스템 흐름도 기획",
            "description": "의료진의 업무 부담을 줄이고 환자 맞춤형 약품 전달을 지원하기 위한 자율 이송 시스템의 알고리즘 흐름도를 설계함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-smart-robot-767",
            "title": "스파이크 프라임 차체 제작 및 구동 코딩",
            "description": "모터와 바퀴를 조립하고 하단에 컬러센서를 장착하여 바닥 색깔 신호에 따라 주행·회전하도록 제어 코드를 작성함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-smart-robot-767",
            "title": "병원 복도 및 병실 축소 모형 제작",
            "description": "병실과 복도를 모의 재현하고 로봇이 각 위치에서 적절한 동작(직진, 좌회전, 정지)을 취할 수 있도록 바닥 컬러 라인을 구축함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-smart-robot-767",
            "title": "주행 정밀도 테스트 및 회전 각도 보정",
            "description": "각 색상별 인식 반응을 테스트하고 회전 각도와 주행 거리 오차를 소프트웨어적으로 보정하여 정확한 배송 시스템을 완성함.",
            "display_order": 5
        }
    ],

    'p-project-759': [
        {
            "id": "step-1",
            "project_id": "p-project-759",
            "title": "급격한 온도 상승 감지용 부품 선정",
            "description": "초기 화재 발생 시 급격한 온도 변화를 즉각 포착하기 위해 DHT22 온습도 센서와 신속 반응 회로를 구성함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-759",
            "title": "화재 판단 알고리즘 및 임계값 설정",
            "description": "4초 간격 측정에서 35℃ 이상 및 이전 대비 3.5℃ 이상 연속 3회 급상승 시 화재로 판정하는 오작동 방지 로직을 구현함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-759",
            "title": "우산형 차단 구조 하드웨어 설계 및 제작",
            "description": "레고 프레임과 고무줄 탄성을 결합하고 서보모터 락 메커니즘을 적용하여 화재 감지 시 0.5초 내 순간 전개되는 차단막을 제작함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-759",
            "title": "마이크로컨트롤러 화재 판정 펌웨어 코딩",
            "description": "아두이노 기반으로 센서 데이터를 실시간 연산하고 화재 판정 시 즉각 서보모터를 구동하여 차단막을 펼치는 펌웨어를 작성함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-project-759",
            "title": "열풍 실험을 통한 화재 차단 성능 실증",
            "description": "열풍기를 이용해 급격한 고온 상황을 모의 실험하고, 설계된 기준치 도달 시 우산형 구조가 정확히 전개되어 화재 확산을 막는지 검증함.",
            "display_order": 5
        }
    ],

    'p-project-398': [
        {
            "id": "step-1",
            "project_id": "p-project-398",
            "title": "소방관 안전용 세이프티 캡슐 하드웨어 설계",
            "description": "소방관이 현장 진입 전 투입할 수 있도록 아두이노 UNO, 온도 센서, 가스 센서, 배터리를 내열 캡슐 형태로 모듈화 설계함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-398",
            "title": "센서 수집 및 무선 통신 펌웨어 개발",
            "description": "블루투스 페어링 후 주기적으로 현장 온도와 가스 농도를 측정하여 시리얼 패킷으로 무선 송신하는 아두이노 코드를 구현함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-398",
            "title": "PC 블루투스 통신 모니터링 연동",
            "description": "외부 관제 PC에서 HC-06 모듈과 시리얼 포트를 연결하여 내부 환경 데이터를 실시간 수신·시각화하는 모니터링 환경을 구축함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-398",
            "title": "핵심 센서 및 회로 구성품 최적화",
            "description": "LM35 온도 센서, MQ-2 가스 센서, 전원 모듈 간의 간섭을 최소화하고 소비전력에 따른 전압 강하를 보정함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-project-398",
            "title": "복합 가스·온도 감지 실증 테스트",
            "description": "화재 모의 환경에서 가스와 온도 데이터를 동시 수집하여 화재 위험도를 실시간으로 원격 전송하는 데 성공함.",
            "display_order": 5
        }
    ],

    'p-water-fountain-980': [
        {
            "id": "step-1",
            "project_id": "p-water-fountain-980",
            "title": "탁도 센서 기반 수질 오염 감지 회로 구성",
            "description": "저수조 물의 혼탁도와 오염 상태를 실시간으로 측정하는 탁도 센서와 온도 센서를 결합하여 수질 모니터링 회로를 설계함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-water-fountain-980",
            "title": "인체 감지 센서 및 LCD 상태 표출 연동",
            "description": "사용자가 음수대에 다가오는 것을 감지하는 인체감지 센서와 현재 수질·온도 정보를 시각적으로 안내하는 LCD 모듈을 구축함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-water-fountain-980",
            "title": "서보모터 위생 덮개 및 UV 살균 모듈 제작",
            "description": "평상시에는 UV LED로 음수 노즐을 살균하고, 사람 접근 시 서보모터로 덮개를 자동 개폐하는 청결 메커니즘을 구현함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-water-fountain-980",
            "title": "경량·내구성 음수대 외형 프레임 제작",
            "description": "휴대성과 위생성을 모두 충족할 수 있는 소재를 선별하여 급수 노즐과 배관이 완벽히 보호되는 외형을 조립함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-water-fountain-980",
            "title": "저수조 결합 및 종합 위생 급수 시스템 완성",
            "description": "저수조와 펌프, UV 챔버를 통합 제어 회로에 연결하고 센서 연동 개폐 및 살균 시퀀스를 종합 테스트함.",
            "display_order": 5
        }
    ],

    'p-project-369': [
        {
            "id": "step-1",
            "project_id": "p-project-369",
            "title": "다중 센서 기반 자세 측정 회로 구성",
            "description": "초음파 센서로 등받이와의 거리를 측정하고, 방석의 압력 센서로 다리 꼬기를 감지하는 아두이노 통합 회로를 구성함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-369",
            "title": "가속도 센서 연동 의자 까딱임 감지",
            "description": "3축 가속도 센서를 부착하여 의자를 앞뒤로 흔들거나 기우는 위험 행동을 수치화하고 경고 부저 신호와 연동함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-369",
            "title": "초음파 센서 기반 굽은 등 판별 알고리즘",
            "description": "의자 등받이와 등 사이의 거리가 15cm 이상 벌어지면 거북목 및 굽은 등 자세로 판별하는 계산식을 수립함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-369",
            "title": "LCD 시각 안내 및 실시간 피드백 구현",
            "description": "바른 자세일 때는 칭찬 메시지, 나쁜 자세일 때는 이탈 거리와 경고음을 LCD 화면에 즉시 안내하도록 프로그래밍함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-project-369",
            "title": "압력 센서 방석 제작 및 골반 불균형 감지",
            "description": "방석에 8개의 센서를 매트릭스로 배열하여 한쪽으로 치우쳐 앉거나 다리를 꼬는 자세를 정확히 판별하도록 완성함.",
            "display_order": 5
        }
    ],

    'p-drowsiness-prevention-291': [
        {
            "id": "step-1",
            "project_id": "p-drowsiness-prevention-291",
            "title": "고개 숙임 감지 아이디어 및 센서 회로 기획",
            "description": "운전자의 고개 기울기와 숙인 지속 시간을 결합하여 단순 끄덕임과 실제 졸음 상태를 정밀 구분하는 시스템을 기획함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-drowsiness-prevention-291",
            "title": "단계별 부저 및 안전장치 순차 제어 설계",
            "description": "졸음 판단 시 1차 경고음 발생 후에도 반응이 없으면 서보모터 기반 안전 스위치가 동작하는 단계별 안전 시퀀스를 수립함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-drowsiness-prevention-291",
            "title": "MPU-6050 3축 가속도 자이로 센서 연동",
            "description": "머리의 X, Y, Z축 각도를 실시간 측정하는 I2C 가속도 센서와 아두이노 UNO, 경보 부저를 회로로 연결함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-drowsiness-prevention-291",
            "title": "기울기 각도 계산 및 지속 시간 측정 알고리즘",
            "description": "센서 3축 값에서 머리 숙임 각도를 계산하고 각도가 45도 이상 유지될 때 타이머를 구동하는 감지 로직을 구현함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-drowsiness-prevention-291",
            "title": "졸음 판정 임계값 검증 및 시스템 실증",
            "description": "고개 각도 45도와 숙임 시간 임계값을 실험을 통해 최적화하여 오작동 없는 졸음운전 방지 기기를 완성함.",
            "display_order": 5
        }
    ],

    'p-smart-robot-894': [
        {
            "id": "step-1",
            "project_id": "p-smart-robot-894",
            "title": "자동 회전 테이블오더 로봇 기구학 설계",
            "description": "손님이 앉은 방향으로 태블릿 화면을 자동 회전시켜 고개와 몸을 비틀지 않고 주문할 수 있는 회전형 거치대 구조를 설계함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-smart-robot-894",
            "title": "초음파 거리 측정 특성 분석 및 감지 영역 설정",
            "description": "초음파 센서 HC-SR04의 감지 각도와 거리 특성을 분석하여 주문자가 테이블에 앉은 유효 거리 영역을 정의함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-smart-robot-894",
            "title": "아두이노 기반 회전 서보모터 및 제어 회로 구축",
            "description": "아두이노 UNO에 센서와 회전용 서보모터, 상태 안내 RGB LED를 결합하여 실시간 회전 구동 하드웨어를 제작함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-smart-robot-894",
            "title": "사용자 위치 추적 및 단계별 회전 알고리즘 코딩",
            "description": "초음파 센서로 목표 방향을 스캔하고 설정된 각도로 오차 2~3도 이내 정확히 정지하도록 회전 제어 코드를 작성함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-smart-robot-894",
            "title": "PIR 움직임 감지 연동 및 회전 정밀도 실증",
            "description": "총 60회 회전 실험 중 88%의 높은 정밀 정지 성공률을 달성하고 사용자 친화적 스마트 테이블오더를 완성함.",
            "display_order": 5
        }
    ],

    'p-project-941': [
        {
            "id": "step-1",
            "project_id": "p-project-941",
            "title": "공간 좌표 변환 이론 정립",
            "description": "공중에서 펜을 움직일 때 3축 가속도와 자이로 각속도 데이터를 2차원 화면 좌표계로 변환하는 알고리즘 원리를 수립함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-941",
            "title": "아두이노 UNO 및 자이로 센서 하드웨어 제작",
            "description": "손에 쥐기 편한 펜 형태로 아두이노 보드와 MPU 자이로 센서, 버튼 입력 스위치를 회로로 결합하고 외형을 제작함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-941",
            "title": "센서 드리프트 보정 및 제스처 인식 펌웨어 작성",
            "description": "자이로 센서의 누적 오차(드리프트)를 필터링 알고리즘으로 보정하고 버튼 클릭으로 그리기를 시작·중지하는 코드를 작성함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-941",
            "title": "PC 시각화 소프트웨어 연동 및 궤적 렌더링",
            "description": "시리얼 통신으로 전송된 좌표 데이터를 화면에 실시간 선으로 그려내는 그래픽 소프트웨어를 연동하여 공중 필기를 완성함.",
            "display_order": 4
        }
    ],

    'p-smart-planter-751': [
        {
            "id": "step-1",
            "project_id": "p-smart-planter-751",
            "title": "가정용 식물 환경 센서 모니터링 하드웨어 구성",
            "description": "실내 식물의 토양 수분, 조도, 온습도를 복합 감지하는 센서들을 마이크로컨트롤러에 연결하여 생육 환경 측정 회로를 제작함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-smart-planter-751",
            "title": "식물 주요 이상증세(냉해·열해·과습·웃자람) 분류 체계 수립",
            "description": "단순 급수를 넘어 온도 임계값 미달(냉해), 고온 건조(열해), 수분 과다(과습), 일조 부족(웃자람) 등 4대 이상증세 판정 기준을 정립함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-smart-planter-751",
            "title": "이상 징후 자동 감지 및 대처 제어 펌웨어 코딩",
            "description": "센서 측정값이 정상 범위를 벗어나면 경보를 울리고 서보모터 통풍창이나 워터펌프를 능동 제어하는 알고리즘을 구현함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-smart-planter-751",
            "title": "스마트 플랜터 프레임 제작 및 급수 모듈 연동",
            "description": "식물이 건강하게 자랄 수 있는 컴팩트 플랜터 외형을 제작하고 센서와 펌프 배관을 일체형으로 조립함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-smart-planter-751",
            "title": "모의 환경 재현 실험 및 생육 개선 효과 검증",
            "description": "과습 및 건조 조건을 인위적으로 조성하여 시스템이 자동으로 이상을 인지하고 환경을 조절하는 성능을 실증함.",
            "display_order": 5
        }
    ],

    'p-ant-colony-sim-057': [
        {
            "id": "step-1",
            "project_id": "p-ant-colony-sim-057",
            "title": "개미 군집 페로몬 이동 알고리즘 이론 정립",
            "description": "개미들이 둥지와 먹이 사이를 오가며 남기는 페로몬 농도와 증발률을 수학적 확률 모델로 정립함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-ant-colony-sim-057",
            "title": "Python Pygame 기반 2D 시뮬레이션 환경 구축",
            "description": "개미 객체들이 자유롭게 이동할 수 있는 평면 맵과 둥지, 먹이 포인트, 시각화 렌더링 루프를 파이썬으로 구현함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-ant-colony-sim-057",
            "title": "장애물 배치 및 경로 탐색 에이전트 코딩",
            "description": "개미가 전방 장애물을 감지하고 우회하면서 가장 페로몬이 짙은 최단 경로를 선택하도록 행동 규칙을 프로그래밍함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-ant-colony-sim-057",
            "title": "페로몬 증발 및 최단 경로 수렴 시뮬레이션 실행",
            "description": "시간 경과에 따라 비효율적인 경로는 페로몬이 증발하고 최적 경로로 모든 개미의 동선이 하나로 수렴하는 현상을 확인함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-ant-colony-sim-057",
            "title": "알고리즘 수렴 속도 및 장애물 적응성 분석",
            "description": "장애물 위치를 동적으로 변경했을 때 개미 군집이 새로운 최단 경로를 찾아내는 적응력을 정량적으로 분석함.",
            "display_order": 5
        }
    ],

    'p-pet-care-378': [
        {
            "id": "step-1",
            "project_id": "p-pet-care-378",
            "title": "유기동물 공공데이터 API 수집 및 분석 대상 선정",
            "description": "최근 3개년 31만 건의 구조동물 공공데이터 중 72%를 차지하는 강아지 데이터를 선별하여 분석 대상을 확정함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-pet-care-378",
            "title": "유기견 안락사·자연사 요인 통계적 고찰",
            "description": "구조 지역, 품종, 체중, 성별, 연령별 생존율 차이를 파악하고 머신러닝 예측에 필요한 핵심 피처 후보를 도출함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-pet-care-378",
            "title": "Google Colab 기반 Python 데이터 정제 파이프라인",
            "description": "결측치 처리, 믹스견/품종견 분류, 몸무게 범주화, 시/도 지역 코드 변환 등 전처리 단계를 모듈화하여 정제함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-pet-care-378",
            "title": "머신러닝 데이터셋 구축 및 단계별 피처 엔지니어링",
            "description": "전처리 단계별 CSV 데이터를 안전하게 백업하고 원-핫 인코딩 및 스케일링을 거쳐 머신러닝 학습용 데이터셋을 완성함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-pet-care-378",
            "title": "분류 예측 모델 학습 및 입양 활성화 정책 제언",
            "description": "입양 가능성을 예측하는 최적 머신러닝 모델을 평가하고 구조견의 생존율을 높이기 위한 맞춤형 관리 방안을 제시함.",
            "display_order": 5
        }
    ],

    'p-ping-pong-ai-408': [
        {
            "id": "step-1",
            "project_id": "p-ping-pong-ai-408",
            "title": "Python 기반 2D 핑퐁 물리 시뮬레이션 환경 구축",
            "description": "패들 크기, 공 속도, 반사 각도 등 물리 법칙이 정확히 반영된 핑퐁 게임 환경(physics.py, env.py)을 코딩함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-ping-pong-ai-408",
            "title": "강화학습 상태 공간(State) 및 보상(Reward) 설계",
            "description": "패들과 공의 상대 좌표를 이산화하여 상태 공간을 정의하고 공을 칠 때 +1, 놓칠 때 -1의 보상 구조를 수립함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-ping-pong-ai-408",
            "title": "Q-러닝(Q-Learning) 강화학습 알고리즘 구현",
            "description": "벨만 방정식 기반 Q-테이블 갱신 로직을 구현하고 학습률, 할인율, 탐험률(Epsilon) 파라미터를 튜닝함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-ping-pong-ai-408",
            "title": "에피소드별 학습 진행 및 실시간 성능 모니터링",
            "description": "학습 횟수(100회~수만 회)에 따른 AI 득점률과 미스율을 측정하여 학습 곡선 그래프와 플레이 영상을 기록함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-ping-pong-ai-408",
            "title": "상대 봇 난이도 조정 및 학습 한계 극복 분석",
            "description": "지나치게 완벽한 상대 봇을 만났을 때의 학습 정체 문제를 극복하기 위해 상대 난이도를 점진 조절하며 최적 실력을 이끌어냄.",
            "display_order": 5
        }
    ],

    'p-cube-solver-105': [
        {
            "id": "step-1",
            "project_id": "p-cube-solver-105",
            "title": "Kociemba 해법 및 DeepCubeA 논문 분석",
            "description": "루빅스 큐브의 양방향 탐색 알고리즘과 심층 강화학습 기반 DeepCubeA 모델 구조를 선행 분석함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-cube-solver-105",
            "title": "3x3 루빅스 큐브 상태 클래스 및 12개 기본 회전 구현",
            "description": "6개 면의 색상을 정수 배열로 정의하고 U, D, R, L, F, B 12가지 기본 회전 연산을 파이썬 RubiksCube 클래스로 코딩함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-cube-solver-105",
            "title": "배치 처리 회전 함수 및 원-핫 인코딩 전처리",
            "description": "수만 개의 큐브 상태를 신경망이 빠르게 학습할 수 있도록 Batch 회전 연산과 6차원 원-핫 인코딩 파이프라인을 구축함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-cube-solver-105",
            "title": "무작위 스크램블 학습 데이터셋 자동 생성",
            "description": "맞춰진 완성 상태에서 10~38수의 무작위 회전을 역적용하여 신경망 학습에 필요한 대규모 스크램블 데이터를 생성함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-cube-solver-105",
            "title": "신경망 모델 기반 A* 탐색 최적 해법 도출",
            "description": "학습된 딥러닝 신경망의 휴리스틱 평가 함수와 A* 알고리즘을 결합하여 최단 수로 큐브를 맞추는 지능형 솔버를 완성함.",
            "display_order": 5
        }
    ],

    'p-ship-survival-ai-530': [
        {
            "id": "step-1",
            "project_id": "p-ship-survival-ai-530",
            "title": "18개 선박 사고 15,000명 승객 데이터 수집 및 로드",
            "description": "버큰헤드호 등 역사적 18건의 해난 사고 승객·승무원 15,000건의 기록을 Pandas로 불러와 데이터 무결성을 검증함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-ship-survival-ai-530",
            "title": "핵심 요인(성별·나이·승무원·동승자) 상관관계 분석",
            "description": "생존 여부(Survival)에 미치는 성별(Gender), 나이(Age), 승무원 여부(Crew), 동승자 유무의 피어슨 상관계수를 산출함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-ship-survival-ai-530",
            "title": "결측치 대체 및 머신러닝 수치형 데이터 전처리",
            "description": "나이의 결측치는 중앙값으로, 범주형 변수는 최빈값으로 대체하고 원-핫 인코딩을 적용해 전처리 파이프라인을 완성함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-ship-survival-ai-530",
            "title": "Seaborn 히트맵 시각화 및 집단별 생존율 비교",
            "description": "상관관계 매트릭스를 시각화하고 승무원(+0.14)과 성별(-0.07) 등 주요 변수별 실제 생존율 격차를 정량 검증함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-ship-survival-ai-530",
            "title": "개인별 생존 확률 예측 AI 모델 구축 및 평가",
            "description": "다변량 로지스틱 회귀 및 분류 모델을 구축하여 사고 상황에서 개인의 조건에 따른 생존율을 정밀 예측하는 시스템을 완성함.",
            "display_order": 5
        }
    ],

    'p-project-265': [
        {
            "id": "step-1",
            "project_id": "p-project-265",
            "title": "온라인 학습 행동 분석 연구 배경 및 목표 수립",
            "description": "시선 추적과 자세 인식을 결합하여 학습자의 집중 여부와 객관적인 판단 근거를 제시하는 AI 보조 시스템을 기획함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-265",
            "title": "학습 행동 분석 핵심 지표 정의",
            "description": "웹캠 영상에서 추출할 수 있는 고개 각도, 시선 방향, 상체 쏠림, 손 위치 등 4대 핵심 집중 지표를 구체화함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-265",
            "title": "영상 프레임 특징점 추출 및 데이터 전처리",
            "description": "안면 및 상체 랜드마크를 실시간 추출하고 프레임 단위 시계열 데이터로 정규화하는 파이프라인을 구축함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-265",
            "title": "집중 vs 비집중 이진 분류 머신러닝 모델 학습",
            "description": "추출된 자세 특징 데이터를 바탕으로 딴짓, 졸음, 이탈 상태를 정밀 분류하는 인공지능 모델을 훈련함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-project-265",
            "title": "학습 피드백 대시보드 및 맞춤형 리포트 구현",
            "description": "학습자에게 실시간 집중도 상태를 시각화하고, 집중도가 떨어진 원인 구간을 하이라이트하여 스스로 개선하도록 리포트를 제공함.",
            "display_order": 5
        }
    ],

    'p-vocab-learner-229': [
        {
            "id": "step-1",
            "project_id": "p-vocab-learner-229",
            "title": "EasyOCR 및 OpenCV 기반 이미지 처리 파이프라인 설계",
            "description": "학습지나 교재 사진에서 영어 단어를 정확히 추출하기 위해 VS Code 파이썬 환경에서 OpenCV 전처리와 EasyOCR 라이브러리를 구축함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-vocab-learner-229",
            "title": "자동 영단어 카드 추출 아이디어 구체화",
            "description": "수작업으로 단어장을 만드는 번거로움을 해결하기 위해 사진 촬영 한 번으로 단어장을 생성하는 자동화 워크플로우를 기획함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-vocab-learner-229",
            "title": "다국어 인식 및 CPU 연산 모드 최적화",
            "description": "한국어와 영어를 동시에 인식하도록 OCR 언어 팩을 설정하고, 저사양 PC에서도 원활히 동작하도록 CPU 연산 환경을 최적화함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-vocab-learner-229",
            "title": "추출 단어 텍스트 정제 및 단어장 카드 포맷팅",
            "description": "OCR로 인식된 텍스트의 오탈자를 정규식으로 보정하고 단어-뜻 쌍으로 정리하여 플래시 카드 형태로 자동 포맷팅함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-vocab-learner-229",
            "title": "단어 암기 퀴즈 및 오답 노트 기능 완성",
            "description": "생성된 단어장을 기반으로 플래시카드 암기 모드와 테스트 기능을 연동하여 학생 맞춤형 단어 학습 도구를 완성함.",
            "display_order": 5
        }
    ],

    'p-eclipse-simulator-969': [
        {
            "id": "step-1",
            "project_id": "p-eclipse-simulator-969",
            "title": "Python Pygame 기반 월식 물리 시뮬레이터 제작",
            "description": "지구 그림자와 달의 궤도 운동을 정밀하게 재현하여 월식 현상을 실시간 시각화하고 데이터를 생성하는 물리 시뮬레이터를 코딩함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-eclipse-simulator-969",
            "title": "달 이동 경로 및 위치 가상 데이터 20,000건 생성",
            "description": "다양한 달의 이동 경로와 고도 각도를 무작위 시뮬레이션하여 총 20,000건의 월식 관측 학습 데이터를 자동으로 수집·생성함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-eclipse-simulator-969",
            "title": "kNN(k-최근접 이웃) 머신러닝 분류 알고리즘 구축",
            "description": "새로운 달의 위치가 입력되었을 때 가장 인접한 학습 데이터 k개를 비교하여 개기월식, 부분월식 여부를 판별하는 모델을 설계함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-eclipse-simulator-969",
            "title": "데이터 크기별 5개 실험군(1,000~20,000건) 분할",
            "description": "데이터 크기가 예측 정확도에 미치는 영향을 규명하기 위해 1,000건, 2,000건, 5,000건, 10,000건, 20,000건 등 5종 파일로 분할함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-eclipse-simulator-969",
            "title": "학습(80%)·테스트(20%) 분리 검증 및 정확도 비교",
            "description": "각 데이터 크기별로 학습 데이터 80%, 테스트 데이터 20%를 분리하여 평가한 결과, 데이터가 증가할수록 개기월식 예측 정확도가 향상됨을 실증함.",
            "display_order": 5
        }
    ],

    'p-contract-analyzer-400': [
        {
            "id": "step-1",
            "project_id": "p-contract-analyzer-400",
            "title": "복잡한 계약서 및 독소 조항 문제점 분석",
            "description": "근로계약서, 임대차계약서 등 일반인이 이해하기 어려운 전문 용어와 불공정 조항으로 인한 소비자 피해 사례를 체계적으로 분석함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-contract-analyzer-400",
            "title": "위험 조항 분류 체계 및 소비자 피해 유형 도출",
            "description": "자동결제 연장, 과다 위약금, 일방적 해지 제한 등 분쟁이 빈번한 핵심 독소 조항 패턴을 표준 데이터베이스로 구축함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-contract-analyzer-400",
            "title": "OCR 기반 계약서 이미지 텍스트 추출 모듈 구현",
            "description": "스마트폰 촬영 사진이나 PDF 문서를 업로드하면 고성능 OCR 엔진을 통해 조항별 텍스트를 문단 단위로 자동 인식·추출함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-contract-analyzer-400",
            "title": "AI 자연어 처리 기반 위험 조항 자동 판별",
            "description": "추출된 계약 조항을 AI 언어 모델로 분석하여 불리한 독소 조항을 즉각 감지하고 위험도 점수를 산출하는 로직을 구축함.",
            "display_order": 4
        },
        {
            "id": "step-5",
            "project_id": "p-contract-analyzer-400",
            "title": "쉬운 말 요약 및 문해력 브릿지 설명 인터페이스 완성",
            "description": "사회초년생도 한눈에 위험을 파악할 수 있도록 복잡한 법률 용어를 쉬운 말로 풀이하고 대처 가이드를 안내하는 웹 시스템을 완성함.",
            "display_order": 5
        }
    ],

    'p-project-793': [
        {
            "id": "step-1",
            "project_id": "p-project-793",
            "title": "공공기관 공고 및 포스터 이미지 수집 파이프라인",
            "description": "대전시 교육청, 국립중앙과학관 등 주요 공공기관 웹사이트의 신규 교육 공고와 첨부 이미지를 실시간 수집하는 체계를 수립함.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-project-793",
            "title": "멀티모달 AI 기반 비정형 포스터 메타데이터 변환",
            "description": "비정형 포스터 이미지에서 행사 일시, 대상, 장소, 접수 링크 등 핵심 정보를 멀티모달 AI로 분석하여 정형 데이터로 자동 변환함.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-project-793",
            "title": "4단계 실시간 자동화 크롤링 및 필터링 설계",
            "description": "공고 수집, AI 데이터 파싱, 중복 검증, 실시간 데이터베이스 동기화의 4단계 완전 자동화 파이프라인을 구축함.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-project-793",
            "title": "React·Tailwind 기반 반응형 알림 웹 서비스 완성",
            "description": "지도 인터랙션, 맞춤형 필터링, 마감 공고 자동 숨김 기능을 갖춘 모바일 친화적 원클릭 교육 알림 서비스를 배포함.",
            "display_order": 4
        }
    ]
}

# 1. Update the target projects' processes
updated_count = 0
for p in projects:
    pid = p['id']
    if pid in PROCESS_UPDATES:
        p['processes'] = PROCESS_UPDATES[pid]
        updated_count += 1

print(f"Updated processes for {updated_count} projects.")

# 2. General text cleaning for broken spacing and common typos across ALL projects
REPLACEMENTS = [
    # Broken spacing
    ('사 용', '사용'),
    ('개 발', '개발'),
    ('제 작', '제작'),
    ('분 석', '분석'),
    ('학 습', '학습'),
    ('실 험', '실험'),
    ('그 램', '그램'),
    ('프 로', '프로'),
    ('프 로그램', '프로그램'),
    ('데 이터', '데이터'),
    ('알 고리즘', '알고리즘'),
    ('알고 리즘', '알고리즘'),
    ('시 스템', '시스템'),
    ('하 드웨어', '하드웨어'),
    ('소 프트웨어', '소프트웨어'),
    ('프레 임', '프레임'),
    ('인 터넷', '인터넷'),
    ('라 이브러리', '라이브러리'),
    ('모 델', '모델'),
    ('결 과', '결과'),
    ('문 제', '문제'),
    ('컴 퓨터', '컴퓨터'),
    ('tkitner', 'tkinter'),
    ('↓다.', ''),
    ('↓다', ''),
    ('↑다.', ''),
    ('↑다', ''),
    # Clean up double spaces if any created
    ('  ', ' ')
]

def clean_text(text):
    if not isinstance(text, str):
        return text
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    # Strip any leading bullets like "가. ", "나. ", "1. " from titles if at start
    return text.strip()

def clean_obj(obj):
    if isinstance(obj, str):
        return clean_text(obj)
    elif isinstance(obj, list):
        return [clean_obj(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: clean_obj(v) for k, v in obj.items()}
    return obj

projects = clean_obj(projects)

# 3. Save to data/projects-store.json
with open('data/projects-store.json', 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)

print("Saved data/projects-store.json")

# 4. Also synchronize data/sample-projects.ts
ts_content = f"""import {{ Project }} from "@/types/project";

export const SAMPLE_PROJECTS: Project[] = {json.dumps(projects, ensure_ascii=False, indent=2)};

export const sampleProjects = SAMPLE_PROJECTS;
"""

with open('data/sample-projects.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Synchronized data/sample-projects.ts")
