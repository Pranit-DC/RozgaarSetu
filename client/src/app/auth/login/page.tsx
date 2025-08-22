"use client";
import Link from "next/link";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useState } from "react";

export default function Login() {
  const [sent, setSent] = useState(false);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["","","",""]);

  return (
    <div className="max-w-md mx-auto space-y-8">
      <header className="space-y-1 text-center">
        <h2 className="text-[28px] font-semibold tracking-tight">{sent ? 'Enter OTP' : 'Welcome back'}</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">{sent ? `Code sent to +91 ${mobile}` : 'Sign in to continue'}</p>
      </header>
      <Card variant="soft" className="p-8 space-y-6">
        {!sent && (
          <form className="space-y-5" onSubmit={e=>{e.preventDefault(); if(mobile.length===10) setSent(true);}}>
            <Input label="Mobile number" placeholder="10-digit number" inputMode="numeric" maxLength={10} value={mobile} onChange={e=>setMobile(e.target.value.replace(/\D/g,''))} />
            <Button type="submit" className="w-full" disabled={mobile.length!==10}>Send OTP</Button>
          </form>
        )}
        {sent && (
          <form className="space-y-6" onSubmit={e=>{e.preventDefault(); /* navigate after mock login */ window.location.href='/worker';}}>
            <div className="space-y-3">
              <label className="text-[13px] font-medium text-[var(--apple-text-secondary)]">One-Time Password</label>
              <div className="flex gap-3 justify-center">
                {otp.map((d,i)=>(
                  <input key={i} inputMode="numeric" maxLength={1} value={d} onChange={e=>{
                      const val=e.target.value.replace(/\D/g,'').slice(-1);
                      const next=[...otp]; next[i]=val; setOtp(next);
                      if(val && i<otp.length-1) {
                        (e.target.parentElement?.querySelectorAll('input')[i+1] as HTMLInputElement)?.focus();
                      }
                    }}
                    className="w-12 h-14 text-center text-[18px] font-semibold rounded-2xl bg-[var(--apple-bg-alt)]/60 border border-[var(--apple-border)] focus:border-[var(--apple-accent)] focus:ring-2 focus:ring-[var(--apple-accent)]/30 outline-none" />
                ))}
              </div>
              <div className="text-[11px] text-center text-[var(--apple-text-secondary)]">Resend code in 28s</div>
            </div>
            <Button type="submit" className="w-full" disabled={otp.some(o=>!o)}>Verify & Continue</Button>
            <button type="button" onClick={()=>{setSent(false); setOtp(["","","",""]);}} className="text-[11px] text-[var(--apple-text-secondary)] mx-auto block hover:text-[var(--apple-text)]">Change mobile number</button>
          </form>
        )}
        {!sent && (
          <div className="text-center text-[12px] text-[var(--apple-text-secondary)]">
            New here?{" "}
            <Link href="/auth/signup" className="text-[var(--apple-accent)] hover:underline font-medium">Create account</Link>
          </div>
        )}
      </Card>
    </div>
  );
}
