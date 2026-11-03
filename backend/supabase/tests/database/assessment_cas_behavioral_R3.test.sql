begin;

select plan(40);

-- ============================================================
-- CATU CAS deterministic behavioral contract R1
-- Entire test is transactional and rolled back.
-- No hosted Supabase access.
-- ============================================================

-- ------------------------------------------------------------
-- FIXTURE IDENTITIES
-- ------------------------------------------------------------

insert into auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
)
values
(
 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
 'authenticated',
 'authenticated',
 'catu-test-admin@local.invalid',
 '',
 now(),
 '{}'::jsonb,
 '{}'::jsonb,
 now(),
 now()
),
(
 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
 'authenticated',
 'authenticated',
 'catu-test-coordinator@local.invalid',
 '',
 now(),
 '{}'::jsonb,
 '{}'::jsonb,
 now(),
 now()
),
(
 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
 'authenticated',
 'authenticated',
 'catu-test-area@local.invalid',
 '',
 now(),
 '{}'::jsonb,
 '{}'::jsonb,
 now(),
 now()
),
(
 'dddddddd-dddd-4ddd-8ddd-ddddddddddd4',
 'authenticated',
 'authenticated',
 'catu-test-oic@local.invalid',
 '',
 now(),
 '{}'::jsonb,
 '{}'::jsonb,
 now(),
 now()
),
(
 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee5',
 'authenticated',
 'authenticated',
 'catu-test-catu@local.invalid',
 '',
 now(),
 '{}'::jsonb,
 '{}'::jsonb,
 now(),
 now()
),
(
 'ffffffff-ffff-4fff-8fff-fffffffffff6',
 'authenticated',
 'authenticated',
 'catu-test-outsider@local.invalid',
 '',
 now(),
 '{}'::jsonb,
 '{}'::jsonb,
 now(),
 now()
);


-- ------------------------------------------------------------
-- WORKSPACE FIXTURE
-- ------------------------------------------------------------

insert into public.workspaces (
    id,
    municipality
)
values (
    '11111111-1111-4111-8111-111111111111',
    'CATU Behavioral Test Municipality'
);


insert into public.workspace_members (
    workspace_id,
    user_id,
    role,
    area,
    active
)
values
(
 '11111111-1111-4111-8111-111111111111',
 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
 'admin',
 null,
 true
),
(
 '11111111-1111-4111-8111-111111111111',
 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
 'coordinator',
 null,
 true
),
(
 '11111111-1111-4111-8111-111111111111',
 'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
 'area',
 'Obras',
 true
),
(
 '11111111-1111-4111-8111-111111111111',
 'dddddddd-dddd-4ddd-8ddd-ddddddddddd4',
 'oic',
 null,
 true
),
(
 '11111111-1111-4111-8111-111111111111',
 'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee5',
 'catu',
 null,
 true
);


insert into public.assessments (
    workspace_id,
    control_id
)
select
    '11111111-1111-4111-8111-111111111111'::uuid,
    'R' || lpad(n::text, 3, '0')
from generate_series(1,12) as g(n);


-- All behavioral calls below use the actual production execution role.
set local role service_role;


-- ============================================================
-- B1 BASIC INPUT / ACCESS VALIDATION
-- ============================================================

select is(
  (
    public.internal_assessment_cas_mutate(
      null::uuid,
      '11111111-1111-4111-8111-111111111111',
      'R001',
      1,
      'operational_patch',
      '{"status":"En proceso"}'::jsonb
    )->>'code'
  ),
  'AUTH_REQUIRED',
  'B01 actor null => AUTH_REQUIRED'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R001',
      null,
      'operational_patch',
      '{"status":"En proceso"}'::jsonb
    )->>'code'
  ),
  'INVALID_EXPECTED_ROW_VERSION',
  'B02 expected row_version null rejected'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R001',
      0,
      'operational_patch',
      '{"status":"En proceso"}'::jsonb
    )->>'code'
  ),
  'INVALID_EXPECTED_ROW_VERSION',
  'B03 expected row_version zero rejected'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'BAD',
      1,
      'operational_patch',
      '{"status":"En proceso"}'::jsonb
    )->>'code'
  ),
  'INVALID_CONTROL_ID',
  'B04 invalid control id rejected'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R001',
      1,
      'operational_patch',
      '{}'::jsonb
    )->>'code'
  ),
  'EMPTY_OR_INVALID_PATCH',
  'B05 empty patch rejected'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'ffffffff-ffff-4fff-8fff-fffffffffff6',
      '11111111-1111-4111-8111-111111111111',
      'R001',
      1,
      'operational_patch',
      '{"status":"En proceso"}'::jsonb
    )->>'code'
  ),
  'WORKSPACE_ACCESS_DENIED',
  'B06 nonmember actor denied'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R008',
      1,
      'undefined_operation',
      '{"status":"En proceso"}'::jsonb
    )->>'code'
  ),
  'UNKNOWN_OPERATION',
  'B07 unknown operation rejected'
);


