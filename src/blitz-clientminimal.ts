// src/blitz-client.ts
'use client'

// Simple fallback that will work for now
export const BlitzProvider = ({ children }: { children: React.ReactNode }) => {
  return children
}

export const withBlitz = (Component: React.ComponentType) => Component
