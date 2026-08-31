export const site = {
  name: "Kyzz APIs v2",
  version: "2.0.0",
  creator: "Mommy Kyuu",
  description:
    "REST API sederhana, cepat, dan developer-first. Daftar, ambil API key, langsung pakai.",
  github: "https://github.com/RynnStecu/kyzz-apisv2",
  support: "https://whatsapp.com/channel/0029Vb7gcbuLdQelWzrTzD3D",
  telegram: "https://t.me/kyunotdev",
};

export type Endpoint = {
  id: string;
  name: string;
  category: string;
  method: "GET";
  path: string;
  description: string;
  params: { name: string; example: string; required: boolean; description: string }[];
  responseType: "json" | "image";
};

export const endpoints: Endpoint[] = [
  {
    id: "tiktok",
    name: "TikTok Downloader",
    category: "Downloader",
    method: "GET",
    path: "/api/public/downloader/tiktok",
    description: "Ambil metadata & link download video TikTok tanpa watermark.",
    params: [
      {
        name: "url",
        example: "https://vt.tiktok.com/ZSVDcGXTk/",
        required: true,
        description: "URL video TikTok",
      },
      { name: "apikey", example: "", required: true, description: "API key kamu" },
    ],
    responseType: "json",
  },
  {
    id: "cosplay",
    name: "Random Cosplay",
    category: "Random",
    method: "GET",
    path: "/api/public/random/cosplay",
    description: "Mengembalikan satu gambar cosplay acak sebagai stream gambar.",
    params: [{ name: "apikey", example: "", required: true, description: "API key kamu" }],
    responseType: "image",
  },
];
