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
    priceId: process.env.STRIPE_PRICE_BUSINESS_STARTER || '',
    price: 49,
    currency: 'gbp',
    features: ['Up to 5 active projects', 'Up to 10 crew / freelancers', 'Invoicing & payments', 'Smart contracts', 'Team messaging', 'Standard support'],
  },
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRICE_BUSINESS_GROWTH || '',
    price: 99,
    currency: 'gbp',
    features: ['Unlimited projects', 'Unlimited crew members', 'Advanced analytics & reports', 'Schedule & shift management', 'VAT invoicing with PDF export', 'Priority support', 'Custom workspace branding'],
  },
  enterprise: {
    name: 'Enterprise',
    priceId: process.env.STRIPE_PRICE_FREELANCER || '',
    price: 249,
    currency: 'gbp',
    features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations (Xero, QuickBooks)', 'SSO & role-based access control', 'SLA & uptime guarantee', 'GDPR DPA & audit logs', 'Volume freelancer licensing'],
  },
} as const

export type PlanKey = keyof typeof PLANS
