import json
import re

# Load projects-store.json
store_path = 'data/projects-store.json'
with open(store_path, 'r', encoding='utf-8') as f:
    projects = json.load(f)

updated_count = 0

for p in projects:
    if p['id'] == 'p-smart-robot-864':
        p['question'] = "바퀴가 나란히 두 개뿐인데도 넘어지지 않고 제자리에서 스스로 균형을 잡는 밸런싱 로봇을 어떻게 만들 수 있을까?"
        p['summary'] = "기존의 대형 이동 수단은 좁은 곳을 지나가기 힘들지만, 바퀴가 두 개인 밸런싱 로봇은 제자리에서 팽이처럼 360도 회전할 수 있고 좁은 길도 민첩하게 통과할 수 있습니다. 본 연구에서는 중력으로 인해 쉽게 쓰러지는 2륜 로봇의 한계를 극복하기 위해, 레고 스파이크 프라임의 자이로 센서와 비례·적분·미분(PID) 제어 알고리즘을 융합하고 40회 이상의 기구부 밸런싱 튜닝을 거쳐 제자리에서 안정적으로 중심을 유지하는 밸런싱 로봇을 성공적으로 구현했습니다."
        p['motivation'] = "요즘 길거리를 지나다 보면 바퀴가 두 개뿐인 전동 휠이나 세그웨이 같은 미래형 1인용 이동 수단을 타고 다니는 사람들을 자주 볼 수 있습니다. 자동차나 자전거와 다르게 바퀴가 나란히 두 개뿐인데도 앞으로 넘어지지 않고 쌩쌩 달리는 모습은 언제 보아도 아주 신기했습니다. 미래에는 도심의 복잡한 공간과 좁은 골목길에서도 자유롭게 다닐 수 있는 1인용 모빌리티가 훨씬 더 널리 쓰일 것입니다. 하지만 바퀴가 두 개뿐인 로봇은 가만히 두면 중력 때문에 앞으로 쿵 하고 쓰러질 수밖에 없기에, 로봇이 어떻게 스스로 기울기를 감지하고 넘어지지 않고 서 있을 수 있는지 그 물리적 원리와 정밀 제어 코딩을 직접 탐구해 보고 싶었습니다."
        p['description'] = "로봇의 무게 중심을 바닥 쪽으로 최대한 끌어내리기 위해 바퀴 축 위치를 앞뒤로 미세 조정하고, 상단 허브 블록의 각도를 다양하게 바꿔가며 40회 이상의 전복 실험 끝에 앞뒤 균형이 시소처럼 완벽히 맞는 저중심 기구부를 완성했습니다. 소프트웨어적으로는 자이로 센서의 목표 각도(0도)와 실시간 기울기 각도 사이의 오차를 기반으로, 1도 기울어졌을 때 모터를 즉각 돌려주는 비례 제어(Kp: 밀어주는 힘), 미세한 잔여 오차를 누적해 밀어주는 적분 제어(Ki: 모아주는 힘), 반대편으로 급격히 쏠리는 것을 방지하는 미분 제어(Kd: 브레이크 힘)를 체계적으로 설계하고 바닥 환경에 맞춰 0.1 단위로 튜닝하여 흔들림 없는 자동 균형 제어를 달성했습니다."
        p['reflection'] = "이번 탐구를 통해 자이로 센서와 레고 스파이크 프라임을 활용하여 두 바퀴로 스스로 중심을 잡고 서 있는 밸런싱 로봇을 성공적으로 제작했습니다. 로봇을 만들면서 단순히 인터넷에 있는 다른 사람의 코드를 그대로 가져다 쓰는 것만으로는 결코 성공할 수 없다는 귀중한 사실을 깨달았습니다. 로봇의 하드웨어 형태와 무게 중심의 위치, 특히 바퀴가 닿는 바닥면의 재질과 마찰력에 따라 코딩 제어 수치값(Kp, Ki, Kd)을 매번 다르게 조절해야 한다는 살아있는 과학적 원리를 배웠으며, 40번 넘게 로봇이 바닥에 쿵쿵 쓰러져도 포기하지 않고 끝까지 문제를 해결해 내는 강한 끈기와 자신감을 얻었습니다."
        p['next_question'] = "“지금은 제자리에서 완벽하게 서 있는 데 성공했지만, 앞으로 코딩과 센서 융합을 더 발전시켜 미끄러운 마루바닥에서 푹신한 거실 매트로 이동해도 끄떡없이 스스로 균형을 잡고 집 안을 주행하는 미래형 자율주행 로봇으로 발전시킬 수 있을까?”"
        p['processes'] = [
            {
                "id": "step-1",
                "project_id": "temp",
                "title": "자이로 센서 원리 학습 및 선행 연구",
                "description": "자이로 센서가 3차원 공간에서 기울기와 각속도를 감지하는 물리적 원리를 분석하고 선행 2륜 밸런싱 로봇 구조와 제어 방식을 체계적으로 조사했습니다.",
                "display_order": 1
            },
            {
                "id": "step-2",
                "project_id": "temp",
                "title": "40회 반복 실험을 통한 저중심 기구부 설계",
                "description": "무게 중심을 낮추기 위해 바퀴 구동축 위치를 이동하고 상단 부품 각도를 조절하며 40회 이상의 전복 테스트를 거쳐 앞뒤 시소 균형을 맞춘 하드웨어를 구축했습니다.",
                "display_order": 2
            },
            {
                "id": "step-3",
                "project_id": "temp",
                "title": "목표 각도(0도) 기반 PID 제어 알고리즘 코딩",
                "description": "기울기 오차를 즉각 보정하는 비례(Kp), 미세 누적 오차를 해소하는 적분(Ki), 급격한 오버슈트를 막는 미분(Kd) 제어 로직을 구현했습니다.",
                "display_order": 3
            },
            {
                "id": "step-4",
                "project_id": "temp",
                "title": "바닥 환경별 변수(Kp·Ki·Kd) 미세 튜닝 및 실증",
                "description": "바닥 재질과 마찰 조건에 따라 제어 변수를 0.1 단위로 정밀 조절하여 외란에도 넘어지지 않고 제자리에서 꼿꼿하게 균형을 유지하는 동작을 최종 검증했습니다.",
                "display_order": 4
            }
        ]
        updated_count += 1
        print("Updated p-smart-robot-864")

    elif p['id'] == 'p-smart-robot-990':
        p['description'] = "스파이크 프라임의 거리 센서와 모터를 결합하여 손이 다가오면 자동으로 열리고 정해진 시간(30초) 후 닫히는 절수 로봇을 제작했습니다. 초기 1~3차 제작 시에는 모터 2개와 기어비로도 실제 가정용 수도꼭지를 들어 올리기에 출력이 부족함을 확인하고, 4차 제작에서 기어비를 통한 출력 증강과 회전운동을 직선운동으로 변환하는 랙&피니언 메커니즘을 적용하여 모형 수도꼭지를 안정적으로 들어 올리고 타이머에 맞춰 내리는 동작을 완벽히 구현했습니다."
        updated_count += 1
        print("Updated p-smart-robot-990 description")

# Save projects-store.json
with open(store_path, 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)
print("Saved data/projects-store.json successfully.")

# Sync to data/sample-projects.ts
ts_path = 'data/sample-projects.ts'
ts_content = f"""import {{ Project }} from '@/types/project';

export const SAMPLE_PROJECTS: Project[] = {json.dumps(projects, ensure_ascii=False, indent=2)};
"""
with open(ts_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)
print(f"Synced {len(projects)} projects to data/sample-projects.ts successfully.")
print(f"Total updated: {updated_count}")
