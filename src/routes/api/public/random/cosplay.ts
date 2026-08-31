import { createFileRoute } from "@tanstack/react-router";

import { apiError, requireApiKey } from "@/lib/api-key.server";

const LIST_URL = "https://pastebin.com/raw/TsJiH5d8";
let cache: string[] = [];
let lastFetch = 0;
const TTL = 10 * 60 * 1000;

async function getImages(): Promise<string[]> {
  const now = Date.now();
  if (cache.length > 0 && now - lastFetch < TTL) return cache;

  const res = await fetch(LIST_URL);
  if (!res.ok) throw new Error("list unavailable");
  const data = (await res.json()) as unknown;
  if (Array.isArray(data) && data.length > 0) {
    cache = data as string[];
    lastFetch = now;
  }
  return cache;
}

export const Route = createFileRoute("/api/public/random/cosplay")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await requireApiKey(request);
        if (denied) return denied;

        try {
          const images = await getImages();
          if (images.length === 0) {
            return apiError(502, "Bad Gateway", "Daftar gambar tidak tersedia.");
          }

          const target = images[Math.floor(Math.random() * images.length)]!;
          const imgRes = await fetch(target, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
            },
          });
          if (!imgRes.ok) {
            return apiError(502, "Bad Gateway", "Gagal mengambil gambar target.");
          }

          return new Response(await imgRes.arrayBuffer(), {
            headers: {
              "content-type": imgRes.headers.get("content-type") ?? "image/jpeg",
              "cache-control": "no-store",
            },
          });
        } catch {
          return apiError(500, "Internal Server Error", "Terjadi kesalahan saat mengambil gambar.");
        }
      },
    },
  },
});
