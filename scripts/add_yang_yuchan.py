import os
import shutil
import json
import pymupdf
from PIL import Image

def main():
    src_folder = r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\추가3"
    src_report = os.path.join(src_folder, "2026년 개인주제탐구발표대회 보고서(양식)(5학년_양유찬_로봇고급).pdf")
    src_manual = os.path.join(src_folder, "2026년 개인주제탐구발표대회 작품설명서(5학년_양유찬_로봇고급).pdf")

    dst_report = "public/uploads/reports/carbon-neutral-fan-632-report.pdf"
    dst_manual = "public/uploads/manuals/carbon-neutral-fan-632-manual.pdf"
    dst_poster = "public/posters/carbon-neutral-fan-632.jpg"

    os.makedirs("public/uploads/reports", exist_ok=True)
    os.makedirs("public/uploads/manuals", exist_ok=True)
    os.makedirs("public/posters", exist_ok=True)

    # 1. Copy PDF files
    shutil.copyfile(src_report, dst_report)
    shutil.copyfile(src_manual, dst_manual)
    print(f"Copied report ({os.path.getsize(dst_report)} bytes) and manual ({os.path.getsize(dst_manual)} bytes)")

    # 2. Render A4 Poster (Manual page 1)
    doc = pymupdf.open(src_manual)
    page = doc[0]
    pix = page.get_pixmap(dpi=200)
    temp_img_path = "scratch/temp_yang_poster.png"
    pix.save(temp_img_path)
    
    with Image.open(temp_img_path) as img:
        # Resize to standard A4 high-res: 1600x2134
        img_resized = img.resize((1600, 2134), Image.Resampling.LANCZOS)
        img_resized.convert("RGB").save(dst_poster, "JPEG", quality=90)
    print(f"Generated A4 poster: {dst_poster} ({os.path.getsize(dst_poster)} bytes)")

    # 3. Create Project Record
    new_project = {
        "id": "p-carbon-neutral-fan-632",
        "title": "에너지 절약형 탄소중립 로봇 팬 시스템",
        "slug": "carbon-neutral-fan-632",
        "subtitle": "CO2 농도와 조도 조건을 결합한 아두이노 기반 에너지 절약형 온실가스 자동 정화 팬 시스템",
        "team_name": "한밭초",
        "student_display_names": [
            "양*찬 (초5)"
        ],
        "grade": "초등학교 5학년",
        "program": "대전교육정보원정보영재교육원 로봇고급 과정",
        "year": 2026,
        "category": "로봇고급",
        "tags": [
            "로봇고급",
            "탄소중립",
            "아두이노",
            "환경센서",
            "에너지절약"
        ],
        "question": "이산화탄소 농도와 조도 조건을 결합하여 필요한 때만 작동하는 에너지 절약형 온실가스 정화 로봇 팬을 만들 수 있을까?",
        "summary": "기후위기 대응과 공장 주변 온실가스 관리를 위해 CO2 센서와 조도센서를 연동하여, 기준 농도 초과 시에만 작동하고 야간 비작업 시간대에는 전력을 절감하는 탄소중립 로봇 팬 시스템을 개발했다.",
        "motivation": "기후위기 대응과 공장 주변의 효율적인 온실가스 관리 필요성에 주목하였다. 단순 환기 장치에서 나아가, CO2 농도와 주변 조도를 함께 판단하여 필요한 때만 팬이 작동하는 에너지 절약형 시스템을 설계하고자 탐구를 시작하였다.",
        "description": "에듀메이커 보드와 아두이노를 기반으로 MH-Z19 이산화탄소 센서, 조도 센서(CdS), DC 모터 팬을 연동하였다. 이산화탄소 농도가 1000ppm을 초과할 때 제어 알고리즘에 따라 DC 모터 팬이 자동 회전하며, 조도 센서 측정값이 500 미만인 어두운 비작업 시간대에는 팬 작동을 제한하여 불필요한 전력 소모를 줄이도록 복합 제어 알고리즘을 구현하였다. 또한 사용자가 시리얼 모니터를 통해 목표 회수 횟수를 직접 설정하고 달성 여부를 알림으로 확인할 수 있는 기능을 개발하였다.",
        "reflection": "이산화탄소 농도와 조도 조건을 결합한 복합 자동 제어 시스템이 의도대로 정확히 작동함을 확인하였다. 특히 비작업 시간에는 팬 구동을 제한하여 효율적인 에너지 절약형 온실가스 제어 가능성을 입증했다.",
        "next_question": "실제 이산화탄소 흡착 필터를 장착하여 정화 전후의 농도 감소율을 수치화하고, 메탄가스나 미세먼지 등 복합 온실가스 센서 및 RTC 실시간 시계 모듈을 연동한 고도화 시스템으로 발전시킬 수 있을까?",
        "thumbnail_url": "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80",
        "poster_url": "/posters/carbon-neutral-fan-632.jpg",
        "report_url": "/uploads/reports/carbon-neutral-fan-632-report.pdf",
        "manual_url": "/uploads/manuals/carbon-neutral-fan-632-manual.pdf",
        "report_pdf_url": "/uploads/reports/carbon-neutral-fan-632-report.pdf",
        "presentation_pdf_url": "/uploads/manuals/carbon-neutral-fan-632-manual.pdf",
        "created_at": "2026-09-04T00:00:00Z",
        "processes": [
            {
                "id": "step-1",
                "project_id": "p-carbon-neutral-fan-632",
                "title": "아이디어 구상 및 복합 센서 제어 회로 설계",
                "description": "기후위기 대응을 위한 온실가스 배출 관리 필요성을 분석하고, 에듀메이커 보드에 MH-Z19 이산화탄소 센서, 조도 센서, DC 모터 팬을 배치하는 하드웨어 회로도 및 핀맵 구성",
                "display_order": 1
            },
            {
                "id": "step-2",
                "project_id": "p-carbon-neutral-fan-632",
                "title": "이산화탄소 및 조도 복합 조건 제어 알고리즘 구현",
                "description": "아두이노 IDE를 활용하여 CO2 농도 1000ppm 초과 감지 및 조도 500 기준 주야간 작업시간 판별 if문 복합 제어 로직과 시리얼 모니터 통신 코딩",
                "display_order": 2
            },
            {
                "id": "step-3",
                "project_id": "p-carbon-neutral-fan-632",
                "title": "센서 감지 테스트 및 사용자 목표 회수 알림 구현",
                "description": "날숨 노출 실험을 통해 실시간 100~200ppm 농도 변화에 따른 모터 팬 자동 구동을 검증하고, 시리얼 모니터로 목표 회수 횟수(4회) 달성 알림 기능 테스트",
                "display_order": 3
            },
            {
                "id": "step-4",
                "project_id": "p-carbon-neutral-fan-632",
                "title": "실험 결과 분석 및 에너지 절약 탄소중립 모델 도출",
                "description": "비작업 시간대 팬 작동 제한을 통한 전력 절감 효과를 검증하고, 흡착 필터 결합 및 복합 가스 센서 확장을 위한 발전 과제 도출",
                "display_order": 4
            }
        ],
        "likes": 0,
        "cheers": 0,
        "bookmarks": 0,
        "is_public": False,
        "published": False,
        "display_order": 86
    }

    # 4. Update data/projects-store.json
    with open("data/projects-store.json", "r", encoding="utf-8") as f:
        store = json.load(f)

    # Remove if existing
    store = [p for p in store if p.get("id") != new_project["id"] and p.get("slug") != new_project["slug"]]
    store.append(new_project)

    with open("data/projects-store.json", "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2)
    print(f"Updated data/projects-store.json (total: {len(store)})")

    # 5. Update data/sample-projects.ts
    content = 'import { Project } from "@/types/project";\n\nexport const SAMPLE_PROJECTS: Project[] = ' + json.dumps(store, ensure_ascii=False, indent=2) + ';\n'
    with open("data/sample-projects.ts", "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Updated data/sample-projects.ts (total: {len(store)})")

if __name__ == "__main__":
    main()
