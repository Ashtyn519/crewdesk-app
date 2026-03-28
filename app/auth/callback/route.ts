import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // For OAuth sign-ins, check if the user has already completed onboarding.
      // If not, send them to /onboarding regardless of the 'next' param.
      if (next === '/onboarding') {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: workspace } = await supabase
          .from('workspaces')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        // New OAuth user — no workspace yet → send to onboarding
        if (!workspace) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
