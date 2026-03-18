import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
export default async function Layout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return (
    <div className="flex min-h-screen bg-[#04080F]">
      <Sidebar />
      <main className="flex-1 md:ml-64 pb-20 md:pb-0">{children}</main>
    </div>
  )
}
