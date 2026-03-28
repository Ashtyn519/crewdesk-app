import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [profileRes, workspaceRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("workspaces").select("id, name, plan, trial_ends_at, subscription_status, stripe_customer_id").eq("user_id", user.id).single(),
  ]);

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      full_name: profileRes.data?.full_name || user.user_metadata?.full_name || null,
      avatar_url: profileRes.data?.avatar_url || user.user_metadata?.avatar_url || null,
    },
    workspace: workspaceRes.data || null,
  });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { full_name, workspace_name } = body;

  const updates: Promise<unknown>[] = [];

  if (full_name !== undefined) {
    updates.push(
      supabase.from("profiles").upsert({ id: user.id, full_name }, { onConflict: "id" })
    );
  }

  if (workspace_name !== undefined) {
    updates.push(
      supabase.from("workspaces").update({ name: workspace_name }).eq("user_id", user.id)
    );
  }

  await Promise.all(updates);

  return NextResponse.json({ success: true });
}

export const dynamic = "force-dynamic";
