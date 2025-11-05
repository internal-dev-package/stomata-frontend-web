import type { Direction } from '@mui/material';

export const themeConfig: {
  direction: Direction;
  cssVariables: boolean;
  defaultMode: 'light' | 'dark';
  modeStorageKey: string;
} = {
  direction: 'ltr', // ✅ sudah sesuai tipe Direction
  cssVariables: true,
  defaultMode: 'light',
  modeStorageKey: 'app-theme-modew',
};