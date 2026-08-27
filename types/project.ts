export type ProjectCategory =
  | "AI & DATA"
  | "SOFTWARE"
  | "ROBOT & IoT"
  | "SCIENCE"
  | "CREATIVE";

export type ProjectBadge =
  | "CURATOR'S PICK"
  | "NEW IDEA"
  | "CREATIVE QUESTION"
  | "TECH CHALLENGE";

export type ReactionType = "clap" | "idea" | "rocket" | "heart";

export interface ProjectProcess {
  id: string;
  project_id: string;
  title: string;
  description: string;
  image_url?: string;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  team_name: string;
  student_display_names: string[];
  grade: string;
  program: string;
  year: number;
  category: ProjectCategory;
  tags: string[];
  question: string;
  summary: string;
  motivation: string;
  description: string;
  reflection: string;
  next_question: string;
  thumbnail_url: string;
  report_pdf_url?: string;
  presentation_pdf_url?: string;
  presentation_original_url?: string;
  video_url?: string;
  external_project_url?: string;
  featured: boolean;
  published: boolean;
  display_order: number;
  badge?: ProjectBadge;
  created_at: string;
  updated_at: string;
  processes?: ProjectProcess[];
}

export interface ReactionCounts {
  clap: number;
  idea: number;
  rocket: number;
  heart: number;
}

export interface ProjectFilterState {
  searchQuery: string;
  category: string;
  grade: string;
  program: string;
  year: string;
  sortBy: "featured" | "latest" | "title";
}

export interface ExhibitionStats {
  totalProjects: number;
  totalStudents: number;
  totalFields: number;
  totalReactions: number;
}
