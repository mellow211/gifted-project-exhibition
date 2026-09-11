import json

def main():
    with open('data/projects-store.json', 'r', encoding='utf-8') as f:
        projects = json.load(f)

    for p in projects:
        p['published'] = False
        p['is_public'] = False

    with open('data/projects-store.json', 'w', encoding='utf-8') as f:
        json.dump(projects, f, ensure_ascii=False, indent=2)

    content = 'import { Project } from "@/types/project";\n\nexport const SAMPLE_PROJECTS: Project[] = ' + json.dumps(projects, ensure_ascii=False, indent=2) + ';\n'

    with open('data/sample-projects.ts', 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Successfully updated all {len(projects)} projects in projects-store.json and sample-projects.ts to published: false, is_public: false")

if __name__ == '__main__':
    main()
