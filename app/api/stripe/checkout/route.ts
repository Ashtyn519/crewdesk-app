import { NextRequest, NextResponse } from 'next/server'
import { stripe, PLANS, PlanKey } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
    try {
          const supabase = await createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (!user) {
                  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
                }

          const body = await req.json()
          const plan = body.plan as PlanKey

          if (!PLANS[plan]) {
                  return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
                }

          const priceId = PLANS[plan].priceId
          if (!priceId) {
                  return NextResponse.json({ error: 'Price ID not configured for this plan' }, { status: 500 })
                }

          const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://crewdeskapp.com'

          const session = await stripe.checkout.sessions.create({
                  mode: 'subscription',
                  payment_method_types: ['card'],
                  line_items: [{ price: priceId, quantity: 1 }],
                  customer_email: user.email,
                  metadata: { userId: user.id, plan },
                  success_url: `${baseUrl}/dashboard?upgraded=true`,
                  cancel_url: `${baseUrl}/pricing?cancelled=true`,
                  allow_promotion_codes: true,
                  billing_address_collection: 'auto',
                  subscription_data: { metadata: { userId: user.id, plan } },
                })

          return NextResponse.json({ url: session.url })
        } catch (error: any) {
          console.error('Stripe checkout error:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
  }
