"use client";
import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { getDictionary } from './dictionaries';
import type { SupportedLang } from './dictionaries';

interface I18nValue {
  lang: SupportedLang;
  t: (ns: 'common' | 'landing', key: string) => string;
  setLang: (l: SupportedLang) => void;
  ready: boolean;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ initialLang, children }: { initialLang: SupportedLang; children: ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>(initialLang);
  const [ready, setReady] = useState(false);

  // Simulate async load (could fetch remote bundles later)
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(id);
  }, []);

  const setLang = useCallback((l: SupportedLang) => {
    setLangState(l);
    try {
      localStorage.setItem('selectedLanguage', l);
      document.cookie = `lang=${l};path=/;max-age=31536000;samesite=lax`;
      document.documentElement.lang = l;
    } catch {}
  }, []);

  const t = useCallback((ns: 'common' | 'landing', key: string) => {
    const dict = getDictionary(lang);
    return (dict as any)[ns]?.[key] ?? key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, t, setLang, ready }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
