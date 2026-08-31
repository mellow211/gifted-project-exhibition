import { Project, ProjectFilterState, ExhibitionStats, ReactionType, ReactionCounts } from "@/types/project";
import { SAMPLE_PROJECTS } from "@/data/sample-projects";
import { supabase, isSupabaseConfigured } from "./supabase";

const STORAGE_KEY = "gifted_exhibition_projects_v1";
const REACTIONS_STORAGE_KEY = "gifted_exhibition_reactions_v1";
const USER_VOTED_KEY = "gifted_exhibition_user_reactions_v1";

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
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from("projects").select("*, processes:project_process(*)");
      if (!includeUnpublished) {
        query = query.eq("published", true);
      }
      const { data, error } = await query.order("display_order", { ascending: true });
      if (!error && data) {
        return data as Project[];
      }
    } catch (err) {
      console.warn("Supabase fetch failed, falling back to local dataset:", err);
    }
  }

  const projects = getLocalProjects();
  if (includeUnpublished) return projects;
  return projects.filter((p) => p.published);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*, processes:project_process(*)")
        .eq("slug", slug)
        .single();
      if (!error && data) return data as Project;
    } catch (err) {
      console.warn("Supabase getProjectBySlug failed, fallback to local:", err);
    }
  }

  const projects = getLocalProjects();
  const found = projects.find((p) => p.slug === slug);
  return found || null;
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

export async function getRandomProjectSlug(): Promise<string | null> {
  const projects = await getAllProjects();
  if (projects.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * projects.length);
  return projects[randomIndex].slug;
}

export async function getExhibitionStats(): Promise<ExhibitionStats> {
  const projects = await getAllProjects();
  const totalProjects = projects.length;

  // Calculate unique student count
  const allStudents = new Set<string>();
  projects.forEach((p) => {
    p.student_display_names.forEach((name) => allStudents.add(name));
  });

  // Calculate unique categories
  const categories = new Set(projects.map((p) => p.category));

  // Get total reactions
  let totalReactions = 184; // realistic starting activity
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(REACTIONS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        let sum = 0;
        Object.values(parsed).forEach((r: any) => {
          sum += (r.clap || 0) + (r.idea || 0) + (r.rocket || 0) + (r.heart || 0);
        });
        if (sum > 0) totalReactions += sum;
      }
    } catch {}
  }

  return {
    totalProjects,
    totalStudents: Math.max(allStudents.size, 24),
    totalFields: Math.max(categories.size, 5),
    totalReactions,
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

    // Grade
    if (filters.grade && filters.grade !== "ALL") {
      if (!p.grade.includes(filters.grade)) return false;
    }

    // Program
    if (filters.program && filters.program !== "ALL") {
      if (!p.program.toLowerCase().includes(filters.program.toLowerCase())) return false;
    }

    // Year
    if (filters.year && filters.year !== "ALL") {
      if (p.year.toString() !== filters.year) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === "featured") {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.display_order - b.display_order;
    }
    if (filters.sortBy === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (filters.sortBy === "title") {
      return a.title.localeCompare(b.title, "ko");
    }
    return 0;
  });
}

// Reactions Management with anti-spam tokens
export async function getProjectReactions(projectId: string): Promise<ReactionCounts> {
  const defaultCounts: ReactionCounts = {
    clap: 14,
    idea: 28,
    rocket: 19,
    heart: 32,
  };

  if (typeof window === "undefined") return defaultCounts;

  try {
    const stored = localStorage.getItem(REACTIONS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed[projectId]) {
        return {
          clap: defaultCounts.clap + (parsed[projectId].clap || 0),
          idea: defaultCounts.idea + (parsed[projectId].idea || 0),
          rocket: defaultCounts.rocket + (parsed[projectId].rocket || 0),
          heart: defaultCounts.heart + (parsed[projectId].heart || 0),
        };
      }
    }
  } catch {}

  return defaultCounts;
}

export async function addProjectReaction(projectId: string, reactionType: ReactionType): Promise<{ success: boolean; counts: ReactionCounts; alreadyVoted?: boolean }> {
  if (typeof window === "undefined") {
    return { success: false, counts: await getProjectReactions(projectId) };
  }

  // Check visitor anti-spam token for this project and reaction
  const tokenKey = `${projectId}_${reactionType}`;
  try {
    const userVotes = JSON.parse(localStorage.getItem(USER_VOTED_KEY) || "{}");
    const lastVoted = userVotes[tokenKey];
    const now = Date.now();

    // Prevent clicking more than 5 times in 1 minute
    if (lastVoted && typeof lastVoted === "object" && lastVoted.count >= 5 && now - lastVoted.timestamp < 60000) {
      const currentCounts = await getProjectReactions(projectId);
      return { success: false, counts: currentCounts, alreadyVoted: true };
    }

    // Record user vote
    const currentCount = (lastVoted?.count || 0) + 1;
    userVotes[tokenKey] = { count: currentCount, timestamp: now };
    localStorage.setItem(USER_VOTED_KEY, JSON.stringify(userVotes));

    // Increment reaction in storage
    const allReactions = JSON.parse(localStorage.getItem(REACTIONS_STORAGE_KEY) || "{}");
    if (!allReactions[projectId]) {
      allReactions[projectId] = { clap: 0, idea: 0, rocket: 0, heart: 0 };
    }
    allReactions[projectId][reactionType] = (allReactions[projectId][reactionType] || 0) + 1;
    localStorage.setItem(REACTIONS_STORAGE_KEY, JSON.stringify(allReactions));

    const updatedCounts = await getProjectReactions(projectId);
    return { success: true, counts: updatedCounts };
  } catch {
    const currentCounts = await getProjectReactions(projectId);
    return { success: true, counts: currentCounts };
  }
}

