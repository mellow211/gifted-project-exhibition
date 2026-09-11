import json
import re

store_path = 'data/projects-store.json'
with open(store_path, 'r', encoding='utf-8') as f:
    projects = json.load(f)

print(f"Current projects in store: {len(projects)}")

# 1. Add Seok Jae-won (로봇초급)
new_project = {
    "id": "p-recycling-cleaning-robot-319",
    "title": "재활용품 분리수거 인공지능 청소 로봇",
    "slug": "recycling-cleaning-robot-319",
    "subtitle": "SPIKE Prime과 X·Y 좌표 제어 및 컬러·초음파 센서 기반 자율주행 재활용 수거 로봇",
    "team_name": "대전노은초",
    "student_display_names": [
        "석*원 (초5)"
    ],
    "grade": "초등학교 5학년",
    "program": "대전교육정보원정보영재교육원 로봇초급 과정",
    "year": 2026,
    "category": "로봇초급",
    "tags": [
        "로봇초급",
        "AI",
        "자율주행",
        "환경",
        "스마트시티"
    ],
    "question": "청소 구역을 스스로 주행하며 폐기물을 초음파와 컬러 센서로 인식하고, 지게차 리프트로 정확히 분리배출하는 AI 청소 로봇을 어떻게 만들 수 있을까?",
    "summary": "현대 사회에서 급증하는 생활폐기물 중 잘못 배출된 재활용품을 자동으로 선별하기 위해, 레고 스파이크 프라임(SPIKE Prime)을 활용한 자율주행 분리수거 청소 로봇을 개발했습니다. X·Y 좌표 변수 알고리즘을 설계해 사각 청소 구역을 스스로 주행하고, 초음파 거리 센서(6.5cm 이내)로 폐기물을 감지한 뒤 지게차 리프트 메커니즘과 컬러 센서로 색상(빨강·초록)을 판별하여 해당 분리수거함 위치로 정확하게 운반 및 배출하도록 구현했습니다.",
    "motivation": "현대 사회에서 생활폐기물의 발생량이 지속적으로 증가하면서 재활용의 중요성이 매우 커지고 있습니다. 하지만 일상 속에서는 여러 종류의 쓰레기가 마구 섞이거나 잘못 분류되어 버려지는 경우가 많아 재활용 효율을 크게 떨어뜨리고, 추가적인 인력과 비용이 소모되는 문제가 있습니다. 이에 청소 공간 내에서 로봇이 스스로 돌아다니며 재활용품을 감지하고 자동으로 분리수거해 주는 AI 청소 로봇을 만들어 환경 문제 해결에 기여하고자 탐구를 시작했습니다.",
    "description": "처음에는 집게 형태로 쓰레기를 잡으려 했으나 교구 한계로 실패를 겪은 후, 모터 회전(540도)을 이용해 지게차처럼 들어 올리고 내려놓는 안정적인 리프트 기구부를 설계했습니다. 로봇은 40% 속도로 주행하며 시간 변수와 X·Y 좌표를 0.1 단위로 계산하여 현재 위치를 정밀 추적합니다. 포트E 거리 센서로 6.5cm 이내의 폐기물을 감지하면 리프트로 적재한 후 컬러 센서로 빨간색과 초록색을 판별하고, 해당 수거함 좌표를 역계산해 최적 경로로 이동하여 안전하게 배출하도록 알고리즘을 완성했습니다.",
    "reflection": "로봇의 주행 시간 값을 위치 값으로 환산하여 X, Y 좌표 변수에 저장하는 과정과, 집게 대신 지게차 리프트 구조로 하드웨어를 변경하는 과정에서 많은 실패와 시행착오를 겪었습니다. 또한 바닥 마찰로 인한 바퀴 미끌림 오차를 보정하기 위해 프로그램에 오차 허용 범위를 반영하면서 정밀 제어의 중요성을 배웠으며, 포기하지 않고 문제를 끝까지 해결해 내는 문제 해결력을 기를 수 있었습니다.",
    "next_question": "지금은 정해진 순환 경로를 돌며 분리수거를 수행하지만, 앞으로 지도 작성과 센서 융합을 발전시켜 폐기물 수거 위치까지 최단 경로를 실시간 계산해 이동하는 고효율 자율주행 로봇으로 발전시킬 수 있을까?",
    "thumbnail_url": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    "poster_url": "/posters/recycling-cleaning-robot-319.jpg",
    "report_url": "/uploads/reports/recycling-cleaning-robot-319-report.pdf",
    "manual_url": "/uploads/manuals/recycling-cleaning-robot-319-manual.pdf",
    "created_at": "2026-09-10T12:00:00Z",
    "processes": [
        {
            "id": "step-1",
            "project_id": "temp",
            "title": "AI 청소 로봇 요구기능 분석 및 사전 설계",
            "description": "2륜 구동 주행 모터 제어 방식과 X·Y 좌표 변수를 활용한 위치 추적 알고리즘을 수립하고 폐기물 수거용 리프트 메커니즘을 구상했습니다.",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "temp",
            "title": "지게차 리프트 기구부 및 모형 제작",
            "description": "집게 구조의 한계를 보완하기 위해 540도 모터 회전 기반의 지게차형 리프트 하드웨어를 제작하고 초음파·컬러 센서를 장착했습니다.",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "temp",
            "title": "자율주행 좌표 계산 및 색상 인식 코딩",
            "description": "시간 변수 기반 X·Y 좌표 갱신 로직, 6.5cm 이내 장애물 감지, 빨강·초록 색상 분류 및 목표 수거함 좌표 산출 알고리즘을 프로그래밍했습니다.",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "temp",
            "title": "경로별 폐기물 수거 실증 및 오차 보정",
            "description": "경로 1~4에서 색상별 폐기물을 들어 올리고 지정 수거함으로 이송하는 테스트를 완수하고 바퀴 미끌림 오차 허용 범위를 프로그램에 최종 반영했습니다.",
            "display_order": 4
        }
    ],
    "likes": 0,
    "cheers": 0,
    "bookmarks": 0,
    "is_public": True,
    "published": True,
    "display_order": 84,
    "report_pdf_url": "/uploads/reports/recycling-cleaning-robot-319-report.pdf",
    "presentation_pdf_url": "/uploads/manuals/recycling-cleaning-robot-319-manual.pdf",
    "updated_at": "2026-09-11T00:00:00Z"
}

