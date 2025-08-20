"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Role = 'worker' | 'employer';
interface RoleCtx {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleCtx | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>('employer');

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('rs-role') as Role | null : null;
    if (saved === 'worker' || saved === 'employer') setRoleState(saved);
  }, []);

  const setRole = (r: Role) => {
    setRoleState(r);
    try { window.localStorage.setItem('rs-role', r); } catch {}
  };

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used within RoleProvider');
  return ctx;
}
