drop policy if exists "members read audit"
on public.audit_log;

drop policy if exists "members insert evidence"
on public.evidence_refs;

drop policy if exists "members read evidence"
on public.evidence_refs;

drop policy if exists "admin coordinator catu manage assessments"
on public.assessments;

drop policy if exists "members read members"
on public.workspace_members;

drop policy if exists "members read workspaces"
on public.workspaces;

drop function if exists public.workspace_role(uuid);

drop function if exists public.is_workspace_member(uuid);

drop table if exists public.audit_log;

drop table if exists public.evidence_refs;

drop table if exists public.assessments;

drop table if exists public.workspace_members;

drop table if exists public.workspaces;

drop type if exists public.catu_role;
