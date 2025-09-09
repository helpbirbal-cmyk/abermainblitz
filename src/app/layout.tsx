// src/app/layout.tsx
import { BlitzProvider } from "../blitz-client"
import type { Metadata } from "next"
import "./globals.css" // Make sure you have this import

export const metadata: Metadata = {
  title: "Your App",
  description: "Your app description",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <BlitzProvider>
          {children}
        </BlitzProvider>
      </body>
    </html>
  )
}
