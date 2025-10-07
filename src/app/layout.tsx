// src/app/layout.tsx
import { BlitzProvider } from "../blitz-client";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from 'next-themes'

export const metadata: Metadata = {
  title: "Aberdeen Mozark",
  description: "Do More, Cut Costs with AI",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {/* Google Analytics script should remain here */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-LY17EHS8FX"
        ></script>
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LY17EHS8FX');
            `,
          }}
        />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BlitzProvider>
            {children}
            <SpeedInsights />
            <Analytics />
          </BlitzProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
