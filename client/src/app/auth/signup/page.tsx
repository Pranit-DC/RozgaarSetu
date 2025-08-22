"use client";
import Link from "next/link";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useState } from "react";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'worker'|'employer'|''>('');
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header className="space-y-1 text-center">
        <h2 className="text-[28px] font-semibold tracking-tight">{step===1 ? 'Create account' : 'Profile details'}</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">{step===1 ? 'Choose role & enter basics' : (role==='worker' ? 'Tell us about your skills' : 'Business / employer info')}</p>
      </header>
      <Card variant="soft" className="p-8 space-y-10">
        {step===1 && (
          <form className="space-y-8" onSubmit={e=>{e.preventDefault(); if(role) setStep(2);}}>
            <div className="space-y-5">
              <div className="space-y-3">
                <p className="text-[13px] font-medium text-[var(--apple-text-secondary)]">Select Role</p>
                <div className="flex gap-4 flex-wrap">
                  {['worker','employer'].map(r => (
                    <button key={r} type="button" onClick={()=>setRole(r as any)} className={`flex-1 min-w-[140px] rounded-2xl border px-5 py-4 text-left transition-base ${role===r ? 'border-[var(--apple-accent)] bg-[var(--apple-accent)]/10' : 'border-[var(--apple-border)] hover:border-[var(--apple-border-strong)] bg-[var(--apple-bg-alt)]/60'}`}> 
                      <span className="block text-[14px] font-semibold capitalize">{r}</span>
                      <span className="block text-[11px] mt-1 text-[var(--apple-text-secondary)]">{r==='worker' ? 'Offer services' : 'Hire workers'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <Input label="Full name" placeholder="Enter your name" />
                <Input label="Mobile number" placeholder="10-digit number" inputMode="numeric" />
                <Input label="City / Area" placeholder="e.g., Andheri, Mumbai" />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto px-10" disabled={!role}>Continue</Button>
          </form>
        )}
        {step===2 && (
          <form className="space-y-10" onSubmit={e=>{e.preventDefault(); window.location.href='/'}}>
            {role==='worker' && (
              <div className="space-y-6">
                <p className="text-[13px] font-medium text-[var(--apple-text-secondary)]">Worker Details</p>
                <div className="grid gap-6 md:grid-cols-2">
                  <Input label="Primary skill" placeholder="e.g., Electrician" />
                  <Input label="Years experience" placeholder="e.g., 3" inputMode="numeric" />
                  <Input label="Base price (₹)" placeholder="e.g., 199" inputMode="numeric" />
                  <Input label="Languages" placeholder="e.g., Hindi, English" />
                  <Input label="ID Document" placeholder="Upload (UI only)" />
                  <Input label="Address" placeholder="Street, Area" />
                </div>
              </div>
            )}
            {role==='employer' && (
              <div className="space-y-6">
                <p className="text-[13px] font-medium text-[var(--apple-text-secondary)]">Employer Details</p>
                <div className="grid gap-6 md:grid-cols-2">
                  <Input label="Company / Name" placeholder="Your or business name" />
                  <Input label="Address" placeholder="Street, Area" />
                  <Input label="Preferred skills" placeholder="e.g., Plumber, Cleaner" />
                  <Input label="GST / Tax ID" placeholder="(optional)" />
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="button" variant="secondary" className="sm:w-auto w-full" onClick={()=>setStep(1)}>Back</Button>
              <Button type="submit" className="sm:flex-1 w-full">Finish & Continue</Button>
            </div>
          </form>
        )}
        <p className="text-center text-[12px] text-[var(--apple-text-secondary)]">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-[var(--apple-accent)] hover:underline font-medium">Login</Link>
        </p>
      </Card>
    </div>
  );
}
