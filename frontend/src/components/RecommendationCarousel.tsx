import type { DishRecommendation } from '@/services/types';
import { PriceTag } from '@/components/PriceTag';
import { VegIndicator } from '@/components/VegIndicator';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DishImage } from '@/components/DishImage';

export function RecommendationCarousel({ recommendations }: { recommendations: DishRecommendation[] }) {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="w-full space-y-2.5 px-4 md:px-8 py-4 bg-gradient-to-b from-primary/5 to-transparent border-b border-border">
      <div className="flex items-center gap-2">
        <Star className="w-4 h-4 fill-primary text-primary" />
        <h3 className="font-bold text-base md:text-lg">Top Recommended for You</h3>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 pt-1">
        {recommendations.slice(0, 6).map(({ dish, score, reasons }) => (
          <div
            key={dish.id}
            onClick={() => navigate(`/dish/${dish.id}`)}
            className="w-full bg-card border border-border rounded-xl p-2.5 flex flex-col gap-1.5 cursor-pointer hover:border-primary/50 transition-all hover:scale-[1.01] shadow-sm"
          >
            <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden bg-muted">
              <DishImage src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
              <span className="absolute top-1.5 right-1.5 bg-primary text-primary-foreground font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-md">
                {Math.round(score * 100)}% Match
              </span>
            </div>
            
            <div className="flex justify-between items-start gap-1">
              <h4 className="font-bold text-xs leading-tight line-clamp-1">{dish.name}</h4>
              <VegIndicator isVegetarian={dish.is_vegetarian} />
            </div>

            {reasons && reasons.length > 0 && (
              <p className="text-[10px] text-muted-foreground line-clamp-1 leading-none">
                {reasons[0].text}
              </p>
            )}

            <div className="mt-auto pt-0.5 font-bold text-xs">
              <PriceTag price={dish.price} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
