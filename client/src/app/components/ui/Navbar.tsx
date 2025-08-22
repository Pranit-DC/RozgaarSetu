"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "../../context/RoleContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false); // subtle elevation on scroll
  const { role, setRole } = useRole();
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Removed theme toggle (pre-optional baseline)

  // Single segmented control drives both role context + navigation
  // segmented indicator refs
  const segmentedRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

  const [indicatorReady, setIndicatorReady] = useState(false);

  const syncIndicator = () => {
    if (!segmentedRef.current || !indicatorRef.current) return;
    const active = segmentedRef.current.querySelector<HTMLButtonElement>('button[data-active="true"]');
    if (!active) return;
    const btnRect = active.getBoundingClientRect();
    const parentRect = segmentedRef.current.getBoundingClientRect();
    indicatorRef.current.style.width = btnRect.width + 'px';
    indicatorRef.current.style.transform = `translateX(${btnRect.left - parentRect.left}px)`;
    if (!indicatorReady) setIndicatorReady(true);
  };

  useLayoutEffect(() => {
    syncIndicator();
    window.addEventListener('resize', syncIndicator);
    return () => window.removeEventListener('resize', syncIndicator);
  }, [role, indicatorReady]);

  const handleSegment = (nextRole: 'employer' | 'worker') => {
    setRole(nextRole);
    router.push(nextRole === 'employer' ? '/customer' : '/worker');
    setOpen(false);
    requestAnimationFrame(syncIndicator);
  };

  return (
  <header className="fixed top-4 inset-x-0 z-50 pointer-events-none">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
  <div className={`pointer-events-auto transition-all duration-600 rounded-full flex items-center gap-6 px-6 h-14 shadow-sm border ${scrolled ? 'glass border-[var(--apple-border-strong)] shadow-md' : 'bg-[var(--apple-bg-elevated)]/70 border-[var(--apple-border)]'} backdrop-blur-xl`}>
        {/* Logo / Brand */}
  <Link href="/" className="flex items-center gap-2 group rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--apple-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--apple-bg-elevated)]">
          <div className="w-8 h-8 rounded-xl bg-[var(--apple-bg-alt)] flex items-center justify-center shadow-sm border border-[var(--apple-border)] transition-all group-hover:shadow-md">
            <svg className="w-5 h-5 text-[var(--apple-text)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 10.5A6.5 6.5 0 0116.9 8.4a4.5 4.5 0 113.6 6.1H19" />
              <path d="M2.5 19H13a3.5 3.5 0 10-7 0" />
            </svg>
          </div>
          <span className="hidden sm:inline text-[15px] font-semibold tracking-tight select-none text-[var(--apple-text)]">RozgaarSetu</span>
        </Link>

        {/* Unified segmented control (desktop) */}
        <div className="hidden md:flex items-center gap-4 ml-auto select-none">
          <div className="segmented" aria-label="Select experience" ref={segmentedRef}>
            <button type="button" data-active={role==='employer'} aria-pressed={role==='employer'} onClick={()=>handleSegment('employer')}>Employer</button>
            <button type="button" data-active={role==='worker'} aria-pressed={role==='worker'} onClick={()=>handleSegment('worker')}>Worker</button>
            <span className="segmented-indicator" data-ready={indicatorReady} ref={indicatorRef} aria-hidden />
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/auth/login" className="nav-link">Login</Link>
            <Link href="/auth/signup" className="apple-btn">Get Started</Link>
          </div>
        </div>

        {/* Mobile */}
        <div className="ml-auto md:hidden flex items-center gap-2">
          <button aria-label="Menu" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen(o=>!o)} className="relative w-10 h-10 rounded-xl border border-[var(--apple-border)] flex items-center justify-center glass transition-all overflow-hidden" id="nav-menu-button">
            <div className="w-5 h-5 relative">
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-5 origin-center bg-[var(--apple-text)] transition-transform duration-500 ${open ? 'rotate-45' : '-translate-y-1.5'}`}></span>
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-5 bg-[var(--apple-text)] transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-5 origin-center bg-[var(--apple-text)] transition-transform duration-500 ${open ? '-rotate-45' : 'translate-y-1.5'}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile panel overlay */}
        {open && <div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm md:hidden" onClick={()=>setOpen(false)} />}
        <div className={`md:hidden absolute top-full right-4 mt-3 w-64 origin-top-right transition-all duration-500 ${open ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`} role="dialog" aria-modal="true" aria-labelledby="nav-menu-button">
          <div className="glass rounded-2xl p-4 flex flex-col gap-4 border border-[var(--apple-border)] shadow-lg select-none">
            <div className="space-y-2">
              <p className="text-[11px] font-medium text-[var(--apple-text-secondary)]">Choose experience</p>
              <div className="segmented w-full" aria-label="Select experience (mobile)" ref={segmentedRef}>
                <button type="button" data-active={role==='employer'} aria-pressed={role==='employer'} onClick={()=>handleSegment('employer')}>Employer</button>
                <button type="button" data-active={role==='worker'} aria-pressed={role==='worker'} onClick={()=>handleSegment('worker')}>Worker</button>
                <span className="segmented-indicator" ref={indicatorRef} aria-hidden />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link href="/auth/login" onClick={()=>setOpen(false)} className="nav-link justify-center">Login</Link>
              <Link href="/auth/signup" onClick={()=>setOpen(false)} className="apple-btn justify-center">Get Started</Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </header>
  );
}
