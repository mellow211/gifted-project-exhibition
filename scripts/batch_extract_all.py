# -*- coding: utf-8 -*-
"""
대전교육정보원정보영재교육원 전체 5개 과정 (SW초급, SW고급, 로봇초급, 로봇고급, AI)
영재 프로젝트 일괄 추출 및 전시관 동기화 스크립트 (고도화 버전)
"""

import os
import re
import sys
import json
import shutil

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

from scripts.extract_pdf_project import process_pdf_project

COURSES = [
    ("SW초급", r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\변환(SW초급)"),
    ("SW고급", r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\변환(SW고급)"),
    ("로봇초급", r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\변환(로봇초급)"),
    ("로봇고급", r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\변환(로봇고급)"),
    ("AI", r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\변환(AI)"),
]

def clean_student_name(fname):
    fname_clean = os.path.splitext(fname)[0]

    # Special handling for SW초급 김주원 duplicates (샘머리초 vs 한밭초)
    if '김주원' in fname:
        if '샘머리' in fname:
            return '김주원_샘머리초'
        elif '한밭' in fname:
            return '김주원_한밭초'
        else:
            return '김주원'

    if '정율하' in fname:
        return '정율하'

    # 1. Match name in parentheses
    m = re.search(r'\((.*?)\)', fname)
    if m:
        c = m.group(1).strip()
        c = re.sub(r'^(SW고급|sw고급|SW초급|sw초급|로봇초급|로봇고급|로못고급|AI|ai)[\s\-_,]*', '', c).strip()
        c = re.sub(r'[\s\-_,]*(SW고급|sw고급|SW초급|sw초급|로봇초급|로봇고급|로못고급|AI|ai)$', '', c).strip()
        c = re.sub(r'^(유성중|문정중|지족중|한밭초|샘머리초)[\s\-_,]*', '', c).strip()
        tokens = c.split()
        if tokens:
            cand = tokens[-1].strip(' ,_')
            if len(cand) >= 2 and cand not in ('작품설명서', '보고서', '완성본', '발표자료'):
                return cand

    # 2. Check SW고급-06 박인수
    m_code = re.search(r'(?:SW고급|로봇고급|AI|로봇초급|SW초급)[-_ ]*\d*\s+([가-힣]{2,4})', fname)
    if m_code:
        cand = m_code.group(1).strip()
        if cand not in ('작품설명서', '보고서', '완성본', '발표자료'):
            return cand

    # 3. Check -이름 or _이름
    m2 = re.search(r'[\-_]\s*([가-힣]{2,4})$', fname_clean)
    if m2:
        cand = m2.group(1).strip()
        if cand not in ('작품설명서', '보고서', '완성본', '발표자료'):
            return cand

    # 4. Check SW초급 정율하 / SW초급_김태성
    m3 = re.search(r'(?:SW고급|로봇고급|AI|로봇초급|SW초급|sw초급)[_\s\-]+([가-힣]{2,4})', fname)
    if m3:
        cand = m3.group(1).strip()
        if cand not in ('작품설명서', '보고서', '완성본', '발표자료'):
            return cand

    # 5. Trailing 2-4 Hangul characters
    m4 = re.search(r'([가-힣]{2,4})$', fname_clean)
    if m4:
        cand = m4.group(1).strip()
        if cand not in ('작품설명서', '보고서', '완성본', '발표자료'):
            return cand

    return fname_clean


def run_batch_all():
    print(f"============================================================")
    print(f"대전교육정보원정보영재교육원 5개 과정 전체 프로젝트 분석 시작")
    print(f"============================================================")

    all_extracted_projects = []
    total_processed = 0
    existing_slugs = set()

    for cat_name, cat_dir in COURSES:
        print(f"\n==========================================")
        print(f"[{cat_name}] 과정 프로젝트 분석 시작: {cat_dir}")
        print(f"==========================================")
        
        reports = {}
        manuals = {}

        for root, dirs, files in os.walk(cat_dir):
            for f in sorted(files):
                if f.lower().endswith(".pdf"):
                    full_path = os.path.join(root, f)
                    sname = clean_student_name(f)
                    if "보고서" in root or "보고서" in f:
                        reports[sname] = (f, full_path)
                    elif "설명서" in root or "설명서" in f:
                        manuals[sname] = (f, full_path)

        # Unique students in this course
        unique_students = sorted(set(list(reports.keys()) + list(manuals.keys())))
        print(f"[{cat_name}] 총 탐구 학생: {len(unique_students)}명")

        for idx, student in enumerate(unique_students, 1):
            rep_entry = reports.get(student)
            man_entry = manuals.get(student)

            rep_path = rep_entry[1] if rep_entry else None
            man_path = man_entry[1] if man_entry else None

            clean_display_name = student.split('_')[0]

            print(f"  [{idx:02d}/{len(unique_students)}] {clean_display_name} (보고서: {'O' if rep_path else 'X'}, 설명서: {'O' if man_path else 'X'}) 분석 중...")
            try:
                p_data = process_pdf_project(
                    report_pdf=rep_path,
                    manual_pdf=man_path,
                    category_override=cat_name,
                    save_to_db=False,
                    student_name_hint=clean_display_name,
                    existing_slugs=existing_slugs
                )
                p_data["published"] = True
                p_data["is_public"] = True
                all_extracted_projects.append(p_data)
                total_processed += 1
                print(f"    -> 성공: [{p_data['title']}] | 학생: {p_data['student_display_names'][0]} | 학교: {p_data['team_name']} | 썸네일: {p_data['thumbnail_url'][:40]}")
            except Exception as e:
                print(f"    -> 오류 발생 ({clean_display_name}): {e}", file=sys.stderr)

    print(f"\n============================================================")
    print(f"전체 5개 과정 일괄 추출 완료: 총 {len(all_extracted_projects)}건")
    print(f"============================================================")

    # Assign sequential display_order
    for i, p in enumerate(all_extracted_projects):
        p["display_order"] = i + 1
        p["published"] = True
        p["is_public"] = True

    # Save to data/projects-store.json
    store_path = os.path.join(BASE_DIR, "data", "projects-store.json")
    with open(store_path, "w", encoding="utf-8") as f:
        json.dump(all_extracted_projects, f, ensure_ascii=False, indent=2)
    print(f"SUCCESS: data/projects-store.json 에 {len(all_extracted_projects)}개 실제 영재 프로젝트가 저장되었습니다!")

    # Synchronize with data/sample-projects.ts
    sample_ts_path = os.path.join(BASE_DIR, "data", "sample-projects.ts")
    with open(sample_ts_path, "w", encoding="utf-8") as f:
        f.write('import { Project } from "@/types/project";\n\n')
        f.write('export const SAMPLE_PROJECTS: Project[] = ')
        f.write(json.dumps(all_extracted_projects, ensure_ascii=False, indent=2))
        f.write(';\n')
    print(f"SUCCESS: data/sample-projects.ts 에도 {len(all_extracted_projects)}개 실데이터가 동기화되었습니다!")


if __name__ == "__main__":
    run_batch_all()
