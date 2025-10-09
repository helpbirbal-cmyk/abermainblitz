'use client';

import { useEffect, useState } from 'react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useTheme } from 'next-themes';

// Create MUI themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
      contrastText: '#000000',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          color: '#f1f5f9',
        },
      },
    },
  },
});

export default function CustomThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which theme to use
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const muiTheme = currentTheme === 'dark' ? darkTheme : lightTheme;

  if (!mounted) {
    return (
      <MUIThemeProvider theme={lightTheme}>
        <CssBaseline />
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </MUIThemeProvider>
    );
  }

  return (
    <MUIThemeProvider theme={muiTheme}>
      <CssBaseline />
      <div className={`min-h-screen transition-colors duration-200 ${
        currentTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        {children}
      </div>
    </MUIThemeProvider>
  );
}
