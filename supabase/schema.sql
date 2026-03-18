
-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  client TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','completed','on-hold','cancelled')),
  budget NUMERIC(10,2) DEFAULT 0,
  spent NUMERIC(10,2) DEFAULT 0,
  start_date DATE,
  end_date DATE,
  description TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  client_name TEXT,
  client_email TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','signed','expired')),
  value NUMERIC(10,2) DEFAULT 0,
  file_url TEXT,
  signed_at TIMESTAMPTZ,
  expires_at DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  client_name TEXT,
  client_email TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','paid','overdue')),
  subtotal NUMERIC(10,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 20,
  total NUMERIC(10,2) DEFAULT 0,
  due_date DATE,
  paid_at TIMESTAMPTZ,
  line_items JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Crew members table
CREATE TABLE IF NOT EXISTS crew_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  role TEXT,
  department TEXT,
  day_rate NUMERIC(10,2) DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  availability TEXT DEFAULT 'available' CHECK (availability IN ('available','busy','unavailable')),
  bio TEXT,
  skills TEXT[],
  avatar_url TEXT,
  invite_status TEXT DEFAULT 'pending' CHECK (invite_status IN ('pending','accepted','rejected')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Messages / Threads table
CREATE TABLE IF NOT EXISTS message_threads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  participant_ids UUID[],
  last_message TEXT,
  last_message_at TIMESTAMPTZ DEFAULT now(),
  unread_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID REFERENCES message_threads(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workspace/Settings
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  company_name TEXT,
  logo_url TEXT,
  currency TEXT DEFAULT 'GBP',
  timezone TEXT DEFAULT 'Europe/London',
  billing_plan TEXT DEFAULT 'free',
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY IF NOT EXISTS "Users own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users own contracts" ON contracts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users own invoices" ON invoices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users own crew" ON crew_members FOR ALL USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users own threads" ON message_threads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Thread members see messages" ON messages FOR ALL USING (
  EXISTS (SELECT 1 FROM message_threads WHERE id = thread_id AND auth.uid() = user_id)
);
CREATE POLICY IF NOT EXISTS "Users own workspace" ON workspaces FOR ALL USING (auth.uid() = user_id);

-- Crew members extended columns (run these in Supabase SQL editor if not already present)
ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive','on_leave'));
ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE crew_members ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1);

-- Invoices extended columns
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS issued_date TIMESTAMPTZ;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS line_items JSONB;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS notes TEXT;
