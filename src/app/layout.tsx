import { BlitzProvider } from "../blitz-client";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from 'next-themes'
import CustomThemeProvider from '../components/ThemeProvider'
import CRMNavigation from '../components/CRMNavigation' // Add this import

export const metadata: Metadata = {
  title: "AberCXO Moz",
  description: "Flawless, Defect Free App Launches",
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
          <CustomThemeProvider>
            <BlitzProvider>
              {/* Add CRM Navigation - it will only show on CRM pages */}
              <CRMNavigation />
              {children}
              <SpeedInsights />
              <Analytics />
            </BlitzProvider>
          </CustomThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