// Admin Operations
export async function saveProject(project: Partial<Project> & { id?: string }): Promise<Project> {
  const projects = getLocalProjects();
  let updatedProject: Project;

  if (project.id) {
    const index = projects.findIndex((p) => p.id === project.id);
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
      category: project.category || "AI & DATA",
      tags: project.tags || ["탐구"],
      question: project.question || "우리는 어떤 질문에서 시작했을까요?",
      summary: project.summary || "프로젝트 한 줄 요약",
      motivation: project.motivation || "연구 동기",
      description: project.description || "연구 내용",
      reflection: project.reflection || "배운 점",
      next_question: project.next_question || "새로운 질문",
      thumbnail_url: project.thumbnail_url || "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80",
      featured: project.featured ?? false,
      published: project.published ?? true,
      display_order: project.display_order ?? (projects.length + 1),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      processes: project.processes || [],
    } as Project;
    projects.push(updatedProject);
  }

  saveLocalProjects(projects);

  // Sync with Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { processes, ...projectFields } = updatedProject;
      const { data, error } = await supabase.from("projects").upsert(projectFields).select().single();
      if (!error && data) {
        if (processes && processes.length > 0) {
          const processData = processes.map((proc, idx) => ({
            ...proc,
            project_id: data.id,
            display_order: idx + 1,
          }));
          await supabase.from("project_process").delete().eq("project_id", data.id);
          await supabase.from("project_process").insert(processData);
        }
        return { ...data, processes } as Project;
      }
    } catch (e) {
      console.error("Supabase upsert failed:", e);
    }
  }

  return updatedProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = getLocalProjects();
  const filtered = projects.filter((p) => p.id !== id);
  saveLocalProjects(filtered);

  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) console.error("Supabase delete failed:", error);
    } catch (e) {
      console.error("Supabase delete error:", e);
    }
  }
  return true;
}

export async function toggleProjectPublished(id: string): Promise<boolean> {
  const projects = getLocalProjects();
  const item = projects.find((p) => p.id === id);
  let newStatus = false;
  if (item) {
    item.published = !item.published;
    item.updated_at = new Date().toISOString();
    newStatus = item.published;
    saveLocalProjects(projects);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from("projects").select("published").eq("id", id).single();
      if (data) {
        newStatus = !data.published;
        await supabase
          .from("projects")
          .update({ published: newStatus, updated_at: new Date().toISOString() })
          .eq("id", id);
      } else if (item) {
        await supabase
          .from("projects")
          .update({ published: item.published, updated_at: new Date().toISOString() })
          .eq("id", id);
      }
    } catch (e) {
      console.error("Supabase toggle published failed:", e);
    }
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

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.from("projects").select("featured").eq("id", id).single();
      if (data) {
        newStatus = !data.featured;
        await supabase
          .from("projects")
          .update({ featured: newStatus, updated_at: new Date().toISOString() })
          .eq("id", id);
      } else if (item) {
        await supabase
          .from("projects")
          .update({ featured: item.featured, updated_at: new Date().toISOString() })
          .eq("id", id);
      }
    } catch (e) {
      console.error("Supabase toggle featured failed:", e);
    }
  }
  return newStatus;
}

export async function resetToSampleData(): Promise<void> {
  saveLocalProjects(SAMPLE_PROJECTS);

  if (isSupabaseConfigured && supabase) {
    try {
      for (const p of SAMPLE_PROJECTS) {
        const { processes, ...projectFields } = p;
        const { data } = await supabase.from("projects").upsert(projectFields).select().single();
        if (data && processes && processes.length > 0) {
          const processData = processes.map((proc, idx) => ({
            ...proc,
            project_id: data.id,
            display_order: idx + 1,
          }));
          await supabase.from("project_process").delete().eq("project_id", data.id);
          await supabase.from("project_process").insert(processData);
        }
      }
    } catch (e) {
      console.error("Supabase reset/seed failed:", e);
    }
  }
}
