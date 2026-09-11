import { Project, ProjectFilterState, ExhibitionStats } from "@/types/project";
import { SAMPLE_PROJECTS } from "@/data/sample-projects";
import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEY = "gifted_exhibition_projects_v1";

// Helper for local storage
function getLocalProjects(): Project[] {
  if (typeof window === "undefined") return SAMPLE_PROJECTS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROJECTS));
      return SAMPLE_PROJECTS;
    }
    return JSON.parse(saved);
  } catch {
    return SAMPLE_PROJECTS;
  }
}

function saveLocalProjects(projects: Project[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error("Failed to save to localStorage", e);
    }
  }
}

export async function getAllProjects(includeUnpublished = false): Promise<Project[]> {
  // 1. 서버 사이드 환경 (SSR / Server Component)
  if (typeof window === "undefined") {
    try {
      const { getServerProjects } = await import("./server-storage");
      return await getServerProjects(includeUnpublished);
    } catch (e) {
      console.warn("Failed to load server projects, falling back:", e);
      return includeUnpublished ? SAMPLE_PROJECTS : SAMPLE_PROJECTS.filter((p) => p.published);
    }
  }

  // 2. 클라이언트 사이드 환경: /api/projects 호출
  try {
    const res = await fetch(`/api/projects?includeUnpublished=${includeUnpublished}&_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache" },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        if (includeUnpublished || data.length > 0) {
          saveLocalProjects(data);
        }
        return data as Project[];
      }
    }
  } catch (err) {
    console.warn("Client fetch /api/projects failed, fallback to local storage:", err);
  }

  // 3. 네트워크 오프라인 시 로컬스토리지 fallback
  const projects = getLocalProjects();
  if (includeUnpublished) return projects;
  return projects.filter((p) => p.published !== false && (p as any).is_public !== false);
}

export async function getProjectBySlug(slug: string, includeUnpublished = false): Promise<Project | null> {
  // 1. 서버 사이드 환경
  if (typeof window === "undefined") {
    try {
      const { getServerProjectBySlug } = await import("./server-storage");
      return await getServerProjectBySlug(slug, includeUnpublished);
    } catch (e) {
      console.warn("Failed to load server project by slug, falling back:", e);
      const found = SAMPLE_PROJECTS.find((p) => p.slug === slug || p.id === slug);
      if (!found) return null;
      if (!includeUnpublished && (found.published === false || (found as any).is_public === false)) return null;
      return found;
    }
  }

  // 2. 클라이언트 사이드 환경
  try {
    const res = await fetch(
      `/api/projects?slug=${encodeURIComponent(slug)}&includeUnpublished=${includeUnpublished}&_t=${Date.now()}`,
      {
        cache: "no-store",
        headers: { "Cache-Control": "no-cache" },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) {
        return data as Project;
      }
    }
  } catch (err) {
    console.warn("Client fetch project by slug failed, fallback to local:", err);
  }

  // 3. 로컬스토리지 fallback
  const projects = getLocalProjects();
  const found = projects.find((p) => p.slug === slug || p.id === slug);
  if (!found) return null;
  if (!includeUnpublished && (found.published === false || (found as any).is_public === false)) return null;
  return found;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getAllProjects();
  const featured = projects.filter((p) => p.featured);
  return featured.length > 0 ? featured.slice(0, 4) : projects.slice(0, 4);
}

export async function getRelatedProjects(currentSlug: string, category: string, tags: string[] = []): Promise<Project[]> {
  const projects = await getAllProjects();
  const filtered = projects.filter((p) => p.slug !== currentSlug);

  // Score by matching category and tags
  const scored = filtered.map((p) => {
    let score = 0;
    if (p.category === category) score += 3;
    const commonTags = p.tags.filter((t) => tags.includes(t)).length;
    score += commonTags * 2;
    return { project: p, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, 3).map((item) => item.project);
}

export async function getExhibitionStats(): Promise<ExhibitionStats> {
  const projects = await getAllProjects(true);
  const totalProjects = projects.length;

  // Calculate unique categories
  const categories = new Set(projects.map((p) => p.category));

  // 개인주제탐구발표대회는 1인 1탐구 원칙이므로 각 프로젝트당 참여학생 1명
  const totalStudents = projects.reduce((acc, p) => acc + (p.student_display_names?.length || 1), 0);

  return {
    totalProjects,
    totalStudents,
    totalFields: Math.max(categories.size, 5),
  };
}

export function filterProjects(projects: Project[], filters: ProjectFilterState): Project[] {
  return projects.filter((p) => {
    // Search Query (title, student_display_names, summary, tags, question)
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const inTitle = p.title.toLowerCase().includes(q);
      const inSubtitle = p.subtitle?.toLowerCase().includes(q) ?? false;
      const inStudents = p.student_display_names.some((name) => name.toLowerCase().includes(q));
      const inTeam = p.team_name?.toLowerCase().includes(q) ?? false;
      const inSummary = p.summary.toLowerCase().includes(q);
      const inTags = p.tags.some((tag) => tag.toLowerCase().includes(q));
      const inQuestion = p.question.toLowerCase().includes(q);

      if (!inTitle && !inSubtitle && !inStudents && !inTeam && !inSummary && !inTags && !inQuestion) {
        return false;
      }
    }

    // Category
    if (filters.category && filters.category !== "ALL") {
      if (p.category !== filters.category) return false;
    }

    return true;
  }).sort((a, b) => {
    // 기본 정렬: 제목 가나다순
    return a.title.localeCompare(b.title, "ko", { numeric: true });
  });
}

// Admin Operations
export async function saveProject(project: Partial<Project> & { id?: string }): Promise<Project> {
  // 1. 서버 환경
  if (typeof window === "undefined") {
    try {
      const { saveServerProject } = await import("./server-storage");
      return await saveServerProject(project);
    } catch (e) {
      console.warn("Server saveProject failed, fallback to memory:", e);
    }
  }

  // 2. 클라이언트 환경: /api/projects POST 호출
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "save", payload: project }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const serverSaved = json.data as Project;
          const localList = getLocalProjects();
          const idx = localList.findIndex((p) => p.id === serverSaved.id || p.slug === serverSaved.slug);
          if (idx >= 0) {
            localList[idx] = serverSaved;
          } else {
            localList.push(serverSaved);
          }
          saveLocalProjects(localList);
          return serverSaved;
        }
      }
    } catch (err) {
      console.warn("Client API saveProject failed, fallback to local storage:", err);
    }
  }

  // 3. 로컬스토리지 fallback
  const projects = getLocalProjects();
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

  saveLocalProjects(projects);
  return updatedProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = getLocalProjects();
  const filtered = projects.filter((p) => p.id !== id);
  saveLocalProjects(filtered);

  if (typeof window !== "undefined") {
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", payload: { id } }),
      });
    } catch (e) {
      console.warn("Failed to delete project on server:", e);
    }
  } else {
    try {
      const { deleteServerProject } = await import("./server-storage");
      await deleteServerProject(id);
    } catch {}
  }
  return true;
}

export async function toggleProjectPublished(id: string): Promise<boolean> {
  // 로컬 상태 즉각 반영
  const projects = getLocalProjects();
  const item = projects.find((p) => p.id === id);
  let newStatus = false;
  if (item) {
    item.published = !item.published;
    item.updated_at = new Date().toISOString();
    newStatus = item.published;
    saveLocalProjects(projects);
  }

  // 서버 저장소 실시간 반영
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "togglePublished", payload: { id } }),
      });
      if (res.ok) {
        const json = await res.json();
        if (typeof json.published === "boolean") {
          newStatus = json.published;
          if (item) {
            item.published = newStatus;
            saveLocalProjects(projects);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to toggle published on server:", e);
    }
  } else {
    try {
      const { toggleServerProjectPublished } = await import("./server-storage");
      newStatus = await toggleServerProjectPublished(id);
    } catch {}
  }

  return newStatus;
}

export async function toggleProjectFeatured(id: string): Promise<boolean> {
  const projects = getLocalProjects();
  const item = projects.find((p) => p.id === id);
  let newStatus = false;
  if (item) {
    item.featured = !item.featured;
    item.updated_at = new Date().toISOString();
    newStatus = item.featured;
    saveLocalProjects(projects);
  }

  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggleFeatured", payload: { id } }),
      });
      if (res.ok) {
        const json = await res.json();
        if (typeof json.featured === "boolean") {
          newStatus = json.featured;
          if (item) {
            item.featured = newStatus;
            saveLocalProjects(projects);
          }
        }
      }
    } catch (e) {
      console.warn("Failed to toggle featured on server:", e);
    }
  } else {
    try {
      const { toggleServerProjectFeatured } = await import("./server-storage");
      newStatus = await toggleServerProjectFeatured(id);
    } catch {}
  }

  return newStatus;
}

export async function setAllProjectsPublished(published: boolean): Promise<boolean> {
  const projects = getLocalProjects();
  const now = new Date().toISOString();
  projects.forEach((p) => {
    p.published = published;
    (p as any).is_public = published;
    p.updated_at = now;
  });
  saveLocalProjects(projects);

  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setAllPublished", payload: { published } }),
      });
      if (!res.ok) {
        console.warn("Server setAllPublished response not ok");
      }
    } catch (e) {
      console.warn("Failed to setAllPublished on server:", e);
    }
  } else {
    try {
      const { setAllServerProjectsPublished } = await import("./server-storage");
      await setAllServerProjectsPublished(published);
    } catch {}
  }

  return true;
}

export async function resetToSampleData(): Promise<void> {
  saveLocalProjects(SAMPLE_PROJECTS);

  if (typeof window !== "undefined") {
    try {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
    } catch (e) {
      console.warn("Failed to reset projects on server:", e);
    }
  } else {
    try {
      const { resetServerProjects } = await import("./server-storage");
      await resetServerProjects();
    } catch {}
  }
}
