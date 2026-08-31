import { createFileRoute, Link } from "@tanstack/react-router";

import { Footer } from "@/components/site/Footer";
import { Navbar } from "@/components/site/Navbar";
import { useReveal } from "@/components/site/Reveal";
import { endpoints, site } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kyzz APIs v2 — REST API sederhana dengan API key" },
      {
        name: "description",
        content:
          "Kyzz APIs v2: REST API downloader & random yang cepat dan mudah. Daftar gratis, dapatkan API key, langsung integrasikan.",
      },
      { property: "og:title", content: "Kyzz APIs v2 — REST API sederhana dengan API key" },
      {
        property: "og:description",
        content: "Daftar gratis, dapatkan API key, dan pakai endpoint Kyzz APIs v2 dalam hitungan detik.",
      },
    ],
  }),
  component: LandingPage,
});

const features = [
  {
    title: "API Key Instan",
    desc: "Daftar atau masuk, key langsung dibuat otomatis di dashboard kamu.",
    tone: "bg-primary/25",
    emoji: "🔑",
  },
  {
    title: "Respons Cepat",
    desc: "Endpoint ringan berjalan di edge runtime, latency rendah di mana saja.",
    tone: "bg-mint/60",
    emoji: "⚡",
  },
  {
    title: "JSON Konsisten",
    desc: "Struktur respons rapi dan dapat diprediksi, gampang di-parse.",
    tone: "bg-accent/60",
    emoji: "🧩",
  },
  {
    title: "Monitoring Pemakaian",
    desc: "Lihat jumlah request key kamu dan nonaktifkan kapan saja.",
    tone: "bg-sun/60",
    emoji: "📊",
  },
];

const faqs = [
  {
    q: "Bagaimana cara mendapatkan API key?",
    a: "Daftar atau masuk lewat halaman Masuk / Daftar. Setelah berhasil, buka Dashboard dan API key kamu dibuat otomatis.",
  },
  {
    q: "Apakah gratis?",
    a: "Ya, semua endpoint publik bisa dipakai gratis selama key kamu aktif. Mohon jangan spam request.",
  },
  {
    q: "Bagaimana cara mengirim API key?",
    a: "Tambahkan query ?apikey=KEY_KAMU pada URL, atau kirim lewat header x-api-key.",
  },
  {
    q: "Bisakah key saya diganti?",
    a: "Bisa. Di Dashboard kamu bisa membuat key baru kapan pun dan menonaktifkan key lama.",
  },
];

function LandingPage() {
  useReveal();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden px-4 pt-16 pb-20">
          <div
            aria-hidden
            className="clay clay-blob clay-float absolute -left-16 top-24 h-40 w-40 bg-mint/70 md:h-56 md:w-56"
          />
          <div
            aria-hidden
            className="clay clay-blob clay-float absolute -right-10 top-44 h-32 w-32 bg-accent/70 md:h-48 md:w-48"
            style={{ animationDelay: "1.4s" }}
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="clay-sm reveal inline-flex items-center gap-2 px-4 py-2 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-primary" />
              v{site.version} · API key wajib untuk semua endpoint
            </span>

            <h1 className="reveal mt-6 text-4xl leading-tight md:text-6xl">
              Bangun lebih cepat dengan <span className="text-primary">API yang empuk</span> dipakai
            </h1>

            <p className="reveal mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              {site.description}
            </p>

            <div className="reveal mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/auth"
                className="clay clay-press bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
              >
                Dapatkan API Key
              </Link>
              <Link to="/docs" className="clay clay-press px-6 py-3 text-sm font-bold">
                Lihat Endpoint
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-4 py-10">
          <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="clay reveal clay-press p-6">
                <div
                  className={`clay-sm flex h-12 w-12 items-center justify-center text-xl ${f.tone}`}
                >
                  <span aria-hidden>{f.emoji}</span>
                </div>
                <h3 className="mt-4 text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Code preview */}
        <section className="px-4 py-10">
          <div className="clay reveal mx-auto max-w-4xl p-6 md:p-8">
            <h2 className="text-2xl">Integrasi dalam 3 baris</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Kirim API key lewat query <code className="font-mono">apikey</code> atau header{" "}
              <code className="font-mono">x-api-key</code>.
            </p>
            <pre className="clay-inset mt-5 overflow-x-auto p-5 font-mono text-xs leading-relaxed md:text-sm">
              {`const res = await fetch(
  "/api/public/downloader/tiktok?url=<VIDEO_URL>&apikey=<API_KEY>"
);
const data = await res.json();`}
            </pre>
          </div>
        </section>

        {/* Endpoints */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-6xl">
            <h2 className="reveal text-2xl">Endpoint tersedia</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {endpoints.map((e) => (
                <div key={e.id} className="clay reveal p-6">
                  <div className="flex items-center gap-2">
                    <span className="clay-sm bg-mint/70 px-3 py-1 font-mono text-xs font-bold">
                      {e.method}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">{e.category}</span>
                  </div>
                  <h3 className="mt-3 text-lg">{e.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
                  <p className="clay-inset mt-4 overflow-x-auto p-3 font-mono text-xs">{e.path}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-10">
          <div className="mx-auto max-w-3xl">
            <h2 className="reveal text-2xl">Pertanyaan umum</h2>
            <div className="mt-5 space-y-4">
              {faqs.map((f) => (
                <details key={f.q} className="clay reveal group p-5">
                  <summary className="cursor-pointer list-none text-base font-bold">{f.q}</summary>
                  <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
