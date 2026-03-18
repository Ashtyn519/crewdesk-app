import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  const [projects, invoices, crew, contracts] = await Promise.all([
    supabase.from("projects").select("id, status, budget, spent").eq("user_id", user.id),
    supabase.from("invoices").select("id, status, total").eq("user_id", user.id),
    supabase.from("crew_members").select("id").eq("user_id", user.id),
    supabase.from("contracts").select("id, status").eq("user_id", user.id),
  ]);
  
  const activeProjects = projects.data?.filter(p => p.status === "active").length || 0;
  const totalRevenue = invoices.data?.filter(i => i.status === "paid").reduce((s, i) => s + (i.total || 0), 0) || 0;
  const unpaidInvoices = invoices.data?.filter(i => i.status === "sent" || i.status === "overdue").length || 0;
  const crewCount = crew.data?.length || 0;
  
  return NextResponse.json({
    activeProjects,
    totalRevenue,
    unpaidInvoices,
    crewCount,
    totalProjects: projects.data?.length || 0,
    totalInvoices: invoices.data?.length || 0,
  });
}

export const dynamic = "force-dynamic";
