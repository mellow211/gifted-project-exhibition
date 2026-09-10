import { NextResponse } from "next/server";
import {
  getServerProjects,
  getServerProjectBySlug,
  saveServerProject,
  deleteServerProject,
  toggleServerProjectPublished,
  toggleServerProjectFeatured,
  setAllServerProjectsPublished,
  resetServerProjects,
} from "@/lib/server-storage";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeUnpublished = searchParams.get("includeUnpublished") === "true";
  const slug = searchParams.get("slug");

  try {
    if (slug) {
      const project = await getServerProjectBySlug(slug, includeUnpublished);
      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }
      return NextResponse.json(project);
    }

    const projects = await getServerProjects(includeUnpublished);
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    switch (action) {
      case "save": {
        const saved = await saveServerProject(payload);
        if (isSupabaseConfigured && supabase) {
          try {
            const { processes, id, ...restFields } = saved;
            await supabase.from("projects").upsert(restFields);
          } catch (e) {
            console.warn("Supabase background save failed:", e);
          }
        }
        return NextResponse.json({ success: true, data: saved });
      }

      case "delete": {
        const deleted = await deleteServerProject(payload.id);
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.from("projects").delete().eq("id", payload.id);
          } catch (e) {
            console.warn("Supabase background delete failed:", e);
          }
        }
        return NextResponse.json({ success: true, deleted });
      }

      case "togglePublished": {
        const newStatus = await toggleServerProjectPublished(payload.id);
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase
              .from("projects")
              .update({ published: newStatus, updated_at: new Date().toISOString() })
              .eq("id", payload.id);
          } catch (e) {
            console.warn("Supabase background toggle published failed:", e);
          }
        }
        return NextResponse.json({ success: true, published: newStatus });
      }

      case "toggleFeatured": {
        const newStatus = await toggleServerProjectFeatured(payload.id);
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase
              .from("projects")
              .update({ featured: newStatus, updated_at: new Date().toISOString() })
              .eq("id", payload.id);
          } catch (e) {
            console.warn("Supabase background toggle featured failed:", e);
          }
        }
        return NextResponse.json({ success: true, featured: newStatus });
      }

      case "setAllPublished": {
        const targetPublished = !!payload?.published;
        await setAllServerProjectsPublished(targetPublished);
        if (isSupabaseConfigured && supabase) {
          try {
            await supabase
              .from("projects")
              .update({ published: targetPublished, updated_at: new Date().toISOString() })
              .neq("id", "placeholder");
          } catch (e) {
            console.warn("Supabase background setAllPublished failed:", e);
          }
        }
        return NextResponse.json({ success: true, published: targetPublished });
      }

      case "reset": {
        await resetServerProjects();
        return NextResponse.json({ success: true, reset: true });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
  }
}
