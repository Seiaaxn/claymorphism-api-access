import { Link } from "@tanstack/react-router";

import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="px-4 pb-10">
      <div className="clay mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-extrabold">
              Kyzz<span className="text-primary"> APIs v2</span>
            </p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">{site.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/docs" className="clay-sm clay-press px-4 py-2 text-sm font-semibold">
              Docs
            </Link>
            <Link to="/dashboard" className="clay-sm clay-press px-4 py-2 text-sm font-semibold">
              Dashboard
            </Link>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="clay-sm clay-press px-4 py-2 text-sm font-semibold"
            >
              GitHub
            </a>
            <a
              href={site.support}
              target="_blank"
              rel="noreferrer"
              className="clay-sm clay-press px-4 py-2 text-sm font-semibold"
            >
              Support
            </a>
          </div>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {site.name} v{site.version} · dibuat oleh {site.creator}
        </p>
      </div>
    </footer>
  );
}
