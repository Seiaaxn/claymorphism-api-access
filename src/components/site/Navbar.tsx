import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { site } from "@/lib/site";
import { useAuth } from "@/hooks/useAuth";

const links = [
  { to: "/", label: "Home" },
  { to: "/docs", label: "Docs" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="clay mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3 backdrop-blur">
        <Link to="/" className="text-lg font-extrabold tracking-tight" onClick={() => setOpen(false)}>
          Kyzz<span className="text-primary"> APIs v2</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="clay-press rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={site.github}
            target="_blank"
            rel="noreferrer"
            className="clay-press rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            GitHub
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to={user ? "/dashboard" : "/auth"}
            className="clay-sm clay-press hidden bg-primary px-4 py-2 text-sm font-bold text-primary-foreground sm:inline-flex"
          >
            {user ? "API Key" : "Masuk / Daftar"}
          </Link>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="clay-sm clay-press px-3 py-2 md:hidden"
          >
            <span className="block h-0.5 w-5 bg-foreground" />
            <span className="mt-1 block h-0.5 w-5 bg-foreground" />
            <span className="mt-1 block h-0.5 w-5 bg-foreground" />
          </button>
        </div>
      </div>

      {open ? (
        <div className="clay mx-auto mt-3 max-w-6xl p-3 md:hidden">
          <ul className="flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="clay-inset block px-4 py-3 text-sm font-semibold"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to={user ? "/dashboard" : "/auth"}
                onClick={() => setOpen(false)}
                className="clay-sm block bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground"
              >
                {user ? "Lihat API Key" : "Masuk / Daftar"}
              </Link>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
