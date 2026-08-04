import type { Dish } from '@/services/types';
import { PriceTag } from '@/components/PriceTag';
import { VegIndicator } from '@/components/VegIndicator';
import { AvailabilityBadge } from '@/components/AvailabilityBadge';
import { useNavigate } from 'react-router-dom';
import { DishImage } from '@/components/DishImage';
import { useCart } from '@/hooks/useCart';
import { Plus, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function DishCard({ dish }: { dish: Dish }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(dish, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div 
      onClick={() => navigate(`/dish/${dish.id}`)}
      className={`relative flex flex-col overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 text-neutral-100 shadow-md transition-all hover:shadow-lg hover:border-orange-500/40 cursor-pointer ${!dish.is_available ? 'opacity-60' : ''}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-950 relative">
        <DishImage 
          src={dish.image_url} 
          alt={dish.name} 
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <VegIndicator isVegetarian={dish.is_vegetarian} />
        </div>
      </div>
      
      <div className="p-3 flex flex-col gap-2 flex-1 justify-between">
        <div>
          <h3 className="text-xs font-extrabold leading-snug line-clamp-2 text-white">{dish.name}</h3>
          {dish.description && (
            <p className="text-[10px] text-neutral-400 line-clamp-1 mt-0.5">{dish.description}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-1.5 border-t border-neutral-800/80">
          <div className="text-xs font-black text-orange-400">
            <PriceTag price={dish.price} />
          </div>
          
          {dish.is_available ? (
            <button
              onClick={handleAddToCart}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 transition-all shadow-md ${
                isAdded
                  ? 'bg-emerald-600 text-white shadow-emerald-950'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-950'
              }`}
            >
              {isAdded ? (
                <>
                  <CheckCircle className="w-3 h-3" /> Added
                </>
              ) : (
                <>
                  <Plus className="w-3 h-3" /> ADD
                </>
              )}
            </button>
          ) : (
            <AvailabilityBadge isAvailable={false} />
          )}
        </div>
      </div>
    </div>
  );
}
