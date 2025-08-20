import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: 'solid' | 'soft' | 'glass' | 'outline';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  onClick?: () => void;
  role?: string;
  tabIndex?: number;
};

const paddingMap = { sm: 'p-3', md: 'p-5', lg: 'p-7', none: 'p-0' };

export function Card({ children, className = '', variant = 'solid', padding = 'md', onClick, role, tabIndex }: CardProps) {
  const base = [
    'rounded-3xl relative overflow-hidden backdrop-saturate-150',
    'transition-base'
  ].join(' ');
  const variants: Record<string,string> = {
    solid: 'bg-white border border-[var(--apple-border)] shadow-sm hover:shadow-md',
    soft: 'bg-[var(--apple-bg-alt)]/70 border border-[var(--apple-border)] hover:border-[var(--apple-border-strong)]',
    glass: 'glass border-[var(--apple-border)] hover:border-[var(--apple-border-strong)]',
    outline: 'bg-transparent border border-[var(--apple-border)]'
  };
  return <div onClick={onClick} role={role} tabIndex={tabIndex} className={[base, variants[variant], paddingMap[padding], onClick ? 'cursor-pointer select-none' : '', className].join(' ')}>{children}</div>;
}

export function CardHeader({ title, subtitle, icon }: { title: string; subtitle?: string; icon?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-3">
      {icon && <div className="w-10 h-10 rounded-2xl bg-[var(--apple-bg-alt)] flex items-center justify-center text-[var(--apple-text-secondary)] shadow-inner border border-[var(--apple-border)]">{icon}</div>}
      <div>
        <h3 className="text-[15px] font-semibold tracking-tight text-[var(--apple-text)]">{title}</h3>
        {subtitle && <p className="mt-0.5 text-[12px] text-[var(--apple-text-secondary)] leading-snug">{subtitle}</p>}
      </div>
    </div>
  );
}

export function CardSection({ children }: { children: ReactNode }) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
