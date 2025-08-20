"use client";
import { useEffect, useState, forwardRef } from 'react';

type Variant = 'filled' | 'outlined' | 'text' | 'tonal';

interface MDButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

// Wrapper that swaps to real Material Web element after hydration
const MDButton = forwardRef<HTMLButtonElement, MDButtonProps>(function MDButton({ variant='filled', loading=false, children, ...rest }, ref) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setHydrated(true); }, []);

  const baseClass = 'inline-flex items-center justify-center min-w-[3rem] h-10 px-4 rounded-2xl text-sm font-medium transition-base relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--apple-accent)]/60 active:scale-[0.97]';
  const fallbackStyles: Record<Variant,string> = {
    filled: 'bg-[var(--apple-accent)] text-white shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
    outlined: 'border border-[var(--apple-border)] text-[var(--apple-text)] hover:bg-[var(--apple-bg-alt)] disabled:opacity-50 disabled:cursor-not-allowed',
    text: 'text-[var(--apple-accent)] hover:bg-[var(--apple-accent)]/10 disabled:opacity-50 disabled:cursor-not-allowed',
    tonal: 'bg-[var(--apple-accent)]/15 text-[var(--apple-accent)] hover:bg-[var(--apple-accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed'
  };

  // Fallback pre custom element definition
  if (!hydrated) {
    return (
      <button ref={ref} data-variant={variant} className={`${baseClass} ${fallbackStyles[variant]} ${rest.className ?? ''}`} {...rest}>
        {children}
      </button>
    );
  }

  // Keep using native button even after hydration for unified Apple style
  return (
    <button ref={ref} {...rest} data-variant={variant} disabled={rest.disabled || loading} className={`${baseClass} ${fallbackStyles[variant]} ${rest.className ?? ''}`}>
      {children}
      {loading && <span className="ml-1 inline-block w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />}
    </button>
  );
});

export default MDButton;
