-- ============================================================================
-- EXORA Business OS — Supabase Schema
-- Run this in Supabase SQL Editor (Project → SQL Editor → New query)
-- ============================================================================

create extension if not exists "pgcrypto";

-- ============================================================================
-- PROFILES (linked to auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text not null default '',
  role text not null default 'staff' check (role in ('super_admin','owner','manager','staff')),
  is_active boolean not null default true,
  avatar_url text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Helper: current user's role (security definer to avoid RLS recursion)
create or replace function public.current_role() returns text as $$
  select role from public.profiles where id = auth.uid()
$$ language sql stable security definer;

create or replace function public.is_admin() returns boolean as $$
  select public.current_role() in ('super_admin','owner')
$$ language sql stable security definer;

-- Auto-create profile row when a new auth user signs up
create or replace function public.handle_new_user() returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
    coalesce(new.raw_user_meta_data->>'role', 'staff')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- CRM: CUSTOMERS, LEADS, ACTIVITIES
-- ============================================================================
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text default '',
  phone text default '',
  company text default '',
  address text default '',
  status text not null default 'active' check (status in ('active','inactive')),
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text default '',
  phone text default '',
  company text default '',
  source text not null default 'other' check (source in ('website','referral','social','cold_call','other')),
  stage text not null default 'new' check (stage in ('new','contacted','qualified','proposal','negotiation','closed','lost')),
  value numeric not null default 0,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  type text not null default 'note' check (type in ('note','call','email','meeting')),
  description text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- INVENTORY: PRODUCTS, INVENTORY, STOCK MOVEMENTS
-- ============================================================================
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text default '',
  category text default '',
  description text default '',
  price numeric not null default 0,
  cost numeric not null default 0,
  unit text not null default 'pcs',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.inventory (
  product_id uuid primary key references public.products(id) on delete cascade,
  quantity numeric not null default 0,
  min_stock numeric not null default 0,
  location text default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  type text not null check (type in ('in','out','adjustment')),
  quantity numeric not null default 0,
  reference text default '',
  notes text default '',
  created_at timestamptz not null default now()
);

-- Auto-create inventory row when a product is created
create or replace function public.handle_new_product() returns trigger as $$
begin
  insert into public.inventory (product_id, quantity, min_stock, location)
  values (new.id, 0, 0, '');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_product_created on public.products;
create trigger on_product_created
  after insert on public.products
  for each row execute procedure public.handle_new_product();

-- ============================================================================
-- FINANCE: TRANSACTIONS
-- ============================================================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('income','expense')),
  amount numeric not null default 0,
  category text default '',
  description text not null,
  reference text default '',
  payment_method text not null default 'cash' check (payment_method in ('cash','transfer','card','other')),
  status text not null default 'paid' check (status in ('paid','unpaid','partial')),
  contact_name text default '',
  date date not null default current_date,
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- PROJECTS & TASKS
-- ============================================================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default '',
  status text not null default 'planning' check (status in ('planning','active','on_hold','completed','cancelled')),
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  client_name text default '',
  client_id uuid,
  budget numeric not null default 0,
  spent numeric not null default 0,
  start_date date,
  end_date date,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text default '',
  status text not null default 'todo' check (status in ('todo','in_progress','review','done')),
  priority text not null default 'medium' check (priority in ('low','medium','high','critical')),
  assigned_to uuid references public.profiles(id),
  assigned_name text default '',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- HR: EMPLOYEES, ATTENDANCE, LEAVE REQUESTS
-- ============================================================================
create table if not exists public.employees (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text default '',
  phone text default '',
  role text default '',
  department text default '',
  status text not null default 'active' check (status in ('active','inactive','on_leave')),
  salary numeric not null default 0,
  join_date date,
  birth_date date,
  address text default '',
  emergency_contact text default '',
  notes text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  date date not null,
  status text not null default 'present' check (status in ('present','absent','late','leave','holiday')),
  check_in text default '',
  check_out text default '',
  notes text default '',
  created_at timestamptz not null default now(),
  unique (employee_id, date)
);

