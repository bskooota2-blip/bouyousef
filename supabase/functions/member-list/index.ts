import { createClient } from 'npm:@supabase/supabase-js@2';

// Secure admin-only member directory; never put SUPABASE_SERVICE_ROLE_KEY in public files.
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'private, no-store',
};
const reply = (status: number, data: Record<string, unknown>) =>
  new Response(JSON.stringify(data), { status, headers });

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'GET') return reply(405, { error: 'method_not_allowed' });
  const bearer = /^Bearer\s+(.+)$/i.exec(request.headers.get('authorization') || '');
  if (!bearer) return reply(401, { error: 'unauthorized' });
  const url = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !serviceKey) return reply(503, { error: 'server_not_configured' });
  const pageParam = new URL(request.url).searchParams.get('page') || '1';
  if (!/^[1-9]\d{0,3}$/.test(pageParam)) return reply(400, { error: 'invalid_page' });
  const page = Number(pageParam);
  try {
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: current, error: authError } = await admin.auth.getUser(bearer[1]);
    if (authError || !current.user) return reply(401, { error: 'unauthorized' });
    // Same server-side allowlist used by member-count, not a client-side flag.
    const { data: allowed, error: accessError } = await admin.from('by3_admin_members')
      .select('user_id').eq('user_id', current.user.id).maybeSingle();
    if (accessError) return reply(503, { error: 'admin_access_not_configured' });
    if (!allowed) return reply(403, { error: 'forbidden' });
    const perPage = 50;
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) return reply(502, { error: 'member_list_unavailable' });
    const users = (data.users || []).map(u => ({
      first_name: typeof u.user_metadata?.first_name === 'string' ? u.user_metadata.first_name.slice(0, 100) : '',
      last_name: typeof u.user_metadata?.last_name === 'string' ? u.user_metadata.last_name.slice(0, 100) : '',
      email: u.email || '',
      created_at: u.created_at || null,
      last_sign_in_at: u.last_sign_in_at || null,
      email_confirmed: Boolean(u.email_confirmed_at),
    }));
    // Using a second page ensures accurate pagination with exact multiples of 50.
    let hasMore = users.length === perPage;
    if (hasMore) {
      if (typeof data.total === 'number') hasMore = page * perPage < data.total;
      else {
        const next = await admin.auth.admin.listUsers({ page: page + 1, perPage });
        if (next.error) return reply(502, { error: 'pagination_unavailable' });
        hasMore = (next.data.users?.length || 0) > 0;
      }
    }
    return reply(200, { users, page, has_more: hasMore });
  } catch (error) {
    console.error('member-list unexpected error:', error);
    return reply(500, { error: 'unexpected_error' });
  }
});
