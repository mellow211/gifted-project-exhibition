import fs from "fs";
import path from "path";
import { Project } from "@/types/project";
import { SAMPLE_PROJECTS } from "@/data/sample-projects";

const STORE_PATH = path.join(process.cwd(), "data", "projects-store.json");

let memoryProjects: Project[] | null = null;
let lastMtime = 0;

async function loadProjectsFromDisk(): Promise<Project[]> {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const stats = await fs.promises.stat(STORE_PATH);
      if (memoryProjects && stats.mtimeMs === lastMtime) {
        return memoryProjects;
      }
      const raw = await fs.promises.readFile(STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryProjects = parsed;
        lastMtime = stats.mtimeMs;
        return memoryProjects!;
      }
    }
  } catch (err) {
    console.warn("Failed to read projects-store.json, using fallback:", err);
  }

  // 초기화: sample-projects.ts 데이터 사용 및 디스크 저장
  memoryProjects = JSON.parse(JSON.stringify(SAMPLE_PROJECTS));
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(STORE_PATH, JSON.stringify(memoryProjects, null, 2), "utf-8");
    if (fs.existsSync(STORE_PATH)) {
      const stats = await fs.promises.stat(STORE_PATH);
      lastMtime = stats.mtimeMs;
    }
  } catch (err) {
    console.warn("Failed to write initial projects-store.json:", err);
  }

  return memoryProjects!;
}

async function persistProjects(projects: Project[]): Promise<void> {
  memoryProjects = projects;
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(STORE_PATH, JSON.stringify(projects, null, 2), "utf-8");
    if (fs.existsSync(STORE_PATH)) {
      const stats = await fs.promises.stat(STORE_PATH);
      lastMtime = stats.mtimeMs;
    }
  } catch (err) {
    console.error("Failed to persist projects-store.json:", err);
  }
}

export async function getServerProjects(includeUnpublished = false): Promise<Project[]> {
  const projects = await loadProjectsFromDisk();
  if (includeUnpublished) {
    return projects;
  }
  return projects.filter((p) => p.published !== false && (p as any).is_public !== false);
}

export async function getServerProjectBySlug(slug: string, includeUnpublished = false): Promise<Project | null> {
  const projects = await loadProjectsFromDisk();
  const found = projects.find((p) => p.slug === slug || p.id === slug);
  if (!found) return null;
  if (!includeUnpublished && (found.published === false || (found as any).is_public === false)) {
    return null;
  }
  return found;
}

export async function saveServerProject(project: Partial<Project> & { id?: string }): Promise<Project> {
  const projects = await loadProjectsFromDisk();
  let updatedProject: Project;

  if (project.id) {
    const index = projects.findIndex((p) => p.id === project.id || p.slug === project.slug);
    if (index >= 0) {
      updatedProject = {
        ...projects[index],
        ...project,
        updated_at: new Date().toISOString(),
      } as Project;
      projects[index] = updatedProject;
    } else {
      updatedProject = {
        ...SAMPLE_PROJECTS[0],
        ...project,
        id: project.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Project;
      projects.push(updatedProject);
    }
  } else {
    const newId = `p-${Date.now()}`;
    const slug = project.slug || `project-${Date.now()}`;
    updatedProject = {
      id: newId,
      slug,
      title: project.title || "새 영재 프로젝트",
      subtitle: project.subtitle || "",
      team_name: project.team_name || "연구팀",
      student_display_names: project.student_display_names || ["학생 1"],
      grade: project.grade || "중학교",
      program: project.program || "영재 심화과정",
      year: project.year || 2026,
      category: project.category || "SW초급",
      tags: project.tags || ["탐구"],
      question: project.question || "우리는 어떤 질문에서 시작했을까요?",
      summary: project.summary || "프로젝트 한 줄 요약",
      motivation: project.motivation || "연구 동기",
      description: project.description || "연구 내용",
      reflection: project.reflection || "배운 점",
      next_question: project.next_question || "새로운 질문",
      thumbnail_url:
        project.thumbnail_url ||
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
      featured: project.featured ?? false,
      published: project.published ?? true,
      display_order: project.display_order ?? projects.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      processes: project.processes || [],
    } as Project;
    projects.push(updatedProject);
  }

  await persistProjects(projects);
  return updatedProject;
}

export async function deleteServerProject(id: string): Promise<boolean> {
  const projects = await loadProjectsFromDisk();
  const filtered = projects.filter((p) => p.id !== id);
  await persistProjects(filtered);
  return true;
}

export async function toggleServerProjectPublished(id: string): Promise<boolean> {
  const projects = await loadProjectsFromDisk();
  const item = projects.find((p) => p.id === id);
  if (!item) return false;

  item.published = !item.published;
  item.updated_at = new Date().toISOString();
  await persistProjects(projects);
  return item.published;
}

export async function toggleServerProjectFeatured(id: string): Promise<boolean> {
  const projects = await loadProjectsFromDisk();
  const item = projects.find((p) => p.id === id);
  if (!item) return false;

  item.featured = !item.featured;
  item.updated_at = new Date().toISOString();
  await persistProjects(projects);
  return item.featured;
}

export async function setAllServerProjectsPublished(published: boolean): Promise<boolean> {
  const projects = await loadProjectsFromDisk();
  const now = new Date().toISOString();
  projects.forEach((p) => {
    p.published = published;
    (p as any).is_public = published;
    p.updated_at = now;
  });
  await persistProjects(projects);
  return true;
}

export async function resetServerProjects(): Promise<void> {
  const resetData: Project[] = JSON.parse(JSON.stringify(SAMPLE_PROJECTS));
  await persistProjects(resetData);
}

