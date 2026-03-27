# CrewDesk — The Operating System for Businesses That Hire Freelancers

CrewDesk is a SaaS platform that helps any business manage its freelance workforce — from sourcing and scheduling to contracts, invoicing, and payments — in one place.

Built for marketing agencies, tech startups, consulting firms, events companies, and any business that runs on freelance talent.

---

## What CrewDesk Does

| Feature | Description |
|---|---|
| **Freelancer Directory** | Build your roster of trusted freelancers with skills, rates, and availability |
| **Project Management** | Create projects, assign freelancers, track status and deadlines |
| **Smart Scheduling** | Drag-and-drop weekly calendar to book freelancers across sessions |
| **Contracts** | Generate and send contracts with e-sign support |
| **Invoicing** | Create and track invoices; automated reminders for overdue payments |
| **Reports & Analytics** | Revenue trends, project spend, freelancer utilisation |
| **Messaging** | Built-in chat between your team and freelancers |
| **Onboarding** | Self-serve onboarding for new businesses in under 2 minutes |

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Auth & Database**: Supabase (PostgreSQL + Row Level Security)
- **Payments**: Stripe (subscriptions + invoicing)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React
- **Language**: TypeScript

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Stripe](https://stripe.com) account

### 1. Clone and install

```bash
git clone https://github.com/Ashtyn519/crewdesk-app.git
cd crewdesk-app
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_STARTER_PRICE_ID` | Stripe Price ID for Starter plan |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for Pro plan |
| `STRIPE_ENTERPRISE_PRICE_ID` | Stripe Price ID for Enterprise plan |
| `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g. https://crewdeskapp.com) |

### 3. Set up Supabase

Run the SQL migrations in `/supabase/migrations` (or apply via the Supabase dashboard). Required tables include:

- `workspaces` — business accounts
- `profiles` — user profiles
- `projects` — client projects
- `freelancers` — freelancer directory
- `contracts` — contract records
- `invoices` — invoice records

Enable Row Level Security on all tables.

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push to GitHub (main branch)
2. Import the repo in [Vercel](https://vercel.com)
3. Add all environment variables under **Project Settings → Environment Variables**
4. Set the **Framework Preset** to Next.js
5. Deploy

For Stripe webhooks, set your endpoint to:
```
https://your-domain.com/api/webhooks/stripe
```

---

## Pricing Plans

| Plan | Price | Users | Projects |
|---|---|---|---|
| Starter | £49/month | Up to 5 | Up to 10 |
| Pro | £99/month | Up to 20 | Unlimited |
| Enterprise | £249/month | Unlimited | Unlimited + custom |

Annual billing available at 20% discount.

---

## Project Structure

```
crewdesk-app/
├── app/
│   ├── (auth)/          # Login, signup
│   ├── dashboard/       # Main dashboard
│   ├── crew/            # Freelancer directory
│   ├── projects/        # Project management
│   ├── schedule/        # Weekly calendar
│   ├── contracts/       # Contracts
│   ├── invoices/        # Invoicing
│   ├── messages/        # Messaging
│   ├── reports/         # Analytics
│   ├── settings/        # Account settings
│   ├── profile/         # Freelancer profile
│   ├── onboarding/      # New user onboarding
│   ├── pricing/         # Pricing page
│   └── page.tsx         # Marketing landing page
├── components/
│   ├── Sidebar.tsx
│   ├── TopHeader.tsx
│   └── RevenueChart.tsx
├── lib/
│   ├── supabase/
│   └── stripe.ts
└── middleware.ts         # Auth route protection
```

---

## Contributing

Pull requests welcome. For major changes, open an issue first.

---

## License

MIT
