# -*- coding: utf-8 -*-
import json

with open("data/projects-store.json", "r", encoding="utf-8") as f:
    projects = json.load(f)

with open("data/project_titles.txt", "w", encoding="utf-8") as out:
    for idx, p in enumerate(projects):
        cat = p.get("category", "")
        sname = p.get("student_display_names", [""])[0]
        title = p.get("title", "")
        out.write(f"{idx+1:02d}. [{cat}] {sname} - {title}\n")

print(f"Exported {len(projects)} titles to data/project_titles.txt")