# Check if Seok Jae-won already exists
existing_seok = [p for p in projects if p['id'] == 'p-recycling-cleaning-robot-319' or p['slug'] == 'recycling-cleaning-robot-319']
if not existing_seok:
    projects.append(new_project)
    print("Added new project: p-recycling-cleaning-robot-319")
else:
    for idx, p in enumerate(projects):
        if p['id'] == 'p-recycling-cleaning-robot-319':
            projects[idx] = new_project
    print("Updated existing Seok Jae-won project")

# 2. Update Pyo Si-yeon (smart-planter-751)
for p in projects:
    if p['id'] == 'p-smart-planter-751':
        p['description'] = "아두이노 UNO 보드를 중심으로 토양습도센서, 온습도센서(DHT11), 조도센서를 통합하고 포맥스 3D 외형 기구부를 제작했습니다. 단순 ON/OFF 방식의 기계식 릴레이 한계를 극복하기 위해 PWM 미세 풍량 조절이 가능한 L9110S 모터 드라이버로 개선하였으며, 4가지 핵심 이상증세인 냉해(10℃ 미만 시 급수 차단), 열해(30℃ 초과 및 건조 시 환기팬 및 급수 가동), 과습(24시간 후에도 50% 이상 유지 시 급수 차단 및 환기팬 가동), 광부족(기준치 이하 시 네오픽셀 보조 LED 점등) 대응 알고리즘을 체계적으로 구현했습니다."
        p['next_question'] = "내가 설정한 4가지 환경 문제 외에 아두이노에 인공지능(AI) 카메라 모듈을 결합해 식물 잎의 병충해를 실시간 시각 진단하고, 식물 종류별 맞춤형 최적 환경 데이터베이스로 확장할 수 있을까?"
        p['report_url'] = "/uploads/reports/smart-planter-751-report.pdf"
        p['report_pdf_url'] = "/uploads/reports/smart-planter-751-report.pdf"
        print("Updated p-smart-planter-751 with 11-page report details")

# 3. Update Kim Joo-won (emotion-diary-340)
for p in projects:
    if p['id'] == 'p-emotion-diary-340':
        p['subtitle'] = "오늘의 기분과 공부 기록을 바탕으로 새싹이 피드백 및 감정별 학습 패턴을 분석하는 맞춤형 다이어리"
        p['manual_url'] = "/uploads/manuals/emotion-diary-340-manual.pdf"
        p['presentation_pdf_url'] = "/uploads/manuals/emotion-diary-340-manual.pdf"
        p['poster_url'] = "/posters/emotion-diary-340.jpg"
        p['next_question'] = "친구들과 기분별 학습 패턴을 비교하는 기능을 확장하고, 정해진 시간에 '오늘 기분 기록 저장하셨나요?'라고 알림해 주는 맞춤형 스마트 코칭 서비스로 발전시킬 수 있을까?"
        print("Updated p-emotion-diary-340 with official manual details and poster")

# 4. Update Lee Su-ah (project-941)
for p in projects:
    if p['id'] == 'p-project-941':
        p['manual_url'] = "/uploads/manuals/project-941-manual.pdf"
        p['presentation_pdf_url'] = "/uploads/manuals/project-941-manual.pdf"
        p['poster_url'] = "/posters/project-941.jpg"
        print("Updated p-project-941 with official manual details and poster")

# Save to projects-store.json
with open(store_path, 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)
print(f"Saved {len(projects)} projects to {store_path}")

# Sync to sample-projects.ts
ts_path = 'data/sample-projects.ts'
ts_content = f"import {{ Project }} from '@/types/project';\n\nexport const SAMPLE_PROJECTS: Project[] = {json.dumps(projects, ensure_ascii=False, indent=2)};\n"
with open(ts_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)
print(f"Synced {len(projects)} projects to {ts_path}")
