import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    try {
          const supabase = await createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

          const { data: workspace } = await supabase
            .from('workspaces')
            .select('stripe_customer_id')
            .eq('owner_id', user.id)
            .single()

          if (!workspace?.stripe_customer_id) {
                  return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
                }

          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crewdeskapp.com'
          const session = await stripe.billingPortal.sessions.create({
                  customer: workspace.stripe_customer_id,
                  return_url: `${baseUrl}/settings`,
                })

          return NextResponse.json({ url: session.url })
        } catch (error: any) {
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
  }
