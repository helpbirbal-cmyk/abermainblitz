import { BlitzProvider } from "../blitz-client";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from 'next-themes'
import CustomThemeProvider from '../components/ThemeProvider'
import ResponsiveCRMNavigation from '../components/CRMNavigation' // Using Tailwind version

export const metadata: Metadata = {
  title: "AberCXO Moz",
  description: "Flawless, Zero Defect App Launches",
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
      <head>
        {/* Preload critical resources */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-screen bg-gray-50">
        {/* Google Analytics */}
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
          <CustomThemeProvider>
            <BlitzProvider>
              {/* Responsive Navigation - Only shows on CRM pages */}
              <ResponsiveCRMNavigation />

              {/* Main Content */}
              <main className="min-h-screen">
                {children}
              </main>

              {/* Vercel Analytics */}
              <SpeedInsights />
              <Analytics />
            </BlitzProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
