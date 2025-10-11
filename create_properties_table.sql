-- create_properties_table.sql
-- Crea la tabla properties


create table if not exists public.properties (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text not null,
  price numeric not null,
  location text not null,
  images jsonb not null default '[]',
  -- owner_id como text para permitir UIDs de proveedores externos (ej. Clerk: user_xxx)
  owner_id text not null,
  created_at timestamptz not null default now()
);

-- Índice para búsquedas por owner
create index if not exists idx_properties_owner_id on public.properties(owner_id);
