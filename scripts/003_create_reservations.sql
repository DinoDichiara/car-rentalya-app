-- Create reservations table for blocked/rented dates
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  start_date date not null,
  end_date date not null,
  client_name text,
  notes text,
  created_at timestamptz default now()
);

alter table public.reservations enable row level security;

-- Anyone can view reservations (to check availability)
create policy "reservations_select_all" on public.reservations for select using (true);

-- Only the car owner can manage reservations
create policy "reservations_insert_owner" on public.reservations for insert
  with check (
    exists (
      select 1 from public.cars where cars.id = car_id and cars.owner_id = auth.uid()
    )
  );

create policy "reservations_update_owner" on public.reservations for update
  using (
    exists (
      select 1 from public.cars where cars.id = car_id and cars.owner_id = auth.uid()
    )
  );

create policy "reservations_delete_owner" on public.reservations for delete
  using (
    exists (
      select 1 from public.cars where cars.id = car_id and cars.owner_id = auth.uid()
    )
  );
