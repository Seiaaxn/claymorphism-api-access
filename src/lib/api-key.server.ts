const jsonHeaders = { "content-type": "application/json; charset=utf-8" };

export function apiError(status: number, error: string, message: string) {
  return new Response(JSON.stringify({ status: false, error, message }, null, 2), {
    status,
    headers: jsonHeaders,
  });
}

export function apiJson(data: unknown, status = 200) {
  return new Response(JSON.stringify(data, null, 2), { status, headers: jsonHeaders });
}

/**
 * Validates the `apikey` query param (or `x-api-key` header) against the
 * api_keys table. Returns null when valid, or a Response to return directly.
 */
export async function requireApiKey(request: Request): Promise<Response | null> {
  const url = new URL(request.url);
  const key = url.searchParams.get("apikey") ?? request.headers.get("x-api-key");

  if (!key) {
    return apiError(
      401,
      "Unauthorized",
      "API key tidak ditemukan. Tambahkan ?apikey=... — daftar dulu untuk mendapatkan key.",
    );
  }

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { data, error } = await supabaseAdmin
    .from("api_keys")
    .select("id, is_active, request_count")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    return apiError(500, "Internal Server Error", "Gagal memvalidasi API key.");
  }
  if (!data || !data.is_active) {
    return apiError(403, "Forbidden", "API key tidak valid atau sudah dinonaktifkan.");
  }

  await supabaseAdmin
    .from("api_keys")
    .update({ request_count: Number(data.request_count ?? 0) + 1, last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return null;
}
