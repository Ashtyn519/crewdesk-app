import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable')
  }

  export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia',
      typescript: true,
      })

      export const PLANS = {
        starter: {
            name: 'Starter',
                priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
                    price: 49,
                        currency: 'gbp',
                            features: ['Up to 5 crew members', '10 active projects', 'Invoicing', 'Basic reports'],
                              },
                                pro: {
                                    name: 'Pro',
                                        priceId: process.env.STRIPE_PRO_PRICE_ID || '',
                                            price: 99,
                                                currency: 'gbp',
                                                    features: ['Unlimited crew members', 'Unlimited projects', 'Advanced analytics', 'Priority support', 'Custom contracts'],
                                                      },
                                                        enterprise: {
                                                            name: 'Enterprise',
                                                                priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || '',
                                                                    price: 249,
                                                                        currency: 'gbp',
                                                                            features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee', 'White-label options'],
                                                                              },
                                                                              } as const

                                                                              export type PlanKey = keyof typeof PLANS
