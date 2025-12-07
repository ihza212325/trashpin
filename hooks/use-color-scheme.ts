import { ThemeContext } from '@/contexts/theme-context';
import { useContext } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * Hook to get the current color scheme.
 * Uses the theme context if available, otherwise falls back to system color scheme.
 */
export function useColorScheme(): 'light' | 'dark' {
  const context = useContext(ThemeContext);
  if (context) {
    return context.colorScheme;
  }
  // Fallback if ThemeProvider is not available
  const systemScheme = useRNColorScheme();
  return systemScheme === 'dark' ? 'dark' : 'light';
}
