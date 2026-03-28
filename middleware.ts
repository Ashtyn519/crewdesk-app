import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/', '/login', '/signup', '/pricing', '/onboarding', '/auth', '/api']

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
            cookies: {
                      getAll() { return request.cookies.getAll() },
                      setAll(cookiesToSet) {
                                  cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                                  supabaseResponse = NextResponse.next({ request })
                                  cookiesToSet.forEach(({ name, value, options }) =>
                                                supabaseResponse.cookies.set(name, value, options)
                                                                 )
                      },
            },
    }
      )

  const { data: { user } } = await supabase.auth.getUser()
    const { pathname } = request.nextUrl

  const isPublic = PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))

  if (!user && !isPublic) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname)
        return NextResponse.redirect(loginUrl)
  }

  if (user && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (user && !isPublic && pathname !== '/onboarding') {
        const { data: workspace } = await supabase
          .from('workspaces')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

      if (!workspace) {
              return NextResponse.redirect(new URL('/onboarding', request.url))
      }
  }

  return supabaseResponse
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