create table if not exists public.leave_requests (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees(id) on delete cascade,
  type text not null check (type in ('annual','sick','personal','unpaid')),
  start_date date not null,
  end_date date not null,
  reason text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- SETTINGS (key-value)
-- ============================================================================
create table if not exists public.settings (
  key text primary key,
  value text default '',
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
alter table public.profiles        enable row level security;
alter table public.customers       enable row level security;
alter table public.leads           enable row level security;
alter table public.activities      enable row level security;
alter table public.products        enable row level security;
alter table public.inventory       enable row level security;
alter table public.stock_movements enable row level security;
alter table public.transactions    enable row level security;
alter table public.projects        enable row level security;
alter table public.tasks           enable row level security;
alter table public.employees       enable row level security;
alter table public.attendance      enable row level security;
alter table public.leave_requests  enable row level security;
alter table public.settings        enable row level security;

-- PROFILES: everyone authenticated can read all profiles (for name lookups);
-- users can update their own row; only admins can update any profile.
create policy "profiles_select_all" on public.profiles
  for select using (auth.role() = 'authenticated');

create policy "profiles_update_own_or_admin" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

create policy "profiles_insert_admin" on public.profiles
  for insert with check (public.is_admin());

create policy "profiles_delete_admin" on public.profiles
  for delete using (public.is_admin());

-- GENERIC: all business tables — full access for any authenticated user
-- (single-tenant internal tool; adjust per-org if multi-tenant is needed)
do $$
declare
  t text;
  tables text[] := array[
    'customers','leads','activities','products','inventory','stock_movements',
    'transactions','projects','tasks','employees','attendance','leave_requests'
  ];
begin
  foreach t in array tables loop
    execute format('create policy "%s_all_authenticated" on public.%I for all using (auth.role() = ''authenticated'') with check (auth.role() = ''authenticated'')', t, t);
  end loop;
end $$;

-- SETTINGS: everyone authenticated can read; only admins can write
create policy "settings_select_all" on public.settings
  for select using (auth.role() = 'authenticated');

create policy "settings_write_admin" on public.settings
  for insert with check (public.is_admin());

create policy "settings_update_admin" on public.settings
  for update using (public.is_admin());

create policy "settings_delete_admin" on public.settings
  for delete using (public.is_admin());

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_activities_entity on public.activities (entity_type, entity_id);
create index if not exists idx_stock_movements_product on public.stock_movements (product_id);
create index if not exists idx_tasks_project on public.tasks (project_id);
create index if not exists idx_attendance_employee on public.attendance (employee_id);
create index if not exists idx_leave_employee on public.leave_requests (employee_id);
create index if not exists idx_transactions_date on public.transactions (date);
create index if not exists idx_transactions_type on public.transactions (type);

-- ============================================================================
-- SEED: default settings + first super admin notice
-- ============================================================================
insert into public.settings (key, value) values
  ('company_name', 'EXORA Business'),
  ('company_email', ''),
  ('company_phone', ''),
  ('company_address', ''),
  ('company_website', ''),
  ('currency', 'IDR'),
  ('timezone', 'Asia/Jakarta'),
  ('date_format', 'DD/MM/YYYY'),
  ('fiscal_year_start', '01')
on conflict (key) do nothing;

-- ============================================================================
-- NOTE: Creating the first Super Admin
-- ============================================================================
-- 1. Go to Authentication → Users → Add user (email + password).
-- 2. The trigger above auto-creates a row in public.profiles with role='staff'.
-- 3. Run this to promote it to super_admin (replace the email):
--
--   update public.profiles set role = 'super_admin'
--   where email = 'admin@exora.com';
-- ============================================================================

-- ============================================================================
-- POS MODULE
-- ============================================================================
create table if not exists public.pos_sales (
  id uuid primary key default gen_random_uuid(),
  receipt_no text not null unique,
  cashier_id uuid references public.profiles(id),
  cashier_name text default '',
  shift_id text default '',
  customer_id uuid references public.customers(id),
  customer_name text default '',
  subtotal numeric not null default 0,
  discount numeric not null default 0,
  total numeric not null default 0,
  payment_method text not null default 'cash',
  amount_paid numeric not null default 0,
  change_amount numeric not null default 0,
  points_earned integer not null default 0,
  points_redeemed integer not null default 0,
  transaction_id uuid,
  notes text default '',
  is_refunded boolean not null default false,
  refunded_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.pos_sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.pos_sales(id) on delete cascade,
  product_id uuid references public.products(id),
  product_name text not null,
  product_sku text default '',
  qty numeric not null default 1,
  price numeric not null default 0,
  discount_type text not null default 'nominal',
  discount_value numeric not null default 0,
  subtotal numeric not null default 0,
  total numeric not null default 0,
  unit text default 'pcs'
);

create table if not exists public.pos_loyalty (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null unique references public.customers(id) on delete cascade,
  points numeric not null default 0,
  total_earned numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS for POS tables
alter table public.pos_sales      enable row level security;
alter table public.pos_sale_items enable row level security;
alter table public.pos_loyalty    enable row level security;

create policy "pos_sales_all_authenticated"      on public.pos_sales      for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "pos_sale_items_all_authenticated" on public.pos_sale_items for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "pos_loyalty_all_authenticated"    on public.pos_loyalty    for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Indexes
create index if not exists idx_pos_sales_created     on public.pos_sales (created_at);
create index if not exists idx_pos_sales_receipt     on public.pos_sales (receipt_no);
create index if not exists idx_pos_sales_cashier     on public.pos_sales (cashier_id);
create index if not exists idx_pos_sale_items_sale   on public.pos_sale_items (sale_id);
create index if not exists idx_pos_loyalty_customer  on public.pos_loyalty (customer_id);
