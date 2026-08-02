import { useContext } from 'react';
import { ThemeContext } from '@/shared/hooks/ThemeContext';

export const useTheme = () => useContext(ThemeContext);
