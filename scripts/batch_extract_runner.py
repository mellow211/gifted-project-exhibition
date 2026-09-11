# -*- coding: utf-8 -*-
"""
대전교육정보원정보영재교육원 SW초급 20명 프로젝트 일괄 추출 및 저장 실행기
"""

import os
import sys
import json
import shutil

sys.stdout.reconfigure(encoding='utf-8')

# Add project root to sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

from scripts.extract_pdf_project import process_pdf_project
from scripts.batch_match_test import matched_pairs

def run_batch_import():
    print(f"=== SW초급 20명 프로젝트 일괄 추출 및 등록 시작 (총 {len(matched_pairs)}명) ===")
    
    all_projects = []
    
    for idx, item in enumerate(matched_pairs, 1):
        name = item["student"]
        report_pdf = item["report"]
        manual_pdf = item["manual"]
        
        print(f"\n[{idx:02d}/20] 분석 중: {name} ...")
        try:
            p_data = process_pdf_project(
                report_pdf=report_pdf,
                manual_pdf=manual_pdf,
                category_override="SW초급",
                save_to_db=False  # We will save the entire batch all at once
            )
            all_projects.append(p_data)
            print(f"  -> 성공: [{p_data['title']}] | 연구진: {p_data['student_display_names'][0]} | 슬러그: {p_data['slug']}")
        except Exception as e:
            print(f"  -> 오류 발생 ({name}): {e}", file=sys.stderr)

    print(f"\n=== 추출 완료: {len(all_projects)} / {len(matched_pairs)} ===")

    # Sort & assign display_order
    for i, p in enumerate(all_projects):
        p["display_order"] = i + 1

    # Overwrite data/projects-store.json with ONLY these real projects!
    store_path = os.path.join(BASE_DIR, "data", "projects-store.json")
    with open(store_path, "w", encoding="utf-8") as f:
        json.dump(all_projects, f, ensure_ascii=False, indent=2)
        
    print(f"SUCCESS: data/projects-store.json 에 {len(all_projects)}개 실제 영재 프로젝트가 저장되었습니다!")
    
    # Also update data/sample-projects.ts to export these exact projects as default fallback
    sample_ts_path = os.path.join(BASE_DIR, "data", "sample-projects.ts")
    with open(sample_ts_path, "w", encoding="utf-8") as f:
        f.write('import { Project } from "@/types/project";\n\n')
        f.write('export const SAMPLE_PROJECTS: Project[] = ')
        f.write(json.dumps(all_projects, ensure_ascii=False, indent=2))
        f.write(';\n')
    print(f"SUCCESS: data/sample-projects.ts 에도 실데이터 {len(all_projects)}개가 동기화되었습니다 (더미 데이터 완전 제거)!")

if __name__ == "__main__":
    run_batch_import()
