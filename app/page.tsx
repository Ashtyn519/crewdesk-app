import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const { data: workspace } = await supabase.from('workspaces').select('onboarding_completed').eq('user_id', user.id).single()
    if (!workspace?.onboarding_completed) redirect('/onboarding')
    redirect('/dashboard')
  }
  redirect('/login')
}
