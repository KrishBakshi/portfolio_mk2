"use client";

import { ThemeProvider } from "next-themes";
import { ScrollToTop } from "./scroll-to-top";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      enableSystem
      disableTransitionOnChange
      enableColorScheme
      storageKey="theme"
      defaultTheme="system"
      attribute="class"
    >
      {children}
      <ScrollToTop />
    </ThemeProvider>
  );
}

