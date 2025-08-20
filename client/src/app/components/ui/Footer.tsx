"use client";
import React from "react";
import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="app-footer">
      <div className="inner">
        <div className="brand">RozgaarSetu</div>
        <nav className="links" aria-label="Footer">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/privacy" className="hover:underline">Privacy</Link>
          <Link href="/terms" className="hover:underline">Terms</Link>
        </nav>
        <div className="copy text-xs text-[var(--apple-text-tertiary)]">© {year} RozgaarSetu</div>
      </div>
    </footer>
  );
}
export default Footer;
