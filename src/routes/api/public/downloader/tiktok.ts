import { createFileRoute } from "@tanstack/react-router";

import { apiError, apiJson, requireApiKey } from "@/lib/api-key.server";

export const Route = createFileRoute("/api/public/downloader/tiktok")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const denied = await requireApiKey(request);
        if (denied) return denied;

        const videoUrl = new URL(request.url).searchParams.get("url");
        if (!videoUrl) {
          return apiError(400, "Bad Request", 'Parameter "url" wajib diisi.');
        }

        try {
          const res = await fetch(
            `https://tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`,
            {
              headers: {
                "User-Agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              },
            },
          );
          if (!res.ok) {
            return apiError(502, "Bad Gateway", `TikWM API error: ${res.statusText}`);
          }

          const payload = (await res.json()) as { code: number; msg?: string; data?: Record<string, any> };
          if (payload.code !== 0 || !payload.data) {
            return apiError(502, "Bad Gateway", payload.msg ?? "Gagal mengambil data video TikTok.");
          }

          const info = payload.data;
          return apiJson({
            status: true,
            title: info["title"] ?? "",
            duration: info["duration"] ?? 0,
            author: {
              nickname: info["author"]?.nickname ?? "",
              unique_id: info["author"]?.unique_id ?? "",
              avatar: info["author"]?.avatar ?? "",
            },
            video: {
              noWatermark: info["play"] ?? "",
              watermark: info["wmplay"] ?? "",
              cover: info["cover"] ?? "",
            },
            music: {
              title: info["music_info"]?.title ?? "",
              author: info["music_info"]?.author ?? "",
              playUrl: info["music"] ?? "",
            },
            stats: {
              views: info["play_count"] ?? 0,
              likes: info["digg_count"] ?? 0,
              comments: info["comment_count"] ?? 0,
              shares: info["share_count"] ?? 0,
            },
          });
        } catch {
          return apiError(500, "Internal Server Error", "Terjadi kesalahan saat memproses permintaan.");
        }
      },
    },
  },
});
