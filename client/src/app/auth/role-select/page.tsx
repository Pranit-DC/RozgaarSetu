import Link from "next/link";
import { Card } from "../../components/ui/Card";

export default function RoleSelect() {
  const roles = [
    { icon: '🧰', title: 'I’m a Worker', desc: 'Find nearby jobs', href: '/auth/signup?role=worker' },
    { icon: '🏠', title: 'I’m a Customer', desc: 'Hire trusted workers', href: '/auth/signup?role=customer' }
  ];
  return (
    <div className="space-y-10 max-w-xl mx-auto">
      <header className="space-y-1 text-center">
        <h2 className="text-[28px] font-semibold tracking-tight">Choose role</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">Tell us how you’ll use RozgaarSetu</p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2">
        {roles.map(r => (
          <Link key={r.title} href={r.href} className="group">
            <Card variant="soft" className="p-6 text-center hover:bg-white/60 transition-base">
              <p className="text-3xl mb-2 drop-shadow-sm group-hover:scale-110 transition-transform">{r.icon}</p>
              <p className="text-[15px] font-semibold text-[var(--apple-text)]">{r.title}</p>
              <p className="mt-1 text-[12px] text-[var(--apple-text-secondary)]">{r.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
