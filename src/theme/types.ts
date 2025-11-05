import type { ThemeOptions as MuiThemeOptions } from '@mui/material/styles';


export type ThemeOptions = MuiThemeOptions & {
  colorSchemes?: any;
  defaultColorScheme?: 'light' | 'dark';
  cssVariables?: boolean;
};
