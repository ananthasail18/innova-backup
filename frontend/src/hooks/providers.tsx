import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ThemeContext } from '@/hooks/ThemeContext';
import { CartProvider } from '@/hooks/CartContext';
import { SessionProvider } from '@/hooks/SessionContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeContext.Provider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