-- ============================================================
-- B2 ROLE BOUNDARIES
-- ============================================================

select is(
  (
    public.internal_assessment_cas_mutate(
      'cccccccc-cccc-4ccc-8ccc-ccccccccccc3',
      '11111111-1111-4111-8111-111111111111',
      'R004',
      1,
      'operational_patch',
      '{"status":"En proceso"}'::jsonb
    )->>'code'
  ),
  'ROLE_NOT_AUTHORIZED',
  'B08 area cannot execute operational_patch'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'dddddddd-dddd-4ddd-8ddd-ddddddddddd4',
      '11111111-1111-4111-8111-111111111111',
      'R005',
      1,
      'operational_patch',
      '{"status":"En proceso"}'::jsonb
    )->>'code'
  ),
  'ROLE_NOT_AUTHORIZED',
  'B09 oic cannot execute operational_patch'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R007',
      1,
      'oic_validation',
      '{"oic_validation":"Validada"}'::jsonb
    )->>'code'
  ),
  'ROLE_NOT_AUTHORIZED',
  'B10 admin cannot execute oic_validation'
);


select is(
  (
    select count(*)::integer
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id in ('R004','R005','R007')
      and row_version = 1
  ),
  3,
  'B11 denied role attempts do not mutate assessments'
);


-- ============================================================
-- B3 ADMIN OPERATIONAL SUCCESS + AUDIT
-- ============================================================

create temporary table cas_test_results (
    name text primary key,
    result jsonb not null
);

insert into cas_test_results(name,result)
values (
  'admin_success',
  public.internal_assessment_cas_mutate(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'R001',
    1,
    'operational_patch',
    '{"status":"En proceso","progress":40}'::jsonb
  )
);


select is(
  (select result->>'code'
     from cas_test_results
    where name='admin_success'),
  'UPDATED',
  'B12 admin operational_patch succeeds'
);


select is(
  (
    select (result->>'row_version')::bigint
    from cas_test_results
    where name='admin_success'
  ),
  2::bigint,
  'B13 CAS response returns row_version 2'
);


select is(
  (
    select status
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R001'
  ),
  'En proceso',
  'B14 operational status persisted'
);


select is(
  (
    select progress
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R001'
  ),
  40,
  'B15 operational progress persisted'
);


select is(
  (
    select row_version
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R001'
  ),
  2::bigint,
  'B16 successful mutation increments N to N+1'
);


select is(
  (
    select count(*)::integer
    from public.audit_log
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R001'
  ),
  1,
  'B17 successful mutation writes exactly one audit row'
);


select is(
  (
    select
      event_type
      || '|' ||
      user_id::text
      || '|' ||
      summary
    from public.audit_log
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R001'
  ),
  'assessment.cas.operational_patch'
    || '|aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'
    || '|CAS mutation accepted; row_version=2',
  'B18 operational audit semantics certified'
);


-- ============================================================
-- B4 STALE VERSION / NOT FOUND
-- ============================================================

select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R001',
      1,
      'operational_patch',
      '{"progress":50}'::jsonb
    )->>'code'
  ),
  'CONCURRENCY_CONFLICT_OR_NOT_FOUND',
  'B19 stale row_version produces CAS conflict'
);


select is(
  (
    select row_version
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R001'
  ),
  2::bigint,
  'B20 stale request cannot increment row_version'
);


select is(
  (
    select count(*)::integer
    from public.audit_log
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R001'
  ),
  1,
  'B21 stale request creates no additional audit row'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R999',
      1,
      'operational_patch',
      '{"status":"En proceso"}'::jsonb
    )->>'code'
  ),
  'CONCURRENCY_CONFLICT_OR_NOT_FOUND',
  'B22 nonexistent assessment uses controlled CAS failure'
);


select is(
  (
    select count(*)::integer
    from public.audit_log
    where control_id='R999'
  ),
  0,
  'B23 nonexistent assessment creates no audit row'
);


-- ============================================================
-- B5 COORDINATOR / CATU AUTHORIZED PATHS
-- ============================================================

select is(
  (
    public.internal_assessment_cas_mutate(
      'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
      '11111111-1111-4111-8111-111111111111',
      'R002',
      1,
      'operational_patch',
      '{"responsible":"Coordinación General"}'::jsonb
    )->>'code'
  ),
  'UPDATED',
  'B24 coordinator operational_patch succeeds'
);


