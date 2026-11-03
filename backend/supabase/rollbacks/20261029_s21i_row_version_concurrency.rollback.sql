BEGIN;

ALTER TABLE public.assessments
    DROP COLUMN IF EXISTS row_version;

ALTER TABLE public.workspaces
    DROP COLUMN IF EXISTS row_version;

COMMIT;
