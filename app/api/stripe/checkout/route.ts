import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS, PlanKey } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const plan = body.plan as PlanKey

    if (!PLANS[plan]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const priceId = PLANS[plan].priceId
    if (!priceId) return NextResponse.json({ error: 'Price ID not configured for this plan' }, { status: 500 })

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'https://crewdeskapp.vercel.app'

    // Get or create Stripe customer
    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id, stripe_customer_id, name')
      .eq('user_id', user.id)
      .single()

    let customerId = workspace?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: workspace?.name || user.email,
        metadata: { user_id: user.id, workspace_id: workspace?.id || '' },
      })
      customerId = customer.id

      if (workspace?.id) {
        await supabase
          .from('workspaces')
          .update({ stripe_customer_id: customerId })
          .eq('id', workspace.id)
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?upgraded=1`,
      cancel_url: `${baseUrl}/pricing?cancelled=1`,
      subscription_data: {
        metadata: { user_id: user.id, workspace_id: workspace?.id || '' },
        trial_period_days: undefined,
      },
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
