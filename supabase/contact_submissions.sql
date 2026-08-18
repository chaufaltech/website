-- Run this once in the Supabase SQL Editor (Project > SQL Editor > New query)
-- to create the table the contact form writes to.

create table if not exists contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Row Level Security is on by default for new Supabase tables. The
-- serverless function writes using the service_role key, which bypasses RLS
-- entirely, so no policies are required for the form to work. This just
-- keeps the table locked down against any client-side/anon access, which is
-- what you want since it holds people's contact info.
alter table contact_submissions enable row level security;
