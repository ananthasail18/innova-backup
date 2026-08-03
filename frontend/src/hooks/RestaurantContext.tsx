import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Restaurant, Category, Dish, DishRecommendation } from '@/services/types';
import { useRestaurantDetail } from '@/services/queries';
import { useSession } from '@/hooks/SessionContext';

interface RestaurantContextType {
  restaurant: Restaurant | null;
  categories: Category[];
  menu: Dish[];
  metadata: {
    city: string | null;
    cuisine: string | null;
    description: string | null;
    opening_hours: string | null;
    price_range: string | null;
  } | null;
  theme: {
    primary_color: string | null;
    secondary_color: string | null;
  } | null;
  recommendations: DishRecommendation[];
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  setRestaurantSlug: (slug: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

function getContrastColor(hexColor: string): string {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  if (hex.length !== 6) return '#F5F5F5';
  
  // Parse r, g, b
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Calculate relative luminance YIQ
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 135 ? '#0A0A0A' : '#F5F5F5';
}

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const { userId } = useSession();
  const [slug, setSlug] = useState(() => {
    // Detect slug from URL if user landed directly on a restaurant page
    const pathParts = window.location.pathname.split('/');
    const restIndex = pathParts.indexOf('restaurant');
    if (restIndex !== -1 && pathParts[restIndex + 1]) {
      const urlSlug = pathParts[restIndex + 1];
      localStorage.setItem('tasteai_active_restaurant_slug', urlSlug);
      return urlSlug;
    }
    return localStorage.getItem('tasteai_active_restaurant_slug') || 'spice-symphony';
  });

  const { data, isLoading, isError, refetch } = useRestaurantDetail(slug, userId);

  useEffect(() => {
    if (isError && slug !== 'spice-symphony') {
      console.warn(`Restaurant slug "${slug}" not found. Resetting to spice-symphony.`);
      localStorage.setItem('tasteai_active_restaurant_slug', 'spice-symphony');
      setSlug('spice-symphony');
    }
  }, [isError, slug]);

  // Monitor URL changes to automatically update active restaurant
  useEffect(() => {
    const handleLocationChange = () => {
      const pathParts = window.location.pathname.split('/');
      const restIndex = pathParts.indexOf('restaurant');
      if (restIndex !== -1 && pathParts[restIndex + 1]) {
        const urlSlug = pathParts[restIndex + 1];
        localStorage.setItem('tasteai_active_restaurant_slug', urlSlug);
        setSlug(urlSlug);
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    
    // Intercept pushState to capture client-side React Router changes
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  const setRestaurantSlug = (newSlug: string) => {
    localStorage.setItem('tasteai_active_restaurant_slug', newSlug);
    setSlug(newSlug);
  };

  // Apply theme colors dynamically on the document root
  useEffect(() => {
    if (data?.theme) {
      const primary = data.theme.primary_color || '#F97316';
      const secondary = data.theme.secondary_color || '#262626';
      
      const primaryForeground = getContrastColor(primary);
      const secondaryForeground = getContrastColor(secondary);
      
      const root = document.documentElement;
      
      const origPrimary = root.style.getPropertyValue('--primary');
      const origPrimaryColor = root.style.getPropertyValue('--color-primary');
      const origPrimaryForeground = root.style.getPropertyValue('--primary-foreground');
      const origPrimaryForegroundColor = root.style.getPropertyValue('--color-primary-foreground');
      
      const origSecondary = root.style.getPropertyValue('--secondary');
      const origSecondaryColor = root.style.getPropertyValue('--color-secondary');
      const origSecondaryForeground = root.style.getPropertyValue('--secondary-foreground');
      const origSecondaryForegroundColor = root.style.getPropertyValue('--color-secondary-foreground');

      root.style.setProperty('--primary', primary);
      root.style.setProperty('--color-primary', primary);
      root.style.setProperty('--primary-foreground', primaryForeground);
      root.style.setProperty('--color-primary-foreground', primaryForeground);
      
      root.style.setProperty('--secondary', secondary);
      root.style.setProperty('--color-secondary', secondary);
      root.style.setProperty('--secondary-foreground', secondaryForeground);
      root.style.setProperty('--color-secondary-foreground', secondaryForeground);
      
      return () => {
        if (origPrimary) root.style.setProperty('--primary', origPrimary);
        else root.style.removeProperty('--primary');
        if (origPrimaryColor) root.style.setProperty('--color-primary', origPrimaryColor);
        else root.style.removeProperty('--color-primary');
        
        if (origPrimaryForeground) root.style.setProperty('--primary-foreground', origPrimaryForeground);
        else root.style.removeProperty('--primary-foreground');
        if (origPrimaryForegroundColor) root.style.setProperty('--color-primary-foreground', origPrimaryForegroundColor);
        else root.style.removeProperty('--color-primary-foreground');

        if (origSecondary) root.style.setProperty('--secondary', origSecondary);
        else root.style.removeProperty('--secondary');
        if (origSecondaryColor) root.style.setProperty('--color-secondary', origSecondaryColor);
        else root.style.removeProperty('--color-secondary');
        
        if (origSecondaryForeground) root.style.setProperty('--secondary-foreground', origSecondaryForeground);
        else root.style.removeProperty('--secondary-foreground');
        if (origSecondaryForegroundColor) root.style.setProperty('--color-secondary-foreground', origSecondaryForegroundColor);
        else root.style.removeProperty('--color-secondary-foreground');
      };
    }
  }, [data]);

  return (
    <RestaurantContext.Provider value={{
      restaurant: data?.restaurant || null,
      categories: data?.categories || [],
      menu: data?.menu || [],
      metadata: data?.metadata || null,
      theme: data?.theme || null,
      recommendations: data?.recommendations || [],
      isLoading,
      isError,
      refetch,
      setRestaurantSlug
    }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurantContext() {
  const context = useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error('useRestaurantContext must be used within a RestaurantProvider');
  }
  return context;
}

