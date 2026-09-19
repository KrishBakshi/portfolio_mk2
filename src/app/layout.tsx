import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

import { Providers } from "@/components/layout/providers";
import { SiteHeader } from "@/components/layout/site-header";
import Footer from "@/components/Footer";
import { getRootMetadata } from "@/config/metadata";
import { META_THEME_COLORS } from "@/config/site";
import { fontMono, fontSans } from "@/lib/fonts";

import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = getRootMetadata();

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: META_THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: META_THEME_COLORS.dark },
  ],
};

// Dark mode script to set theme-color meta tag before page render
const darkModeScript = String.raw`
  try {
    if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '${META_THEME_COLORS.dark}')
    }
  } catch (_) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content={META_THEME_COLORS.light} suppressHydrationWarning />
        <Script
          id="dark-mode-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: darkModeScript }}
        />
      </head>
      <body
        className={`${fontSans.variable} ${fontMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="relative mx-auto w-full max-w-2xl overflow-x-clip px-3 min-[765px]:px-5 min-[900px]:px-0">
            <SiteHeader />
            <div className="mx-auto w-full">
              {children}
              <Analytics />
            </div>
            <div className="mx-auto w-full max-w-2xl border-t border-border">
              <Footer />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
