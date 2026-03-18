import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <div className="flex h-screen bg-[#04080F] overflow-hidden">
      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-hidden">{children}</main>
    </div>
  )
}
