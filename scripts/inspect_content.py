# -*- coding: utf-8 -*-
import json
import sys

with open("data/projects-store.json", "r", encoding="utf-8") as f:
    projects = json.load(f)

for idx in [20, 25, 35, 45, 55, 65, 75]:
    p = projects[idx]
    print(f"=== [{idx+1}] {p['category']} | {p['student_display_names'][0]} | {p['title']} ===")
    print("  [Summary]:", p.get("summary", "")[:150])
    print("  [Motivation]:", p.get("motivation", "")[:150])
    print("  [Description]:", p.get("description", "")[:150])
    print("  [Reflection]:", p.get("reflection", "")[:150])
    print("  [Processes]:", [proc["title"] for proc in p.get("processes", [])])
    print()
