"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Select" },
  { href: "/study", label: "Study" },
  { href: "/chart", label: "Chart" },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
        <span className="grid place-items-center size-8 rounded-md bg-accent text-white text-lg leading-none">
          ᐃ
        </span>
        <span>Real Syllabics</span>
      </Link>
      <nav className="flex gap-1 text-sm">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              pathname === l.href ? "bg-foreground text-background" : "text-muted hover:text-foreground"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
