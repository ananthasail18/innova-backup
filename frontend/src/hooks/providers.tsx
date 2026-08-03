import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ThemeContext } from '@/hooks/ThemeContext';
import { CartProvider } from '@/hooks/CartContext';
import { SessionProvider } from '@/hooks/SessionContext';
import { RestaurantProvider } from '@/hooks/RestaurantContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeContext.Provider value={{ theme, setTheme }}>
          <RestaurantProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </RestaurantProvider>
        </ThemeContext.Provider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
