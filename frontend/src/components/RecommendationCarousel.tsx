import type { DishRecommendation } from '@/services/types';
import { PriceTag } from '@/components/PriceTag';
import { VegIndicator } from '@/components/VegIndicator';
import { Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RecommendationCarousel({ recommendations }: { recommendations: DishRecommendation[] }) {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-3 p-4 bg-gradient-to-b from-primary/5 to-transparent border-b border-border">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 fill-primary text-primary" />
        <h3 className="font-bold text-lg">Top Recommended for You</h3>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        {recommendations.map(({ dish, score, reasons }) => (
          <div
            key={dish.id}
            onClick={() => navigate(`/dish/${dish.id}`)}
            className="flex-none w-64 bg-card border border-border rounded-2xl p-3 flex flex-col gap-2 cursor-pointer hover:border-primary/50 transition-colors shadow-sm"
          >
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-muted">
              {dish.image_url ? (
                <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs">No Image</div>
              )}
              <span className="absolute top-2 right-2 bg-primary text-primary-foreground font-bold text-xs px-2.5 py-1 rounded-full shadow-md">
                {Math.round(score * 100)}% Match
              </span>
            </div>
            
            <div className="flex justify-between items-start gap-2">
              <h4 className="font-bold text-sm leading-tight line-clamp-1">{dish.name}</h4>
              <VegIndicator isVegetarian={dish.is_vegetarian} />
            </div>

            {reasons && reasons.length > 0 && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {reasons[0].text}
              </p>
            )}

            <div className="mt-auto pt-1 font-bold text-sm">
              <PriceTag price={dish.price} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
