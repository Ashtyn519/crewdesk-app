import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/Sidebar'
import TopHeader from '@/components/TopHeader'

export default async function Layout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    return (
          <div className="flex h-screen bg-[#04080F] overflow-hidden">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden ml-64">
                        <TopHeader />
                        <main className="flex-1 overflow-y-auto">{children}</main>main>
                </div>div>
          </div>div>
        )
}</div>
