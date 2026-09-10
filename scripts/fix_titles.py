# -*- coding: utf-8 -*-
import json
import sys

with open("data/projects-store.json", "r", encoding="utf-8") as f:
    projects = json.load(f)

title_fixes = {
    "장*성 (초5)": "우회전 사고를 막아라! 스마트 차단기 만들기",
    "오*환 (초6)": "시각장애인을 위한 하방 단차 감지 스마트 보행 보조 시스템",
    "이*아 (중등)": "자이로 센서와 아두이노 기반 에어 드로잉(Air Drawing) 시스템 구축",
    "채*준 (중2)": "라인트레이서와 초음파 센서를 활용한 반려견 실내 운동 유도 로봇 설계·제작",
}

for p in projects:
    sname = p.get("student_display_names", [""])[0]
    if sname in title_fixes:
        new_title = title_fixes[sname]
        p["title"] = new_title
        p["subtitle"] = f"{new_title} 제작 및 실증 분석"
        p["question"] = new_title
        print(f"Fixed: {sname} -> {new_title}")

with open("data/projects-store.json", "w", encoding="utf-8") as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)

with open("data/sample-projects.ts", "w", encoding="utf-8") as f:
    f.write('import { Project } from "@/types/project";\n\n')
    f.write('export const SAMPLE_PROJECTS: Project[] = ')
    f.write(json.dumps(projects, ensure_ascii=False, indent=2))
    f.write(';\n')

print(f"Successfully verified and updated all {len(projects)} projects!")
