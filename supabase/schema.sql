-- Supabase PostgreSQL Schema for Sai Meera Enquiries

-- 1. Create Enquiries Table
create table public.enquiries (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  company text,
  service text not null,
  message text not null,
  category_slug text,
  status text default 'new'::text not null,
  upload_paths text[] default array[]::text[] not null,
  upload_count integer default 0 not null,
  client_id_hash text not null, -- For rate limiting correlation
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Rate Limits Table (Server-side tracking)
create table public.rate_limits (
  client_id_hash text primary key,
  enquiries_count integer default 0,
  uploads_count integer default 0,
  last_enquiry_at timestamp with time zone,
  last_upload_at timestamp with time zone
);

-- 3. Row Level Security (RLS)
alter table public.enquiries enable row level security;
alter table public.rate_limits enable row level security;

-- Deny all anonymous client access. 
-- The Edge Functions will use the Service Role Key to bypass RLS.
create policy "Deny all public reads on enquiries" on public.enquiries for select using (false);
create policy "Deny all public inserts on enquiries" on public.enquiries for insert with check (false);
create policy "Deny all public updates on enquiries" on public.enquiries for update using (false);
create policy "Deny all public deletes on enquiries" on public.enquiries for delete using (false);

-- Allow authenticated (admin) users to select and update enquiries
create policy "Allow authenticated reads on enquiries" on public.enquiries for select using (lower(auth.jwt() ->> 'email') = 'ashwinkalai2k@gmail.com');
create policy "Allow authenticated updates on enquiries" on public.enquiries for update using (lower(auth.jwt() ->> 'email') = 'ashwinkalai2k@gmail.com');

create policy "Deny all public access to rate limits" on public.rate_limits for all using (false);

-- 4. Storage Bucket Setup
insert into storage.buckets (id, name, public) 
values ('enquiry-uploads', 'enquiry-uploads', false)
on conflict (id) do nothing;

-- 5. Storage RLS (Deny all client access, allow only via Signed URLs / Service Role)
create policy "Deny public reads on storage" on storage.objects for select using (false);
create policy "Deny public inserts on storage" on storage.objects for insert with check (false);
create policy "Deny public updates on storage" on storage.objects for update using (false);
create policy "Deny public deletes on storage" on storage.objects for delete using (false);

-- ═══════════ Phase 7: Orders/Payments ═══════════

-- 6. Create Orders Table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  enquiry_id uuid references public.enquiries(id) not null,
  razorpay_order_id text unique not null,
  razorpay_payment_id text,
  razorpay_signature text,
  amount_paise integer not null,
  currency text default 'INR' not null,
  status text default 'created' not null,   -- created | paid | failed
  receipt text not null,
  category_slug text not null,
  tier text not null,
  quantity integer not null,
  unit_price_paise integer not null,
  verified_by text,                          -- 'client' | 'webhook' | null
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.orders enable row level security;
create policy "Deny all public access to orders" on public.orders for all using (false);

-- Allow authenticated (admin) users to select and update orders
create policy "Allow authenticated reads on orders" on public.orders for select using (lower(auth.jwt() ->> 'email') = 'ashwinkalai2k@gmail.com');
create policy "Allow authenticated updates on orders" on public.orders for update using (lower(auth.jwt() ->> 'email') = 'ashwinkalai2k@gmail.com');
