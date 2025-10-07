// src/components/ThemeProvider.tsx
'use client'

import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function CustomThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTheme, setCurrentTheme] = useState(createTheme())

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (resolvedTheme) {
      const theme = createTheme({
        palette: {
          mode: resolvedTheme as 'light' | 'dark',
          primary: {
            main: '#2563eb', // blue-600
          },
          ...(resolvedTheme === 'dark'
            ? {
                // Dark theme colors
                background: {
                  default: '#000000',
                  paper: '#111827',
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#9ca3af',
                },
              }
            : {
                // Light theme colors
                background: {
                  default: '#ffffff',
                  paper: '#f8fafc',
                },
                text: {
                  primary: '#000000',
                  secondary: '#4b5563',
                },
              }),
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#2563eb',
                  },
                },
              },
            },
          },
        },
      })
      setCurrentTheme(theme)
    }
  }, [resolvedTheme])

  // Prevent hydration mismatch
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <MUIThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
