import { createClient } from 'npm:@supabase/supabase-js@2';

// Supabase Edge Function. Never expose SUPABASE_SERVICE_ROLE_KEY to the browser.
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'private, no-store',
};
const reply = (status: number, code: string, count?: number) =>
  new Response(JSON.stringify(count === undefined ? { error: code } : { count }), { status, headers: cors });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (request.method !== 'GET') return reply(405, 'method_not_allowed');

  const match = /^Bearer\s+(.+)$/i.exec(request.headers.get('Authorization') || '');
  if (!match) return reply(401, 'unauthorized');
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return reply(503, 'server_not_configured');

  try {
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: userData, error: userError } = await admin.auth.getUser(match[1]);
    if (userError || !userData.user) return reply(401, 'unauthorized');

    // Explicit server-side allowlist. Public dashboard RPC results are NOT a security check.
    const { data: permitted, error: permissionError } = await admin
      .from('by3_admin_members')
      .select('user_id')
      .eq('user_id', userData.user.id)
      .maybeSingle();
    if (permissionError) {
      console.error('member-count admin permission table unavailable:', permissionError.code);
      return reply(503, 'admin_access_not_configured');
    }
    if (!permitted) return reply(403, 'forbidden');

    let count = 0;
    const perPage = 500;
    for (let page = 1; page <= 10000; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
      if (error) {
        console.error('member-count listing failed:', error.message);
        return reply(502, 'member_count_unavailable');
      }
      const found = data.users?.length || 0;
      count += found;
      if (found < perPage) return reply(200, 'ok', count);
    }
    return reply(503, 'pagination_limit');
  } catch (error) {
    console.error('member-count unexpected failure:', error);
    return reply(500, 'unexpected_error');
  }
});
