// src/types/theme.ts
import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    cardButton: {
      background: string;
      text: string;
    };
  }

  interface PaletteOptions {
    cardButton?: {
      background: string;
      text: string;
    };
  }
}

export const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#1976d2',
    },
    cardButton: {
      background: '#ffffff',
      text: '#000000',
    },
  },
};

export const theme = createTheme(themeOptions);
