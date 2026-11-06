/*
 * CATU assessment-cas-mutate Edge Function v1
 *
 * Candidate only.
 * Not deployed by this gate.
 */

import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, apikey, content-type',
  'Access-Control-Allow-Methods':
    'POST, OPTIONS',
  'Content-Type': 'application/json'
};

function jsonResponse(
  status: number,
  body: Record<string, unknown>
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: corsHeaders
    }
  );
}

function readKeySet(
  variableName: string,
  legacyVariableName: string
): string | null {
  const raw = Deno.env.get(variableName);

  if (raw) {
    try {
      const parsed = JSON.parse(raw);

      if (
        parsed &&
        typeof parsed.default === 'string' &&
        parsed.default.length > 0
      ) {
        return parsed.default;
      }
    } catch {
      // malformed modern-key environment;
      // legacy fallback below
    }
  }

  return Deno.env.get(legacyVariableName) ?? null;
}

function isPlainObject(value: unknown):
  value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

const invalid400 = new Set([
  'INVALID_EXPECTED_ROW_VERSION',
  'INVALID_CONTROL_ID',
  'EMPTY_OR_INVALID_PATCH',
  'INVALID_PROGRESS',
  'INVALID_RESIDUAL_RISK',
  'INVALID_OIC_VALIDATION_PATCH',
  'UNKNOWN_OPERATION'
]);

const forbidden403 = new Set([
  'WORKSPACE_ACCESS_DENIED',
  'ROLE_NOT_AUTHORIZED'
]);

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, {
      ok: false,
      code: 'METHOD_NOT_ALLOWED'
    });
  }

  const supabaseUrl =
    Deno.env.get('SUPABASE_URL');

  const publishableKey = readKeySet(
    'SUPABASE_PUBLISHABLE_KEYS',
    'SUPABASE_ANON_KEY'
  );

  const secretKey = readKeySet(
    'SUPABASE_SECRET_KEYS',
    'SUPABASE_SERVICE_ROLE_KEY'
  );

  if (
    !supabaseUrl ||
    !publishableKey ||
    !secretKey
  ) {
    return jsonResponse(500, {
      ok: false,
      code: 'SERVER_CONFIGURATION_ERROR'
    });
  }

  const authorization =
    req.headers.get('Authorization') || '';

  const match =
    authorization.match(/^Bearer[ ]+(.+)$/i);

  if (!match) {
    return jsonResponse(401, {
      ok: false,
      code: 'AUTH_REQUIRED'
    });
  }

  const jwt = match[1];

  /*
   * User client exists only to resolve and verify
   * the authenticated identity.
   */
  const userClient = createClient(
    supabaseUrl,
    publishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );

  const {
    data: userData,
    error: userError
  } = await userClient.auth.getUser(jwt);

  if (
    userError ||
    !userData?.user?.id
  ) {
    return jsonResponse(401, {
      ok: false,
      code: 'AUTH_INVALID'
    });
  }

  const actorId = userData.user.id;

  let payload: unknown;

  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, {
      ok: false,
      code: 'INVALID_JSON'
    });
  }

  if (!isPlainObject(payload)) {
    return jsonResponse(400, {
      ok: false,
      code: 'INVALID_REQUEST'
    });
  }

  if (
    'actor_id' in payload ||
    'actorId' in payload
  ) {
    return jsonResponse(400, {
      ok: false,
      code: 'CLIENT_ACTOR_ID_PROHIBITED'
    });
  }

  const workspaceId =
    payload.workspace_id;

  const controlId =
    payload.control_id;

  const expectedRowVersion =
    payload.expected_row_version;

  const operation =
    payload.operation;

  const patch =
    payload.patch;

  if (
    typeof workspaceId !== 'string' ||
    workspaceId.length === 0 ||
    typeof controlId !== 'string' ||
    !/^R[0-9]{3}$/.test(controlId) ||
    !Number.isInteger(expectedRowVersion) ||
    Number(expectedRowVersion) < 1 ||
    (
      operation !== 'operational_patch' &&
      operation !== 'oic_validation'
    ) ||
    !isPlainObject(patch) ||
    Object.keys(patch).length === 0
  ) {
    return jsonResponse(400, {
      ok: false,
      code: 'INVALID_REQUEST'
    });
  }

  /*
   * Elevated client exists only inside Edge.
   * It MUST NOT be exposed to browser code.
   */
  const adminClient = createClient(
    supabaseUrl,
    secretKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    }
  );

  const {
    data,
    error
  } = await adminClient.rpc(
    'internal_assessment_cas_mutate',
    {
      p_actor_id: actorId,
      p_workspace_id: workspaceId,
      p_control_id: controlId,
      p_expected_row_version:
        expectedRowVersion,
      p_operation: operation,
      p_patch: patch
    }
  );

  if (error) {
    console.error(
      'assessment-cas-mutate rpc failure',
      error.code
    );

    return jsonResponse(500, {
      ok: false,
      code: 'RPC_FAILURE'
    });
  }

  if (!isPlainObject(data)) {
    return jsonResponse(500, {
      ok: false,
      code: 'INVALID_RPC_RESPONSE'
    });
  }

  const code =
    typeof data.code === 'string'
      ? data.code
      : '';

  if (
    data.ok === true &&
    code === 'UPDATED'
  ) {
    return jsonResponse(200, data);
  }

  if (
    code ===
    'CONCURRENCY_CONFLICT_OR_NOT_FOUND'
  ) {
    return jsonResponse(409, data);
  }

  if (
    code === 'AUTH_REQUIRED'
  ) {
    return jsonResponse(401, data);
  }

  if (forbidden403.has(code)) {
    return jsonResponse(403, data);
  }

  if (invalid400.has(code)) {
    return jsonResponse(400, data);
  }

  return jsonResponse(500, {
    ok: false,
    code: 'UNMAPPED_RPC_RESULT'
  });
});
