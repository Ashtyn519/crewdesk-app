import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  FolderOpen, FileText, Users, MessageSquare, 
  TrendingUp, AlertCircle, CheckCircle, Clock,
  Plus, ArrowRight, DollarSign
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all stats in parallel
  const [
    { data: projects },
    { data: invoices },
    { data: crew },
    { data: contracts },
    { data: messages },
    { data: workspace },
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("invoices").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("crew_members").select("*").eq("user_id", user.id).limit(5),
    supabase.from("contracts").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
    supabase.from("message_threads").select("*").eq("user_id", user.id).order("last_message_at", { ascending: false }).limit(5),
    supabase.from("workspaces").select("*").eq("user_id", user.id).single(),
  ]);

  const activeProjects = projects?.filter(p => p.status === "active") || [];
  const paidRevenue = invoices?.filter(i => i.status === "paid").reduce((s, i) => s + (Number(i.total) || 0), 0) || 0;
  const unpaidAmount = invoices?.filter(i => i.status === "sent" || i.status === "overdue").reduce((s, i) => s + (Number(i.total) || 0), 0) || 0;
  const overdueInvoices = invoices?.filter(i => i.status === "overdue") || [];
  const crewCount = crew?.length || 0;
  const signedContracts = contracts?.filter(c => c.status === "signed") || [];

  const stats = [
    {
      label: "Active Projects",
      value: activeProjects.length,
      total: projects?.length || 0,
      icon: FolderOpen,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "border-blue-400/20",
      href: "/projects",
    },
    {
      label: "Revenue (Paid)",
      value: `£${paidRevenue.toLocaleString("en-GB", { minimumFractionDigits: 0 })}`,
      sub: `£${unpaidAmount.toLocaleString("en-GB", { minimumFractionDigits: 0 })} pending`,
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20",
      href: "/invoices",
    },
    {
      label: "Crew Members",
      value: crewCount,
      sub: "active freelancers",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "border-purple-400/20",
      href: "/crew",
    },
    {
      label: "Invoices",
      value: invoices?.length || 0,
      sub: `${overdueInvoices.length} overdue`,
      icon: FileText,
      color: overdueInvoices.length > 0 ? "text-red-400" : "text-amber-400",
      bg: overdueInvoices.length > 0 ? "bg-red-400/10" : "bg-amber-400/10",
      border: overdueInvoices.length > 0 ? "border-red-400/20" : "border-amber-400/20",
      href: "/invoices",
    },
  ];

  const quickActions = [
    { label: "New Project", href: "/projects", icon: FolderOpen, color: "bg-blue-500" },
    { label: "New Invoice", href: "/invoices", icon: FileText, color: "bg-emerald-500" },
    { label: "Add Crew", href: "/crew", icon: Users, color: "bg-purple-500" },
    { label: "New Message", href: "/messages", icon: MessageSquare, color: "bg-amber-500" },
  ];

  const workspaceName = workspace?.name || "Your Workspace";
  const userName = user.email?.split("@")[0] || "there";

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Welcome back, <span className="text-amber-400 capitalize">{userName}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">{workspaceName} · Here's your production overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}
            className={`bg-[#0A1020] border ${stat.border} rounded-2xl p-5 hover:bg-[#0F1A2E] transition-all group`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`${stat.color} w-5 h-5`} />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors" />
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
            {stat.sub && <div className="text-xs text-slate-500 mt-1">{stat.sub}</div>}
            {stat.total !== undefined && (
              <div className="text-xs text-slate-500 mt-1">{stat.total} total</div>
            )}
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}
              className="flex items-center gap-3 bg-[#0A1020] border border-slate-800 rounded-xl p-4 hover:bg-[#0F1A2E] hover:border-slate-700 transition-all group">
              <div className={`w-9 h-9 ${action.color}/20 rounded-lg flex items-center justify-center`}>
                <action.icon className={`w-4 h-4 text-white`} />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                {action.label}
              </span>
              <Plus className="w-4 h-4 text-slate-600 ml-auto group-hover:text-slate-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-[#0A1020] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
            <Link href="/projects" className="text-amber-400 text-sm hover:text-amber-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {(projects || []).length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No projects yet</p>
              <Link href="/projects" className="text-amber-400 text-sm mt-2 inline-block hover:text-amber-300">
                Create your first project →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(projects || []).slice(0, 5).map((project: any) => (
                <div key={project.id} className="flex items-center justify-between p-3 bg-[#0F1A2E] rounded-xl">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      project.status === "active" ? "bg-emerald-400" :
                      project.status === "completed" ? "bg-blue-400" :
                      project.status === "on_hold" ? "bg-amber-400" : "bg-red-400"
                    }`} />
                    <span className="text-sm text-white truncate">{project.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${
                    project.status === "active" ? "bg-emerald-400/10 text-emerald-400" :
                    project.status === "completed" ? "bg-blue-400/10 text-blue-400" :
                    project.status === "on_hold" ? "bg-amber-400/10 text-amber-400" : "bg-red-400/10 text-red-400"
                  }`}>
                    {project.status?.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-[#0A1020] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Recent Invoices</h2>
            <Link href="/invoices" className="text-amber-400 text-sm hover:text-amber-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {(invoices || []).length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No invoices yet</p>
              <Link href="/invoices" className="text-amber-400 text-sm mt-2 inline-block hover:text-amber-300">
                Create your first invoice →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(invoices || []).slice(0, 5).map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 bg-[#0F1A2E] rounded-xl">
                  <div className="min-w-0">
                    <div className="text-sm text-white font-medium truncate">{invoice.client_name}</div>
                    <div className="text-xs text-slate-500">{invoice.invoice_number}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-semibold text-white">£{Number(invoice.total || 0).toLocaleString()}</div>
                    <span className={`text-xs px-2 py-0.5 rounded-lg ${
                      invoice.status === "paid" ? "bg-emerald-400/10 text-emerald-400" :
                      invoice.status === "sent" ? "bg-blue-400/10 text-blue-400" :
                      invoice.status === "overdue" ? "bg-red-400/10 text-red-400" : "bg-slate-700 text-slate-400"
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Contracts Summary */}
        <div className="bg-[#0A1020] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Contracts</h2>
            <Link href="/contracts" className="text-amber-400 text-sm hover:text-amber-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {(contracts || []).length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No contracts yet</p>
              <Link href="/contracts" className="text-amber-400 text-sm mt-2 inline-block hover:text-amber-300">
                Upload your first contract →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(contracts || []).slice(0, 4).map((contract: any) => (
                <div key={contract.id} className="flex items-center justify-between p-3 bg-[#0F1A2E] rounded-xl">
                  <div className="min-w-0">
                    <div className="text-sm text-white truncate">{contract.title}</div>
                    <div className="text-xs text-slate-500">{contract.party_name || "No party"}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${
                    contract.status === "signed" ? "bg-emerald-400/10 text-emerald-400" :
                    contract.status === "sent" ? "bg-blue-400/10 text-blue-400" :
                    contract.status === "expired" ? "bg-red-400/10 text-red-400" : "bg-slate-700 text-slate-400"
                  }`}>
                    {contract.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-[#0A1020] border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white">Messages</h2>
            <Link href="/messages" className="text-amber-400 text-sm hover:text-amber-300 transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {(messages || []).length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No messages yet</p>
              <Link href="/messages" className="text-amber-400 text-sm mt-2 inline-block hover:text-amber-300">
                Start a conversation →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {(messages || []).slice(0, 4).map((thread: any) => (
                <div key={thread.id} className="flex items-center gap-3 p-3 bg-[#0F1A2E] rounded-xl">
                  <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {thread.title[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-white font-medium truncate">{thread.title}</div>
                    <div className="text-xs text-slate-500 truncate">{thread.last_message || "No messages yet"}</div>
                  </div>
                  {thread.unread_count > 0 && (
                    <span className="w-5 h-5 bg-amber-400 text-black text-xs rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                      {thread.unread_count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overdue Alerts */}
      {overdueInvoices.length > 0 && (
        <div className="mt-6 bg-red-400/10 border border-red-400/30 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <h3 className="text-red-400 font-semibold">Overdue Invoices</h3>
          </div>
          <div className="space-y-2">
            {overdueInvoices.map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-300">{inv.client_name} · {inv.invoice_number}</span>
                <span className="text-red-400 font-semibold">£{Number(inv.total || 0).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <Link href="/invoices" className="mt-3 text-red-400 text-sm hover:text-red-300 flex items-center gap-1">
            Manage invoices <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
