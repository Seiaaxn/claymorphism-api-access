import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk atau Daftar — Kyzz APIs v2" },
      {
        name: "description",
        content: "Buat akun Kyzz APIs v2 untuk mendapatkan API key dan mulai memakai endpoint.",
      },
      { property: "og:title", content: "Masuk atau Daftar — Kyzz APIs v2" },
      {
        property: "og:description",
        content: "Buat akun untuk mendapatkan API key Kyzz APIs v2.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) void navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { display_name: name },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Akun dibuat. Cek email kamu untuk konfirmasi, lalu masuk.");
          setMode("login");
        } else {
          toast.success("Berhasil daftar! API key kamu sudah siap.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Selamat datang kembali!");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="px-4 py-14">
        <div className="clay mx-auto max-w-md p-7">
          <div className="clay-inset flex gap-1 p-1">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg px-4 py-2 text-sm font-bold transition ${
                  mode === m ? "clay-sm bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {m === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <h1 className="mt-6 text-2xl">
            {mode === "login" ? "Masuk ke akunmu" : "Buat akun baru"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            API key otomatis dibuat setelah kamu masuk.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "register" ? (
              <label className="block">
                <span className="text-sm font-semibold">Nama</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="clay-inset mt-1.5 w-full px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
                />
              </label>
            ) : null}

            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                className="clay-inset mt-1.5 w-full px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold">Password</span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="clay-inset mt-1.5 w-full px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>

            <button
              type="submit"
              disabled={busy}
              className="clay clay-press w-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground disabled:opacity-60"
            >
              {busy ? "Memproses…" : mode === "login" ? "Masuk" : "Daftar & ambil API key"}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Sudah punya key?{" "}
            <Link to="/dashboard" className="font-bold text-primary">
              Buka dashboard
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
