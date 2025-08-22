"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/worker", label: "Dashboard" },
  { href: "/worker/jobs", label: "Jobs" },
  { href: "/worker/earnings", label: "Earnings" },
  { href: "/worker/profile", label: "Profile" },
];

export default function WorkerLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
  <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-2">
      {children}
      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--apple-border)] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-stretch">
          {tabs.map((t) => {
            const active = path === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex-1 py-3 text-center text-[12px] font-medium tracking-wide transition-colors ${active ? "text-[var(--apple-text)]" : "text-[var(--apple-text-secondary)]"}`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
