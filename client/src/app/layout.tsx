import "./globals.css";
import "./theme/material-theme.css";
import Navbar from "./components/ui/Navbar";
import { RoleProvider } from "./context/RoleContext";
import MaterialProvider from "./components/ui/MaterialProvider";
import { I18nProvider } from "./i18n/I18nContext";
import { cookies } from "next/headers";
import type { SupportedLang } from "./i18n/dictionaries";

export const metadata = {
  title: "Rozgaar Setu",
  description: "Connects local workers with customers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore: any = cookies();
  const lang = (cookieStore?.get?.('lang')?.value as SupportedLang) || (cookieStore?.get?.('NEXT_LOCALE')?.value as SupportedLang) || 'en';
  const theme = cookieStore?.get?.('theme')?.value; // 'dark' | 'light'

  return (
    <html lang={lang}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=SF+Pro+Display:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Inter:wght@400;500;600&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`material ${theme === 'dark' ? 'dark' : ''}`} data-theme={theme === 'dark' ? 'dark' : undefined}>
        <MaterialProvider />
        <I18nProvider initialLang={lang}>
          <RoleProvider>
          <Navbar />
          <main className="pt-24 pb-12 min-h-[calc(100vh-6rem)]">{children}</main>
          </RoleProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
