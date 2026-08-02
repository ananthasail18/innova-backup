import { createContext } from 'react';

export interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
