"use client";
import Link from "next/link";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useState } from "react";
import { supabase } from "../../../supabase-client";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'worker'|'employer'|''>('');
  // Common fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [location, setLocation] = useState("");
  // Worker fields
  const [skills, setSkills] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState("");
  const [bio, setBio] = useState("");
  // Employer fields
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [preferredSkills, setPreferredSkills] = useState("");
  const [gst, setGst] = useState("");
  // UI
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <header className="space-y-1 text-center">
        <h2 className="text-[28px] font-semibold tracking-tight">{step===1 ? 'Create account' : 'Profile details'}</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">{step===1 ? 'Choose role & enter basics' : (role==='worker' ? 'Tell us about your skills' : 'Business / employer info')}</p>
      </header>
      <Card variant="soft" className="p-8 space-y-10">
        {step===1 && (
          <form className="space-y-8" onSubmit={e=>{
            e.preventDefault();
            if(!role) return;
            if(!fullName || !email || !password || !phoneNumber || !location) {
              setError("Please fill all required fields.");
              return;
            }
            setError("");
            setStep(2);
          }}>
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
                <Input label="Full name" placeholder="Enter your name" value={fullName} onChange={e=>setFullName(e.target.value)} />
                <Input label="Email" type="email" placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} />
                <Input label="Password" type="password" placeholder="Create password" value={password} onChange={e=>setPassword(e.target.value)} />
                <Input label="Mobile number" placeholder="10-digit number" inputMode="numeric" value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value.replace(/\D/g,''))} />
                <Input label="City / Area" placeholder="e.g., Andheri, Mumbai" value={location} onChange={e=>setLocation(e.target.value)} />
              </div>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full md:w-auto px-10" disabled={!role || !fullName || !email || !password || !phoneNumber || !location}>Continue</Button>
          </form>
        )}
        {step===2 && (
          <form className="space-y-10" onSubmit={async e=>{
            e.preventDefault();
            setError("");
            setIsLoading(true);
            // Sign up with Supabase Auth
            const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
            if(signUpError) {
              setError(signUpError.message);
              setIsLoading(false);
              return;
            }
            // Insert profile in users table
            let profile: any = {
              id: data.user?.id,
              email,
              full_name: fullName,
              role,
              phone_number: phoneNumber,
              location,
            };
            if(role==='worker') {
              profile.skills = skills;
              profile.experience_years = experienceYears ? parseInt(experienceYears) : null;
              profile.bio = bio;
            }
            // For employer, you can add companyName, preferredSkills, gst, address if needed
            const { error: profileError } = await supabase.from('users').upsert(profile);
            setIsLoading(false);
            if(profileError) {
              setError(profileError.message);
              return;
            }
            window.location.href = '/';
          }}>
            {role==='worker' && (
              <div className="space-y-6">
                <p className="text-[13px] font-medium text-[var(--apple-text-secondary)]">Worker Details</p>
                <div className="grid gap-6 md:grid-cols-2">
                  <Input label="Skills" placeholder="e.g., Electrician, Plumber" value={skills.join(", ")} onChange={e=>setSkills(e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} />
                  <Input label="Years experience" placeholder="e.g., 3" inputMode="numeric" value={experienceYears} onChange={e=>setExperienceYears(e.target.value.replace(/\D/g,''))} />
                  <Input label="Bio" placeholder="Tell us about yourself" value={bio} onChange={e=>setBio(e.target.value)} />
                </div>
              </div>
            )}
            {role==='employer' && (
              <div className="space-y-6">
                <p className="text-[13px] font-medium text-[var(--apple-text-secondary)]">Employer Details</p>
                <div className="grid gap-6 md:grid-cols-2">
                  <Input label="Company / Name" placeholder="Your or business name" value={companyName} onChange={e=>setCompanyName(e.target.value)} />
                  <Input label="Address" placeholder="Street, Area" value={address} onChange={e=>setAddress(e.target.value)} />
                  <Input label="Preferred skills" placeholder="e.g., Plumber, Cleaner" value={preferredSkills} onChange={e=>setPreferredSkills(e.target.value)} />
                  <Input label="GST / Tax ID" placeholder="(optional)" value={gst} onChange={e=>setGst(e.target.value)} />
                </div>
              </div>
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button type="button" variant="secondary" className="sm:w-auto w-full" onClick={()=>setStep(1)}>Back</Button>
              <Button type="submit" className="sm:flex-1 w-full" disabled={isLoading}>{isLoading ? "Processing..." : "Finish & Continue"}</Button>
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
