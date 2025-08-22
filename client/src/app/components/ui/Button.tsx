// Simple, accessible button with two variants
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  onClick,
  disabled = false,
  leadingIcon,
  trailingIcon
}: Props) {
  // Apple-inspired tactile button styling
  const base = [
    "inline-flex items-center justify-center gap-2 select-none",
    "h-11 px-5 rounded-2xl text-[13px] font-medium tracking-wide",
    "transition-base relative",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--apple-accent)] focus-visible:ring-offset-2",
    "disabled:opacity-40 disabled:cursor-not-allowed active:translate-y-px"
  ].join(' ');

  const variants: Record<string,string> = {
    primary: [
      "bg-[var(--apple-accent)] text-white shadow-sm",
      "hover:bg-[var(--apple-accent-hover)]",
      "shadow-[0_4px_10px_-2px_rgba(0,113,227,0.45)] hover:shadow-[0_6px_14px_-3px_rgba(0,113,227,0.5)]"
    ].join(' '),
    secondary: [
      "bg-[var(--apple-bg-alt)]/80 text-[var(--apple-text)]",
      "border border-[var(--apple-border)]",
      "hover:bg-white/80 hover:border-[var(--apple-border-strong)]",
      "shadow-[0_0_0_0.5px_var(--apple-border)] hover:shadow-[0_2px_6px_-1px_rgba(0,0,0,0.08)]"
    ].join(' '),
    ghost: [
      "bg-transparent text-[var(--apple-text-secondary)]",
      "hover:text-[var(--apple-text)] hover:bg-[var(--apple-bg-alt)]/70",
      "active:bg-[var(--apple-bg-alt)]/90"
    ].join(' ')
  };

  return (
    <button
      type={type}
      className={[base, variants[variant], className].join(' ')}
      onClick={onClick}
      disabled={disabled}
    >
      {leadingIcon && <span className="inline-flex -ml-1">{leadingIcon}</span>}
      <span>{children}</span>
      {trailingIcon && <span className="inline-flex -mr-1">{trailingIcon}</span>}
    </button>
  );
}