select is(
  (
    select responsible
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R002'
  ),
  'Coordinación General',
  'B25 coordinator mutation persisted'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeee5',
      '11111111-1111-4111-8111-111111111111',
      'R003',
      1,
      'operational_patch',
      '{"evidence_status":"Integrada"}'::jsonb
    )->>'code'
  ),
  'UPDATED',
  'B26 catu operational_patch succeeds'
);


select is(
  (
    select evidence_status
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R003'
  ),
  'Integrada',
  'B27 catu mutation persisted'
);


-- ============================================================
-- B6 FIELD / VALUE BOUNDARIES
-- ============================================================

select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R008',
      1,
      'operational_patch',
      '{"oic_validation":"No permitido"}'::jsonb
    )->>'code'
  ),
  'FIELD_NOT_MUTABLE',
  'B28 operational path rejects nonmutable field'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R009',
      1,
      'operational_patch',
      '{"progress":"50"}'::jsonb
    )->>'code'
  ),
  'INVALID_PROGRESS',
  'B29 progress string rejected'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R009',
      1,
      'operational_patch',
      '{"progress":101}'::jsonb
    )->>'code'
  ),
  'INVALID_PROGRESS',
  'B30 progress above 100 rejected'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
      '11111111-1111-4111-8111-111111111111',
      'R010',
      1,
      'operational_patch',
      '{"residual_risk":5}'::jsonb
    )->>'code'
  ),
  'INVALID_RESIDUAL_RISK',
  'B31 residual risk outside 1-4 rejected'
);


select is(
  (
    select count(*)::integer
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id in ('R008','R009','R010')
      and row_version = 1
  ),
  3,
  'B32 rejected field/value mutations leave versions unchanged'
);


-- ============================================================
-- B7 OIC VALIDATION CONTRACT
-- ============================================================

select is(
  (
    public.internal_assessment_cas_mutate(
      'dddddddd-dddd-4ddd-8ddd-ddddddddddd4',
      '11111111-1111-4111-8111-111111111111',
      'R011',
      1,
      'oic_validation',
      '{"oic_validation":"Validada","notes":"extra"}'::jsonb
    )->>'code'
  ),
  'INVALID_OIC_VALIDATION_PATCH',
  'B33 OIC patch rejects additional keys'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'dddddddd-dddd-4ddd-8ddd-ddddddddddd4',
      '11111111-1111-4111-8111-111111111111',
      'R011',
      1,
      'oic_validation',
      '{"oic_validation":"   "}'::jsonb
    )->>'code'
  ),
  'INVALID_OIC_VALIDATION_PATCH',
  'B34 blank OIC validation rejected'
);


select is(
  (
    public.internal_assessment_cas_mutate(
      'dddddddd-dddd-4ddd-8ddd-ddddddddddd4',
      '11111111-1111-4111-8111-111111111111',
      'R006',
      1,
      'oic_validation',
      '{"oic_validation":"Validada"}'::jsonb
    )->>'code'
  ),
  'UPDATED',
  'B35 OIC authorized validation succeeds'
);


select is(
  (
    select oic_validation || '|' || row_version::text
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R006'
  ),
  'Validada|2',
  'B36 OIC validation persists and increments row_version'
);


select is(
  (
    select
      event_type
      || '|' ||
      summary
    from public.audit_log
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R006'
  ),
  'assessment.cas.oic_validation'
    || '|CAS mutation accepted; row_version=2',
  'B37 OIC mutation generates correct audit event'
);


-- ============================================================
-- B8 ATOMICITY: FORCE AUDIT FAILURE
-- ============================================================

reset role;

alter table public.audit_log
  add constraint catu_test_forced_audit_failure
  check (false)
  not valid;

set local role service_role;

do $$
begin

  perform public.internal_assessment_cas_mutate(
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    '11111111-1111-4111-8111-111111111111',
    'R012',
    1,
    'operational_patch',
    '{"status":"AtomicShouldRollback"}'::jsonb
  );

  perform set_config(
    'catu.atomic_sqlstate',
    'NO_ERROR',
    true
  );

exception
  when others then

    perform set_config(
      'catu.atomic_sqlstate',
      sqlstate,
      true
    );

end
$$;

reset role;


select is(
  current_setting(
    'catu.atomic_sqlstate',
    true
  ),
  '23514',
  'B38 forced audit failure propagates check violation'
);


select is(
  (
    select status || '|' || row_version::text
    from public.assessments
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R012'
  ),
  'No evaluado|1',
  'B39 audit failure atomically rolls back assessment mutation'
);


select is(
  (
    select count(*)::integer
    from public.audit_log
    where workspace_id =
          '11111111-1111-4111-8111-111111111111'
      and control_id='R012'
  ),
  0,
  'B40 failed transaction leaves no audit residue'
);


alter table public.audit_log
  drop constraint catu_test_forced_audit_failure;


select * from finish();

rollback;
