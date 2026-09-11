# -*- coding: utf-8 -*-
"""
대전교육정보원정보영재교육원 SW초급 20명 전체 프로젝트 일괄 추출 및 등록 스크립트
"""

import os
import sys
import glob
import re
import json

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"C:\Users\mello\Downloads\drive-download-20260909T131445Z-1-001\변환(SW초급)"

STUDENTS = [
    ("강려원", None),
    ("김수현", None),
    ("김예린", None),
    ("김재희", None),
    ("김주원", "샘머리"),
    ("김주원", "한밭"),
    ("김지온", None),
    ("김채원", None),
    ("김태성", None),
    ("김한율", None),
    ("맹주혁", None),
    ("박시은", None),
    ("이규원", None),
    ("이주안", None),
    ("이준우", None),
    ("정율하", None),
    ("조시훈", None),
    ("최재현", None),
    ("표성운", None),
    ("한정민", None),
]

reports = glob.glob(os.path.join(BASE_DIR, "**", "*보고서*.pdf"), recursive=True)
manuals = glob.glob(os.path.join(BASE_DIR, "**", "*설명서*.pdf"), recursive=True)

print(f"Total Reports found: {len(reports)}, Total Manuals found: {len(manuals)}")

matched_pairs = []
for name, hint in STUDENTS:
    r_file = None
    m_file = None
    for r in reports:
        bn = os.path.basename(r)
        if name in bn:
            if hint and hint not in bn:
                continue
            if not hint and ("한밭" in bn or "샘머리" in bn):
                continue
            r_file = r
            break
            
    for m in manuals:
        bn = os.path.basename(m)
        if name in bn:
            if hint and hint not in bn:
                continue
            if not hint and ("한밭" in bn or "샘머리" in bn):
                continue
            m_file = m
            break

    label = f"{name} ({hint})" if hint else name
    matched_pairs.append({
        "student": label,
        "name": name,
        "hint": hint,
        "report": r_file,
        "manual": m_file,
    })

missing = [p for p in matched_pairs if not p["report"] or not p["manual"]]
if missing:
    print(f"Warning: {len(missing)} students missing files:")
    for m in missing:
        print(f" - {m['student']}: Report={bool(m['report'])}, Manual={bool(m['manual'])}")
else:
    print("SUCCESS: All 20 student report-manual pairs matched perfectly!")

for idx, p in enumerate(matched_pairs, 1):
    print(f"{idx:02d}. {p['student']}:")
    print(f"    Report: {os.path.basename(p['report']) if p['report'] else 'NONE'}")
    print(f"    Manual: {os.path.basename(p['manual']) if p['manual'] else 'NONE'}")
