import { createContext } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const ThemeContext = createContext<{theme: Theme; setTheme: (theme: Theme) => void}>({
  theme: 'system',
  setTheme: () => null,
});
