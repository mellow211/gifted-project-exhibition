# -*- coding: utf-8 -*-
import json
import sys

with open("data/projects-store.json", "r", encoding="utf-8") as f:
    projects = json.load(f)

fallback_count = 0
thumb_fallback_count = 0

print("=== AUDIT OF ALL 83 PROJECTS ===")
for idx, p in enumerate(projects):
    issues = []
    if "교육과정에서 배운 기술을 활용하여" in p.get("summary", ""):
        issues.append("Fallback Summary")
    if "에서 일상생활의 불편함을" in p.get("motivation", ""):
        issues.append("Fallback Motivation")
    if "본 연구는 알고리즘 설계와 프로그램 제작" in p.get("description", ""):
        issues.append("Fallback Description")
    if "프로그램을 처음부터 완벽하게" in p.get("reflection", ""):
        issues.append("Fallback Reflection")
    if p.get("thumbnail_url", "").startswith("/thumbnails/"):
        issues.append("Poster as Hero Image")
        thumb_fallback_count += 1

    if issues:
        fallback_count += 1
        sname = p.get("student_display_names", [""])[0]
        title = p.get("title", "")[:25]
        cat = p.get("category", "")
        print(f"[{idx+1:02d}] {cat} | {sname} | {title}")
        print(f"     Issues: {', '.join(issues)}")

print(f"\nTotal projects with issues: {fallback_count} / {len(projects)}")
print(f"Total projects with poster-as-hero image: {thumb_fallback_count} / {len(projects)}")
