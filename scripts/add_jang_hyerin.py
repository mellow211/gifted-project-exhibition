# -*- coding: utf-8 -*-
"""
Add Jang Hye-rin (꽃말 사전 - SW고급) as project 85
"""

import json
import os

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
STORE_PATH = os.path.join(BASE_DIR, "data", "projects-store.json")
SAMPLE_PATH = os.path.join(BASE_DIR, "data", "sample-projects.ts")

new_project = {
    "id": "p-flower-dictionary-584",
    "title": "꽃말 사전",
    "slug": "flower-dictionary-584",
    "subtitle": "색상별 꽃말 검색과 한글 조합 입력을 지원하는 파이썬 Pygame 기반 맞춤형 꽃말 사전",
    "team_name": "대전송강중",
    "student_display_names": [
        "장*린 (중3)"
    ],
    "grade": "중학교 3학년",
    "program": "대전교육정보원정보영재교육원 SW고급 과정",
    "year": 2026,
    "category": "SW고급",
    "tags": [
        "SW고급",
        "Python",
        "Pygame",
        "GUI",
        "알고리즘"
    ],
    "question": "꽃의 종류와 색상에 따라 달라지는 꽃말을 선물하는 사람의 마음에 맞춰 쉽게 검색하고 추천받을 수 있는 인터랙티브 프로그램을 어떻게 구현할 수 있을까?",
    "summary": "선물할 꽃을 고를 때 꽃의 종류뿐만 아니라 색상에 따라 달라지는 상징적 의미를 손쉽게 찾을 수 있도록, 파이썬 Pygame 엔진을 활용하여 한글 조합 입력과 직관적인 GUI를 갖춘 '꽃말 사전'을 개발했습니다. 국립원예특작과학원 데이터 분석을 바탕으로 감정 키워드(사랑, 감사 등) 검색 기능과 색상별 세부 꽃말 안내 화면을 구현했습니다.",
    "motivation": "친구들의 졸업 꽃다발을 준비하면서 꽃의 색상마다 의미가 달라져 신중하게 골라야 했던 경험에서 출발했습니다. 말로 다 전하지 못하는 마음을 꽃말로 표현하고자 하는 사람들을 위해, 복잡한 검색 없이 원하는 의미와 꽃의 색상별 꽃말을 한눈에 조회할 수 있는 전용 프로그램을 만들고자 연구를 시작했습니다.",
    "description": "Pygame 환경에서 한글 음절 조합을 완벽히 지원하기 위해 pygame.key.start_text_input() 함수를 연동하고, 버튼 클릭 및 마우스 오버 인터랙션을 위해 collidepoint() 및 SRCALPHA 투명도 처리를 적용했습니다. 장미, 튤립, 안개꽃 등 주요 꽃에 대해 '사랑', '감사' 등의 키워드 검색 리스트를 구축하고, 꽃을 선택하면 붉은색, 푸른색, 노란색, 검은색 등 색상별 상세 꽃말이 깔끔한 카드 형태로 출력되도록 설계했습니다.",
    "reflection": "Pygame 라이브러리를 깊이 탐구하며 단순 그래픽 출력을 넘어 한글 입력 처리와 동적 이벤트 루프, 좌표 기반 UI 설계 원리를 체계적으로 체득했습니다. 평소 관심 있던 꽃말이라는 인문학적 소재를 소프트웨어 기술과 융합하여 실생활에 도움을 주는 유용한 프로그램을 완성하는 성취감을 맛보았습니다.",
    "next_question": "지금 구축된 꽃말 데이터베이스 리스트를 대폭 확장하고 실제 고화질 꽃 사진 갤러리를 연동하며, 나아가 선물 받는 대상(부모님, 친구, 은사님)과 계절, 예산을 입력하면 최적의 꽃다발 구성을 추천해주는 감성 맞춤형 추천 알고리즘으로 발전시키고 싶습니다.",
    "thumbnail_url": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=80",
    "poster_url": "/posters/flower-dictionary-584.jpg",
    "report_url": "/uploads/reports/flower-dictionary-584-report.pdf",
    "manual_url": "/uploads/manuals/flower-dictionary-584-manual.pdf",
    "created_at": "2026-09-04T00:00:00Z",
    "processes": [
        {
            "id": "step-1",
            "project_id": "p-flower-dictionary-584",
            "title": "선행 연구 및 문제 정의",
            "description": "국립원예특작과학원 꽃말 사전 분석을 통해 색상별 의미 검색의 불편점을 도출하고 사용자 요구사항 정립",
            "display_order": 1
        },
        {
            "id": "step-2",
            "project_id": "p-flower-dictionary-584",
            "title": "Pygame 기반 GUI 레이아웃 및 한글 입력 파이프라인 설계",
            "description": "start_text_input() 연동을 통한 한글 조합 입력기 구현 및 핑크빛 파스텔톤 UI/버튼 배치",
            "display_order": 2
        },
        {
            "id": "step-3",
            "project_id": "p-flower-dictionary-584",
            "title": "꽃말 데이터베이스 구조화 및 검색 알고리즘 구현",
            "description": "꽃 종류별 대표 꽃말과 색상별 세부 꽃말 매핑 리스트 구축 및 키워드 필터링 로직 코딩",
            "display_order": 3
        },
        {
            "id": "step-4",
            "project_id": "p-flower-dictionary-584",
            "title": "충돌 감지 및 세부 화면 전환 테스트",
            "description": "collidepoint() 기반 마우스 클릭 이벤트 처리, 상세 꽃말 카드 뷰 전환 및 예외 처리 검증",
            "display_order": 4
        }
    ],
    "likes": 0,
    "cheers": 0,
    "bookmarks": 0,
    "is_public": True,
    "published": True,
    "display_order": 85,
    "report_pdf_url": "/uploads/reports/flower-dictionary-584-report.pdf",
    "presentation_pdf_url": "/uploads/manuals/flower-dictionary-584-manual.pdf"
}

with open(STORE_PATH, "r", encoding="utf-8") as f:
    projects = json.load(f)

# Check if already present
existing_idx = next((i for i, p in enumerate(projects) if p.get("slug") == new_project["slug"]), -1)
if existing_idx >= 0:
    projects[existing_idx] = new_project
    print(f"Updated existing {new_project['slug']}")
else:
    projects.append(new_project)
    print(f"Added {new_project['slug']}, total projects now: {len(projects)}")

with open(STORE_PATH, "w", encoding="utf-8") as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)

ts_content = f"""import {{ Project }} from "@/types/project";

export const SAMPLE_PROJECTS: Project[] = {json.dumps(projects, ensure_ascii=False, indent=2)};
"""

with open(SAMPLE_PATH, "w", encoding="utf-8") as f:
    f.write(ts_content)

print(f"Synced {STORE_PATH} and {SAMPLE_PATH} with {len(projects)} projects.")
