"use client";
import Link from "next/link";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { useState } from "react";
import { supabase } from "../../../supabase-client";
import { useEffect } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <header className="space-y-1 text-center">
        <h2 className="text-[28px] font-semibold tracking-tight">Welcome back</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">Log in to continue</p>
      </header>
      <Card variant="soft" className="p-8 space-y-6">
        {session ? (
          <div className="space-y-5">
            <div className="text-green-600 text-center">You are logged in as {session.user.email}</div>
            <Button className="w-full" onClick={handleLogout}>Log Out</Button>
          </div>
        ) : (
          <>
            <form className="space-y-5" onSubmit={async e => {
              e.preventDefault();
              setError("");
              if (!email || !password) {
                setError("Please enter both email and password.");
                return;
              }
              // Supabase authentication logic
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) {
                setError(error.message);
              } else {
                window.location.href = "/worker";
              }
            }}>
              <Input label="Email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} />
              <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} />
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Button type="submit" className="w-full" disabled={!email || !password}>Log In</Button>
            </form>
            <div className="text-center text-[12px] text-[var(--apple-text-secondary)]">
              New here?{" "}
              <Link href="/auth/signup" className="text-[var(--apple-accent)] hover:underline font-medium">Create account</Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
