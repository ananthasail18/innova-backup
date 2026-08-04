import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, Sparkles, QrCode, ShoppingBag, Store } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export const MobileBottomNav: React.FC = () => {
  const { totalItems } = useCart();

  const navItems = [
    { to: '/restaurant', icon: Utensils, label: 'Menu' },
    { to: '/quiz', icon: Sparkles, label: 'Taste DNA' },
    { to: '/scanner', icon: QrCode, label: 'Scan QR' },
    { to: '/zomato', icon: Store, label: 'Zomato AI', badgeText: 'NEW' },
    { to: '/cart', icon: ShoppingBag, label: 'Cart', badgeCount: totalItems },
  ];

  return (
    <nav 
      aria-label="Mobile Navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-md border-t border-neutral-800/80 shadow-2xl pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-all duration-200 ${
                  isActive 
                    ? 'text-orange-500 font-semibold scale-105' 
                    : 'text-neutral-400 hover:text-neutral-200'
                }`
              }
            >
              <div className="relative">
                <Icon className="w-5 h-5 mb-0.5" />
                {Boolean(item.badgeCount && item.badgeCount > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 bg-orange-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow-md animate-pulse">
                    {item.badgeCount}
                  </span>
                )}
                {item.badgeText && !item.badgeCount && (
                  <span className="absolute -top-1.5 -right-3 bg-red-600 text-white text-[9px] font-black px-1 rounded-full uppercase tracking-tighter shadow-sm">
                    {item.badgeText}
                  </span>
                )}
              </div>
              <span className="tracking-tight">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
