-- CATU E-R — propuesta de esquema para v0.2 multiusuario.
-- NO se requiere para el piloto v0.1 local.
-- Ejecutar únicamente en un proyecto Supabase controlado por CATU y después de revisión de RLS.

create extension if not exists pgcrypto;

create type public.catu_role as enum ('admin','coordinator','area','oic','catu');

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  municipality text not null,
  state text not null default 'Guerrero',
  outgoing_period text,
  incoming_period text,
  baseline_date date,
  max_users integer not null default 25 check (max_users between 1 and 50),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.catu_role not null,
  area text,
  active boolean not null default true,
  primary key (workspace_id,user_id)
);

create table public.assessments (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  control_id text not null check (control_id ~ '^R[0-9]{3}$'),
  status text not null default 'No evaluado',
  evidence_status text not null default 'No evaluada',
  scenario text not null default 'Sin incidencia',
  route text not null default 'No aplica',
  responsible text,
  due_date date,
  progress integer not null default 0 check (progress between 0 and 100),
  residual_risk integer not null default 2 check (residual_risk between 1 and 4),
  evidence_link text,
  notes text,
  oic_validation text not null default 'Pendiente',
  evaluated_by uuid references auth.users(id),
  evaluated_at timestamptz,
  closed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (workspace_id,control_id)
);

create table public.evidence_refs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  control_id text not null,
  description text not null,
  external_url text,
  document_date date,
  integrity text,
  verified boolean not null default false,
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table public.audit_log (
  id bigint generated always as identity primary key,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid references auth.users(id),
  event_type text not null,
  control_id text,
  summary text,
  created_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.assessments enable row level security;
alter table public.evidence_refs enable row level security;
alter table public.audit_log enable row level security;

create or replace function public.is_workspace_member(w uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(
    select 1 from public.workspace_members m
    where m.workspace_id=w and m.user_id=auth.uid() and m.active=true
  );
$$;

create or replace function public.workspace_role(w uuid)
returns public.catu_role language sql stable security definer set search_path = public as $$
  select m.role from public.workspace_members m
  where m.workspace_id=w and m.user_id=auth.uid() and m.active=true
  limit 1;
$$;

create policy "members read workspaces"
on public.workspaces for select
using (public.is_workspace_member(id));

create policy "members read members"
on public.workspace_members for select
using (public.is_workspace_member(workspace_id));

create policy "admin coordinator catu manage assessments"
on public.assessments for all
using (public.is_workspace_member(workspace_id))
with check (public.is_workspace_member(workspace_id));

create policy "members read evidence"
on public.evidence_refs for select
using (public.is_workspace_member(workspace_id));

create policy "members insert evidence"
on public.evidence_refs for insert
with check (public.is_workspace_member(workspace_id));

create policy "members read audit"
on public.audit_log for select
using (public.is_workspace_member(workspace_id));

-- IMPORTANTE:
-- Antes de Beta deben endurecerse las políticas por rol y área.
-- El OIC debe ser el único perfil municipal capaz de validar oic_validation.
-- Un Responsable de área debe editar sólo controles asignados a su ámbito.
-- CATU debe acceder exclusivamente a workspaces contratados/asignados.
-- Nunca usar service_role en el navegador.
