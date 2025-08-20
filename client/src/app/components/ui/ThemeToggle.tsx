"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle({ className="" }: { className?: string }) {
  const [mode, setMode] = useState<'light'|'dark'>(() => (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') ? 'dark' : 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') root.setAttribute('data-theme','dark'); else root.removeAttribute('data-theme');
    if (typeof window !== 'undefined') localStorage.setItem('theme', mode);
  }, [mode]);

  return (
    <button
      onClick={() => setMode(m => m === 'light' ? 'dark' : 'light')}
      aria-label="Toggle dark mode"
      className={`md-state flex items-center gap-2 px-3 h-10 rounded-3xl text-sm font-medium border border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-on-surface)] ${className}`}
    >
      <span className="relative w-5 h-5 inline-flex items-center justify-center">
        {mode === 'light' ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
          </svg>
        )}
      </span>
      <span className="hidden sm:inline">{mode === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  );
}
