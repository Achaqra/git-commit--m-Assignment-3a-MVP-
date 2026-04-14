"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Browse" },
  { href: "/orders", label: "Orders" },
  { href: "/checkout", label: "Checkout" },
  { href: "/profile", label: "Profile" },
];

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-900/10 bg-white/75 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-[1320px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link className="text-xl font-semibold uppercase tracking-[0.16em] text-zinc-900" href="/">
          Superior Fits
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                key={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? "bg-zinc-900 text-white" : "text-zinc-700 hover:bg-zinc-100"
                }`}
                href={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}