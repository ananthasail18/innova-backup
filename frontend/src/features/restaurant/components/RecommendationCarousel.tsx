import { useNavigate } from 'react-router-dom';
import type { DishRecommendation } from '@/shared/types';
import { Star, Sparkles } from 'lucide-react';

export function RecommendationCarousel({ recommendations }: { recommendations: DishRecommendation[] }) {
  const navigate = useNavigate();

  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="py-6 space-y-4">
      <div className="flex items-center gap-2 px-4">
        <Sparkles className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">For You</h2>
      </div>
      
      <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4 px-4 gap-4">
        {recommendations.slice(0, 5).map((rec) => {
          const dish = rec.dish;
          const matchPercent = Math.round(rec.score * 100);
          
          return (
            <div 
              key={dish.id}
              onClick={() => navigate(`/dish/${dish.id}`)}
              className="snap-center shrink-0 w-[280px] bg-card border border-primary/20 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative h-[180px] w-full overflow-hidden">
                {dish.image_url ? (
                  <img 
                    src={dish.image_url} 
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">No image</span>
                  </div>
                )}
                
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {matchPercent}% Match
                </div>
              </div>
              
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-lg leading-tight line-clamp-1">{dish.name}</h3>
                  <span className="font-semibold text-primary whitespace-nowrap">₹{dish.price.toFixed(2)}</span>
                </div>
                
                {rec.reasons.length > 0 && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {rec.reasons[0].text}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
