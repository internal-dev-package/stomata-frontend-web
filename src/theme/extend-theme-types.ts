// src/theme/extend-theme-types.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    customShadows?: Record<string, string>;
  }

  interface ThemeOptions {
    customShadows?: Record<string, string>;
  }

  interface Palette {
    neutral?: Palette['primary'];
  }

  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
  }
}
