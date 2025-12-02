import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";

import { Providers } from "@/components/layout/providers";
import { SiteHeader } from "@/components/layout/site-header";
import { META_THEME_COLORS } from "@/config/site";
import { fontMono, fontSans } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Krish Bakshi - Data Scientist",
  description: "Yo! Thank you for coming to my portfolio!",
  metadataBase: new URL("http://localhost:3000"),
};

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
          <div className="mx-auto max-w-[calc(48rem+120px)] relative px-2 md:px-0">
            <SiteHeader />
            <div className="mx-auto w-full">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
