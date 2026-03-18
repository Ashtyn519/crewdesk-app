import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const body = await req.json();
  const { full_name, email, workspace_name, production_type } = body;
  
  // Update workspace name if provided
  if (workspace_name) {
    await supabase.from("workspaces")
      .update({ name: workspace_name, production_type })
      .eq("user_id", user.id);
  }
  
  return NextResponse.json({ success: true });
}

export const dynamic = "force-dynamic";
