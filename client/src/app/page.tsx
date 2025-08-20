"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import MDButton from "./components/ui/MDButton";
import { useI18n } from "./i18n/I18nContext";

export default function Home() {
  const { lang: currentLang, setLang, t } = useI18n();
  const [selectedLanguage, setSelectedLanguage] = useState<string>(currentLang);
  const router = useRouter();
  const segRef = useRef<HTMLDivElement | null>(null);

  const languages = [
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
    { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  ];

  useEffect(() => { setSelectedLanguage(currentLang); }, [currentLang]);

  const handleContinue = useCallback(() => {
    if (!selectedLanguage) return;
    setLang(selectedLanguage as any);
    router.push('/auth/login');
  }, [router, selectedLanguage, setLang]);

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    e.preventDefault();
    const idx = languages.findIndex(l => l.code === selectedLanguage);
    let nextIdx = idx;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') nextIdx = (idx + 1) % languages.length;
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') nextIdx = (idx - 1 + languages.length) % languages.length;
    if (e.key === 'Home') nextIdx = 0;
    if (e.key === 'End') nextIdx = languages.length -1;
    const next = languages[nextIdx];
    setSelectedLanguage(next.code);
    setLang(next.code as any);
  };

  // Animate segmented indicator
  useEffect(() => {
    const indicator = segRef.current?.querySelector<HTMLElement>('.segmented-indicator');
    const activeBtn = segRef.current?.querySelector<HTMLButtonElement>('button[data-active="true"]');
    if (indicator && activeBtn && segRef.current) {
      const rect = activeBtn.getBoundingClientRect();
      const parent = segRef.current.getBoundingClientRect();
      indicator.style.width = rect.width + 'px';
      indicator.style.transform = `translateX(${rect.left - parent.left}px)`;
    }
  }, [selectedLanguage]);

  // Parallax removed (pre-optional baseline)

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pt-10 pb-24 flex items-center overflow-hidden">
      <div aria-hidden className="absolute inset-0 apple-hero-bg" />
      <div aria-hidden className="absolute inset-0" style={{maskImage:'radial-gradient(circle at 50% 30%, #000 55%, transparent 80%)'}} />
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 grid gap-16 lg:grid-cols-2 items-center">
        <div className="space-y-8">
          <div className="eyebrow tracking-[0.3em]">{t('common','earlyAccess')}</div>
          <h1 className="display-hero max-w-xl">{t('landing','heroLine')}</h1>
          <p className="text-base md:text-lg max-w-md text-[var(--apple-text-secondary)] leading-relaxed">{t('landing','heroLead')}</p>
          <div className="flex flex-wrap gap-4 text-[13px] text-[var(--apple-text-secondary)]">
            <div className="px-4 h-10 rounded-full border-subtle flex items-center gap-2 hover-scale"><span className="w-5 h-5 rounded-full bg-[var(--apple-accent)]/15 flex items-center justify-center text-[10px] text-[var(--apple-accent)]">1</span>{t('landing','feat1')}</div>
            <div className="px-4 h-10 rounded-full border-subtle flex items-center gap-2 hover-scale"><span className="w-5 h-5 rounded-full bg-[var(--apple-accent)]/15 flex items-center justify-center text-[10px] text-[var(--apple-accent)]">2</span>{t('landing','feat2')}</div>
            <div className="px-4 h-10 rounded-full border-subtle flex items-center gap-2 hover-scale"><span className="w-5 h-5 rounded-full bg-[var(--apple-accent)]/15 flex items-center justify-center text-[10px] text-[var(--apple-accent)]">3</span>{t('landing','feat3')}</div>
            <div className="px-4 h-10 rounded-full border-subtle flex items-center gap-2 hover-scale"><span className="w-5 h-5 rounded-full bg-[var(--apple-accent)]/15 flex items-center justify-center text-[10px] text-[var(--apple-accent)]">4</span>{t('landing','feat4')}</div>
          </div>
        </div>
  <div>
          <div className="glass rounded-[32px] px-8 py-10 relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-[var(--apple-accent)]/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-[var(--apple-accent)]/5 rounded-full" />
            <div className="relative space-y-8">
              <header className="space-y-2">
                <h2 className="text-[20px] font-semibold tracking-tight">{t('common','chooseLanguage')}</h2>
                <p className="text-[12px] text-[var(--apple-text-secondary)]">{t('common','canChangeLater')}</p>
              </header>
              <div ref={segRef} className="segmented w-full justify-between" role="radiogroup" aria-label="Languages" tabIndex={0} onKeyDown={handleKey}>
                <span className="segmented-indicator" aria-hidden />
                {languages.map(l => (
                  <button
                    key={l.code}
                    type="button"
                    data-active={selectedLanguage === l.code}
                    role="radio"
                    aria-checked={selectedLanguage === l.code}
                    aria-label={l.name}
                    onClick={() => { setSelectedLanguage(l.code); setLang(l.code as any); }}
                  >
                    <span className="mr-1" aria-hidden>{l.flag}</span>{l.name}
                  </button>
                ))}
              </div>
              <div className="space-y-6">
                <MDButton variant="filled" disabled={!selectedLanguage} onClick={handleContinue} className="apple-btn w-full !h-12 !rounded-2xl !text-[15px] !font-semibold !bg-[var(--apple-accent)]">
                  {t('common','continue')}
                </MDButton>
                <p className="text-[11px] text-[var(--apple-text-secondary)] text-center leading-relaxed">{t('common','terms')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
