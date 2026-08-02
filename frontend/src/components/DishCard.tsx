import type { Dish } from '@/services/types';
import { PriceTag } from '@/components/PriceTag';
import { VegIndicator } from '@/components/VegIndicator';
import { AvailabilityBadge } from '@/components/AvailabilityBadge';
import { useNavigate } from 'react-router-dom';

export function DishCard({ dish }: { dish: Dish }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/dish/${dish.id}`)}
      className={`relative flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md cursor-pointer ${!dish.is_available ? 'opacity-70' : ''}`}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
        {dish.image_url ? (
          <img 
            src={dish.image_url} 
            alt={dish.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">No Image</div>
        )}
      </div>
      
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex justify-between items-start gap-1.5">
          <h3 className="text-xs sm:text-sm font-bold leading-tight line-clamp-2">{dish.name}</h3>
          <div className="shrink-0">
            <VegIndicator isVegetarian={dish.is_vegetarian} />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="text-xs sm:text-sm font-bold">
            <PriceTag price={dish.price} />
          </div>
          <AvailabilityBadge isAvailable={dish.is_available} />
        </div>
      </div>
    </div>
  );
}
