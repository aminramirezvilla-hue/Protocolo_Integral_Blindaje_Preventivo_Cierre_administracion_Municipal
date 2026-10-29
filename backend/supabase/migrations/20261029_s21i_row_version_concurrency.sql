-- ============================================================================
-- CATU / POST-RLS / G12 / S21I
-- Row Version Concurrency Migration
-- Version: 0.2.0
--
-- PURPOSE
--   Introduce a dedicated monotonic row_version column on:
--     - public.workspaces
--     - public.assessments
--
-- SECURITY / GOVERNANCE BOUNDARY
--   This migration:
--     - does not create roles;
--     - does not alter roles;
--     - does not create or alter RLS policies;
--     - does not grant privileges;
--     - does not revoke privileges;
--     - does not create functions;
--     - does not alter ownership;
--     - does not change direct-DML authorization;
--     - does not create logical target bindings;
--     - does not deploy application code.
--
-- EXECUTION MODEL
--   EXPAND -> BACKFILL -> CONSTRAIN -> VERIFY
--
-- FAIL-CLOSED
--   Any unexpected precondition must abort the transaction.
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. PRECHECKS
-- ============================================================================

DO $$
BEGIN
    IF to_regclass('public.workspaces') IS NULL THEN
        RAISE EXCEPTION
            'S21I_PRECHECK_FAILED: public.workspaces does not exist';
    END IF;

    IF to_regclass('public.assessments') IS NULL THEN
        RAISE EXCEPTION
            'S21I_PRECHECK_FAILED: public.assessments does not exist';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'workspaces'
          AND column_name = 'row_version'
    ) THEN
        RAISE EXCEPTION
            'S21I_PRECHECK_FAILED: public.workspaces.row_version already exists';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'assessments'
          AND column_name = 'row_version'
    ) THEN
        RAISE EXCEPTION
            'S21I_PRECHECK_FAILED: public.assessments.row_version already exists';
    END IF;
END
$$;

-- ============================================================================
-- 2. EXPAND
-- ============================================================================

ALTER TABLE public.workspaces
    ADD COLUMN row_version BIGINT;

ALTER TABLE public.assessments
    ADD COLUMN row_version BIGINT;

-- ============================================================================
-- 3. BACKFILL
-- ============================================================================

UPDATE public.workspaces
SET row_version = 1
WHERE row_version IS NULL;

UPDATE public.assessments
SET row_version = 1
WHERE row_version IS NULL;

-- ============================================================================
-- 4. BACKFILL VERIFICATION
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.workspaces
        WHERE row_version IS NULL
    ) THEN
        RAISE EXCEPTION
            'S21I_BACKFILL_FAILED: NULL row_version remains in public.workspaces';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.assessments
        WHERE row_version IS NULL
    ) THEN
        RAISE EXCEPTION
            'S21I_BACKFILL_FAILED: NULL row_version remains in public.assessments';
    END IF;
END
$$;

-- ============================================================================
-- 5. DEFAULT FINALIZATION
-- ============================================================================

ALTER TABLE public.workspaces
    ALTER COLUMN row_version SET DEFAULT 1;

ALTER TABLE public.assessments
    ALTER COLUMN row_version SET DEFAULT 1;

-- ============================================================================
-- 6. NULLABILITY FINALIZATION
-- ============================================================================

ALTER TABLE public.workspaces
    ALTER COLUMN row_version SET NOT NULL;

ALTER TABLE public.assessments
    ALTER COLUMN row_version SET NOT NULL;

-- ============================================================================
-- 7. FINAL PHYSICAL CONTRACT VERIFICATION
-- ============================================================================

DO $$
DECLARE
    ws_type text;
    ws_nullable text;
    ws_default text;

    as_type text;
    as_nullable text;
    as_default text;
BEGIN
    SELECT
        data_type,
        is_nullable,
        column_default
    INTO
        ws_type,
        ws_nullable,
        ws_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'workspaces'
      AND column_name = 'row_version';

    SELECT
        data_type,
        is_nullable,
        column_default
    INTO
        as_type,
        as_nullable,
        as_default
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'assessments'
      AND column_name = 'row_version';

    IF ws_type IS DISTINCT FROM 'bigint' THEN
        RAISE EXCEPTION
            'S21I_VERIFY_FAILED: workspaces.row_version type is %',
            ws_type;
    END IF;

    IF ws_nullable IS DISTINCT FROM 'NO' THEN
        RAISE EXCEPTION
            'S21I_VERIFY_FAILED: workspaces.row_version nullable state is %',
            ws_nullable;
    END IF;

    IF ws_default IS NULL
       OR ws_default !~ '(^|\D)1(\D|$)'
    THEN
        RAISE EXCEPTION
            'S21I_VERIFY_FAILED: workspaces.row_version default is %',
            ws_default;
    END IF;

    IF as_type IS DISTINCT FROM 'bigint' THEN
        RAISE EXCEPTION
            'S21I_VERIFY_FAILED: assessments.row_version type is %',
            as_type;
    END IF;

    IF as_nullable IS DISTINCT FROM 'NO' THEN
        RAISE EXCEPTION
            'S21I_VERIFY_FAILED: assessments.row_version nullable state is %',
            as_nullable;
    END IF;

    IF as_default IS NULL
       OR as_default !~ '(^|\D)1(\D|$)'
    THEN
        RAISE EXCEPTION
            'S21I_VERIFY_FAILED: assessments.row_version default is %',
            as_default;
    END IF;
END
$$;

-- ============================================================================
-- 8. SECURITY / RLS NON-MUTATION DECLARATION
-- ============================================================================
--
-- This migration intentionally contains no:
--
--   CREATE POLICY
--   ALTER POLICY
--   DROP POLICY
--   ENABLE ROW LEVEL SECURITY
--   DISABLE ROW LEVEL SECURITY
--   FORCE ROW LEVEL SECURITY
--   NO FORCE ROW LEVEL SECURITY
--   CREATE ROLE
--   ALTER ROLE
--   GRANT
--   REVOKE
--   CREATE FUNCTION
--   CREATE OR REPLACE FUNCTION
--   ALTER FUNCTION
--   DROP FUNCTION
--   ALTER OWNER
--
-- Existing RLS and privilege semantics must therefore remain unchanged.
--
-- ============================================================================

COMMIT;

-- ============================================================================
-- POST-MIGRATION CONTRACT
--
-- public.workspaces.row_version:
--     BIGINT NOT NULL DEFAULT 1
--
-- public.assessments.row_version:
--     BIGINT NOT NULL DEFAULT 1
--
-- Existing rows:
--     row_version = 1
--
-- Meaning of 1:
--     INITIAL_CONCURRENCY_BASELINE
--
-- Runtime increment:
--     NOT IMPLEMENTED BY THIS MIGRATION
--
-- Expected future mutation predicate:
--     row_version = expected_row_version
--
-- Expected future successful mutation:
--     row_version = row_version + 1
--
-- Blind re-execution:
--     PROHIBITED
--
-- Deployment:
--     NOT AUTHORIZED BY THIS FILE ALONE
-- ============================================================================
