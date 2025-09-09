// src/app/layout.tsx
import { BlitzProvider } from "../blitz-client";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description",
};

// Add this viewport export
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
    <html lang="en">
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

        <BlitzProvider>{children}</BlitzProvider>
      </body>
    </html>
  );
}
