import type { Dish } from '@/services/types';
import { PriceTag } from '@/components/PriceTag';
import { VegIndicator } from '@/components/VegIndicator';
import { Sparkles, Plus, CheckCircle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DishImage } from '@/components/DishImage';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

export interface CarouselItem {
  dish: Dish;
  badgeText: string;
  reasonText?: string;
}

interface RecommendationCarouselProps {
  title: string;
  subtitle: string;
  items: CarouselItem[];
  icon?: 'sparkles' | 'users';
}

export function RecommendationCarousel({ title, subtitle, items, icon = 'sparkles' }: RecommendationCarouselProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  if (!items || items.length === 0) return null;

  const handleAddToCart = (e: React.MouseEvent, dish: Dish) => {
    e.stopPropagation();
    addItem(dish, 1);
    setAddedItemIds((prev) => ({ ...prev, [dish.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [dish.id]: false }));
    }, 1500);
  };

  return (
    <div className="w-full space-y-3 px-4 py-3 bg-gradient-to-b from-orange-500/10 via-neutral-950 to-neutral-950 border-b border-neutral-800/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/20 rounded-lg text-orange-400">
            {icon === 'sparkles' ? <Sparkles className="w-4 h-4" /> : <Users className="w-4 h-4" />}
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white tracking-tight">{title}</h3>
            <p className="text-[10px] text-neutral-400">{subtitle}</p>
          </div>
        </div>
      </div>
      
      {/* Horizontal Spaced Recommendation Scroll View */}
      <div className="flex items-stretch gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {items.slice(0, 8).map(({ dish, badgeText, reasonText }) => (
          <div
            key={dish.id}
            onClick={() => navigate(`/dish/${dish.id}`)}
            className="w-[160px] shrink-0 bg-neutral-900/90 border border-neutral-800 hover:border-orange-500/40 rounded-2xl p-2.5 flex flex-col justify-between gap-2.5 cursor-pointer shadow-lg transition-all hover:scale-[1.02] active:scale-95"
          >
            {/* Dish Image + Match Badge */}
            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800">
              <DishImage src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
              <span className="absolute top-1 right-1 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-md">
                {badgeText}
              </span>
            </div>
            
            {/* Title & Veg Indicator */}
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-1">
                <h4 className="font-extrabold text-xs text-white leading-snug line-clamp-2">{dish.name}</h4>
                <div className="shrink-0 mt-0.5">
                  <VegIndicator isVegetarian={dish.is_vegetarian} />
                </div>
              </div>

              {reasonText && (
                <p className="text-[9px] text-neutral-400 line-clamp-1 italic">
                  💡 {reasonText}
                </p>
              )}
            </div>

            {/* Price & Add Button */}
            <div className="mt-auto flex items-center justify-between pt-1 border-t border-neutral-800/60">
              <div className="font-extrabold text-xs text-orange-400">
                <PriceTag price={dish.price} />
              </div>

              <button
                onClick={(e) => handleAddToCart(e, dish)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all shadow-md ${
                  addedItemIds[dish.id]
                    ? 'bg-emerald-600 text-white shadow-emerald-950'
                    : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-950'
                }`}
              >
                {addedItemIds[dish.id] ? (
                  <>
                    <CheckCircle className="w-3 h-3" /> Added
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" /> ADD
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
