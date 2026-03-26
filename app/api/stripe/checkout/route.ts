import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const PRICE_MAP: Record<string, string> = {
        freelancer: process.env.STRIPE_PRICE_FREELANCER!,
          business_starter: process.env.STRIPE_PRICE_BUSINESS_STARTER!,
            business_growth: process.env.STRIPE_PRICE_BUSINESS_GROWTH!,
            business_professional: process.env.STRIPE_PRICE_BUSINESS_PROFESSIONAL!,
            business_enterprise: process.env.STRIPE_PRICE_BUSINESS_ENTERPRISE!,
            }

            export async function POST(req: NextRequest) {
              try {
                  const { plan, userId, email } = await req.json()

                      if (!plan || !userId || !email) {
                            return NextResponse.json(
                                    { error: 'Missing required fields: plan, userId, email' },
                                            { status: 400 }
                                                  )
                                                      }

                                                          const priceId = PRICE_MAP[plan]
                                                              if (!priceId) {
                                                                    return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 })
                                                                        }

                                                                            // Get or create Stripe customer
                                                                                const { data: profile } = await supabase
                                                                                      .from('profiles')
                                                                                            .select('stripe_customer_id')
                                                                                                  .eq('id', userId)
                                                                                                        .single()

                                                                                                            let customerId = profile?.stripe_customer_id

                                                                                                                if (!customerId) {
                                                                                                                      const customer = await stripe.customers.create({
                                                                                                                              email,
                                                                                                                                      metadata: { supabase_user_id: userId },
                                                                                                                                            })
                                                                                                                                                  customerId = customer.id

                                                                                                                                                        await supabase
                                                                                                                                                                .from('profiles')
                                                                                                                                                                        .update({ stripe_customer_id: customerId })
                                                                                                                                                                                .eq('id', userId)
                                                                                                                                                                                    }

                                                                                                                                                                                        const session = await stripe.checkout.sessions.create({
                                                                                                                                                                                              customer: customerId,
                                                                                                                                                                                                    payment_method_types: ['card'],
                                                                                                                                                                                                          line_items: [{ price: priceId, quantity: 1 }],
                                                                                                                                                                                                                mode: 'subscription',
                                                                                                                                                                                                                      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
                                                                                                                                                                                                                            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
                                                                                                                                                                                                                                  subscription_data: {
                                                                                                                                                                                                                                          trial_period_days: 14,
                                                                                                                                                                                                                                                  metadata: { supabase_user_id: userId, plan },
                                                                                                                                                                                                                                                        },
                                                                                                                                                                                                                                                              metadata: { supabase_user_id: userId, plan },
                                                                                                                                                                                                                                                                  })

                                                                                                                                                                                                                                                                      return NextResponse.json({ url: session.url })
                                                                                                                                                                                                                                                                        } catch (err) {
                                                                                                                                                                                                                                                                            console.error('[stripe/checkout] Error:', err)
                                                                                                                                                                                                                                                                                return NextResponse.json(
                                                                                                                                                                                                                                                                                      { error: 'Failed to create checkout session.' },
                                                                                                                                                                                                                                                                                            { status: 500 }
                                                                                                                                                                                                                                                                                                )
                                                                                                                                                                                                                                                                                                  }
                                                                                                                                                                                                                                                                                                  }