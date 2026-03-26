import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get('stripe-signature')

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
          return NextResponse.json({ error: 'Missing stripe signature' }, { status: 400 })
        }

    let event: Stripe.Event
    try {
          event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
        } catch (err: any) {
          return NextResponse.json({ error: err.message }, { status: 400 })
        }

    const supabase = await createClient()

    switch (event.type) {
          case 'checkout.session.completed': {
                  const session = event.data.object as Stripe.Checkout.Session
                  const userId = session.metadata?.userId
                  const plan = session.metadata?.plan
                  if (userId && plan) {
                            await supabase.from('workspaces').update({
                                        stripe_customer_id: session.customer as string,
                                        stripe_subscription_id: session.subscription as string,
                                        plan,
                                        plan_status: 'active',
                                        trial_ends_at: null,
                                      }).eq('owner_id', userId)
                          }
                  break
                }
          case 'customer.subscription.updated': {
                  const sub = event.data.object as Stripe.Subscription
                  await supabase.from('workspaces').update({
                            plan_status: sub.status,
                          }).eq('stripe_customer_id', sub.customer as string)
                  break
                }
          case 'customer.subscription.deleted': {
                  const sub = event.data.object as Stripe.Subscription
                  await supabase.from('workspaces').update({
                            plan: 'free',
                            plan_status: 'cancelled',
                            stripe_subscription_id: null,
                          }).eq('stripe_customer_id', sub.customer as string)
                  break
                }
          case 'invoice.payment_failed': {
                  const invoice = event.data.object as Stripe.Invoice
                  await supabase.from('workspaces').update({
                            plan_status: 'past_due',
                          }).eq('stripe_customer_id', invoice.customer as string)
                  break
                }
        }

    return NextResponse.json({ received: true })
  }
