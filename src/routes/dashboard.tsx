import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard API Key — Kyzz APIs v2" },
      {
        name: "description",
        content: "Kelola API key Kyzz APIs v2 kamu: lihat key, pakai ulang, atau buat key baru.",
      },
      { property: "og:title", content: "Dashboard API Key — Kyzz APIs v2" },
      { property: "og:description", content: "Kelola API key Kyzz APIs v2 kamu." },
    ],
  }),
  component: DashboardPage,
});

type ApiKey = {
  id: string;
  key: string;
  label: string;
  is_active: boolean;
  request_count: number;
  created_at: string;
};

function DashboardPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [busy, setBusy] = useState(true);

  const load = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, key, label, is_active, request_count, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Gagal memuat API key.");
      setBusy(false);
      return;
    }

    if (!data || data.length === 0) {
      const { data: created, error: createError } = await supabase
        .from("api_keys")
        .insert({ user_id: userId })
        .select("id, key, label, is_active, request_count, created_at")
        .single();
      if (createError) {
        toast.error("Gagal membuat API key.");
      } else if (created) {
        setKeys([created as ApiKey]);
      }
    } else {
      setKeys(data as ApiKey[]);
    }
    setBusy(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      void navigate({ to: "/auth" });
      return;
    }
    void load(user.id);
  }, [user, loading, navigate, load]);

  async function createKey() {
    if (!user) return;
    const { data, error } = await supabase
      .from("api_keys")
      .insert({ user_id: user.id, label: "Key Baru" })
      .select("id, key, label, is_active, request_count, created_at")
      .single();
    if (error || !data) {
      toast.error("Gagal membuat key baru.");
      return;
    }
    setKeys((prev) => [data as ApiKey, ...prev]);
    toast.success("API key baru dibuat.");
  }

  async function toggleKey(item: ApiKey) {
    const { error } = await supabase
      .from("api_keys")
      .update({ is_active: !item.is_active })
      .eq("id", item.id);
    if (error) {
      toast.error("Gagal memperbarui key.");
      return;
    }
    setKeys((prev) =>
      prev.map((k) => (k.id === item.id ? { ...k, is_active: !k.is_active } : k)),
    );
  }

  async function copyKey(value: string) {
    await navigator.clipboard.writeText(value);
    toast.success("API key disalin.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    void navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 py-12">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="clay flex flex-wrap items-center justify-between gap-4 p-6">
            <div>
              <h1 className="text-2xl">Dashboard</h1>
              <p className="mt-1 text-sm text-muted-foreground">{user?.email ?? "…"}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={createKey} className="clay-sm clay-press bg-mint px-4 py-2 text-sm font-bold text-mint-foreground">
                Buat key baru
              </button>
              <button onClick={signOut} className="clay-sm clay-press px-4 py-2 text-sm font-bold">
                Keluar
              </button>
            </div>
          </div>

          {busy ? (
            <div className="clay p-6 text-sm text-muted-foreground">Memuat API key…</div>
          ) : (
            keys.map((item) => (
              <div key={item.id} className="clay p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">{item.label}</span>
                    <span
                      className={`clay-sm px-3 py-1 text-xs font-bold ${
                        item.is_active ? "bg-mint text-mint-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {item.request_count} request
                  </span>
                </div>

                <p className="clay-inset mt-4 overflow-x-auto p-4 font-mono text-sm">{item.key}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => copyKey(item.key)}
                    className="clay-sm clay-press bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
                  >
                    Salin key
                  </button>
                  <button
                    onClick={() => toggleKey(item)}
                    className="clay-sm clay-press px-4 py-2 text-sm font-bold"
                  >
                    {item.is_active ? "Nonaktifkan" : "Aktifkan"}
                  </button>
                  <Link to="/docs" className="clay-sm clay-press px-4 py-2 text-sm font-bold">
                    Coba di Docs
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
