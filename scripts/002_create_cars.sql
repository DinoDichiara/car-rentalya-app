-- Create cars table
create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  brand text not null,
  model text not null,
  year int not null,
  price_per_day numeric not null,
  image_url text,
  description text,
  horsepower int,
  transmission text default 'Automatic',
  seats int default 2,
  phone text,
  is_available boolean default true,
  created_at timestamptz default now()
);

alter table public.cars enable row level security;

-- Anyone can view cars
create policy "cars_select_all" on public.cars for select using (true);

-- Only car owner (admin) can insert
create policy "cars_insert_owner" on public.cars for insert with check (auth.uid() = owner_id);

-- Only car owner can update
create policy "cars_update_owner" on public.cars for update using (auth.uid() = owner_id);

-- Only car owner can delete
create policy "cars_delete_owner" on public.cars for delete using (auth.uid() = owner_id);
