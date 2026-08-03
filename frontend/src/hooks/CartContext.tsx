import { createContext, useContext, useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import type { Dish, CartItem } from '@/services/types';
import { useRestaurantContext } from '@/hooks/RestaurantContext';

interface CartContextType {
  items: CartItem[];
  addItem: (dish: Dish, quantity?: number) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { restaurant } = useRestaurantContext();
  const [items, setItems] = useState<CartItem[]>([]);
  const loadedRestaurantRef = useRef<string | null>(null);

  useEffect(() => {
    if (restaurant?.id) {
      const storedCart = localStorage.getItem(`tasteai_cart_${restaurant.id}`);
      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart));
        } catch (e) {
          setItems([]);
        }
      } else {
        setItems([]);
      }
      loadedRestaurantRef.current = restaurant.id;
    } else {
      setItems([]);
      loadedRestaurantRef.current = null;
    }
  }, [restaurant?.id]);

  useEffect(() => {
    if (restaurant?.id && loadedRestaurantRef.current === restaurant.id) {
      localStorage.setItem(`tasteai_cart_${restaurant.id}`, JSON.stringify(items));
    }
  }, [items, restaurant?.id]);

  const addItem = (dish: Dish, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.dish.id === dish.id);
      if (existing) {
        return prev.map((item) =>
          item.dish.id === dish.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { dish, quantity }];
    });
  };

  const removeItem = (dishId: string) => {
    setItems((prev) => prev.filter((item) => item.dish.id !== dishId));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.dish.id !== dishId);
      }
      return prev.map((item) => (item.dish.id === dishId ? { ...item, quantity } : item));
    });
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((acc, item) => acc + item.dish.price * item.quantity, 0), [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
