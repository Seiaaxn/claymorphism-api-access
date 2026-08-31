import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { endpoints } from "@/lib/site";

export const Route = createFileRoute("/docs")({
  head: () => ({
    meta: [
      { title: "Dokumentasi Endpoint — Kyzz APIs v2" },
      {
        name: "description",
        content:
          "Dokumentasi lengkap endpoint Kyzz APIs v2 beserta playground untuk mencoba request langsung dengan API key kamu.",
      },
      { property: "og:title", content: "Dokumentasi Endpoint — Kyzz APIs v2" },
      {
        property: "og:description",
        content: "Coba endpoint Kyzz APIs v2 langsung dari browser dengan API key kamu.",
      },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("api_keys")
      .select("key")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.key) setApiKey(data.key);
      });
  }, [user]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="clay p-6">
            <h1 className="text-3xl">Dokumentasi API</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Semua endpoint membutuhkan API key. Kirim lewat query{" "}
              <code className="font-mono">?apikey=</code> atau header{" "}
              <code className="font-mono">x-api-key</code>.
            </p>

            <div className="mt-5">
              <span className="text-sm font-semibold">API key kamu</span>
              <input
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={user ? "Memuat key…" : "Masuk dulu untuk memakai key"}
                className="clay-inset mt-1.5 w-full px-4 py-3 font-mono text-sm outline-none placeholder:font-sans placeholder:text-muted-foreground"
              />
              {!user ? (
                <Link
                  to="/auth"
                  className="clay-sm clay-press mt-3 inline-flex bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
                >
                  Masuk / Daftar untuk dapat API key
                </Link>
              ) : null}
            </div>
          </div>

          {endpoints.map((endpoint) => (
            <EndpointCard key={endpoint.id} endpointId={endpoint.id} apiKey={apiKey} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function EndpointCard({ endpointId, apiKey }: { endpointId: string; apiKey: string }) {
  const endpoint = endpoints.find((e) => e.id === endpointId)!;
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      endpoint.params.filter((p) => p.name !== "apikey").map((p) => [p.name, p.example]),
    ),
  );
  const [result, setResult] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [busy, setBusy] = useState(false);

  function buildUrl() {
    const params = new URLSearchParams(values);
    params.set("apikey", apiKey || "YOUR_API_KEY");
    return `${endpoint.path}?${params.toString()}`;
  }

  async function run() {
    setBusy(true);
    setResult("");
    setImageUrl("");
    try {
      const res = await fetch(buildUrl());
      const contentType = res.headers.get("content-type") ?? "";
      if (contentType.startsWith("image/")) {
        const blob = await res.blob();
        setImageUrl(URL.createObjectURL(blob));
        setResult(`${res.status} ${res.statusText} · image (${contentType})`);
      } else {
        const text = await res.text();
        setResult(text);
      }
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Request gagal");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="clay p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="clay-sm bg-mint/70 px-3 py-1 font-mono text-xs font-bold">
          {endpoint.method}
        </span>
        <span className="font-mono text-sm">{endpoint.path}</span>
      </div>
      <h2 className="mt-3 text-xl">{endpoint.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{endpoint.description}</p>

      <div className="mt-5 space-y-3">
        {endpoint.params.map((param) =>
          param.name === "apikey" ? (
            <div key={param.name} className="clay-inset p-3 text-xs text-muted-foreground">
              <span className="font-mono font-bold">apikey</span> — diisi otomatis dari key di atas
              (wajib)
            </div>
          ) : (
            <label key={param.name} className="block">
              <span className="text-sm font-semibold">
                {param.name}
                {param.required ? " *" : ""}
              </span>
              <span className="ml-2 text-xs text-muted-foreground">{param.description}</span>
              <input
                value={values[param.name] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [param.name]: e.target.value }))}
                className="clay-inset mt-1.5 w-full px-4 py-3 text-sm outline-none"
              />
            </label>
          ),
        )}
      </div>

      <button
        onClick={run}
        disabled={busy}
        className="clay-sm clay-press mt-5 bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground disabled:opacity-60"
      >
        {busy ? "Mengirim…" : "Kirim request"}
      </button>

      <p className="clay-inset mt-4 overflow-x-auto p-3 font-mono text-xs">{buildUrl()}</p>

      {result ? (
        <pre className="clay-inset mt-4 max-h-80 overflow-auto p-4 font-mono text-xs">{result}</pre>
      ) : null}
      {imageUrl ? (
        <img src={imageUrl} alt={`Hasil ${endpoint.name}`} className="clay-sm mt-4 max-h-96 w-full object-contain" />
      ) : null}
    </div>
  );
}
