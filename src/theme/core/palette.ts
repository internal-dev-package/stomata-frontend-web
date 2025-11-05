import type { PaletteOptions } from '@mui/material/styles';

export const palette: Record<'light' | 'dark', PaletteOptions> = {
  light: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    background: { default: '#f9f9f9', paper: '#ffffff' },
  },
  dark: {
    mode: 'dark',
    primary: { main: '#90caf9' },
    secondary: { main: '#ce93d8' },
    background: { default: '#121212', paper: '#1e1e1e' },
  },
};
