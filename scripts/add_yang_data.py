import json

with open('scratch/yang_project.json', 'r', encoding='utf-8') as f:
    yang = json.load(f)

yang['published'] = True
yang['is_public'] = True
yang['display_order'] = 86

# 1. Update projects-store.json
with open('data/projects-store.json', 'r', encoding='utf-8') as f:
    store = json.load(f)

store = [p for p in store if p['id'] != yang['id'] and p['slug'] != yang['slug']]
store.append(yang)

with open('data/projects-store.json', 'w', encoding='utf-8') as f:
    json.dump(store, f, ensure_ascii=False, indent=2)

print('Updated projects-store.json total count:', len(store))

# 2. Update sample-projects.ts
ts_content = 'import { Project } from "@/types/project";\n\nexport const SAMPLE_PROJECTS: Project[] = ' + json.dumps(store, ensure_ascii=False, indent=2) + ';\n'
with open('data/sample-projects.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print('Updated sample-projects.ts total count:', len(store))
