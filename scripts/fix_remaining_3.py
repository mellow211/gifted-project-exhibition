import json

with open('data/projects-store.json', 'r', encoding='utf-8') as f:
    projects = json.load(f)

for p in projects:
    if p['id'] == 'p-safety-helper-073':
        if p.get('description', '').startswith('닥의 색을'):
            p['description'] = '바' + p['description']
    elif p['id'] == 'p-safety-helper-547':
        if p.get('reflection', '').startswith('소감이 탐구를'):
            p['reflection'] = p['reflection'].replace('소감이 탐구를', '이번 탐구를', 1)
        if p.get('next_question', '').startswith('이 일정한 비례를'):
            p['next_question'] = '속도와 제동 거리 간의 일정한 비례 관계를 활용하여 안전 제동 시스템을 발전시키고자 합니다.'
    elif p['id'] == 'p-autonomous-car-689':
        if p.get('reflection', '').startswith('이 탐구 주제의'):
            p['reflection'] = '이번' + p['reflection'][1:]

with open('data/projects-store.json', 'w', encoding='utf-8') as f:
    json.dump(projects, f, ensure_ascii=False, indent=2)

ts_content = f"""import {{ Project }} from "@/types/project";

export const SAMPLE_PROJECTS: Project[] = {json.dumps(projects, ensure_ascii=False, indent=2)};

export const sampleProjects = SAMPLE_PROJECTS;
"""

with open('data/sample-projects.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Updated 3 projects and synchronized successfully.")
