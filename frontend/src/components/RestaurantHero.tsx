import type { Restaurant } from '@/services/types';
import { Clock, Tag, MapPin } from 'lucide-react';

export function RestaurantHero({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="relative w-full h-[55vh] min-h-[380px] flex items-end justify-center overflow-hidden transition-all duration-1000">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${restaurant.cover_image || restaurant.hero_image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-10 text-white flex flex-col md:flex-row items-center md:items-end gap-6">
        {restaurant.logo && (
          <img 
            src={restaurant.logo} 
            alt={`${restaurant.name} logo`} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-3xl object-cover border-4 border-background bg-card shadow-2xl transition-transform hover:scale-105 duration-500"
          />
        )}
        <div className="flex-1 space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center gap-2 justify-center md:justify-start">
            {restaurant.cuisine && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-extrabold rounded-full uppercase tracking-wider">
                {restaurant.cuisine}
              </span>
            )}
            {restaurant.city && (
              <span className="flex items-center gap-1 px-3 py-1 bg-black/40 backdrop-blur text-white text-xs font-semibold rounded-full border border-white/10">
                <MapPin className="w-3.5 h-3.5" /> {restaurant.city}
              </span>
            )}
            {restaurant.price_range && (
              <span className="flex items-center gap-1 px-3 py-1 bg-black/40 backdrop-blur text-white text-xs font-semibold rounded-full border border-white/10">
                <Tag className="w-3.5 h-3.5" /> {restaurant.price_range}
              </span>
            )}
            <span className="flex items-center gap-1 px-3 py-1 bg-amber-500/85 backdrop-blur text-white text-xs font-extrabold rounded-full">
              ⭐ 4.8
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tight drop-shadow-md">
            {restaurant.name}
          </h1>

          {restaurant.description && (
            <p className="text-base md:text-lg text-white/90 max-w-2xl leading-relaxed drop-shadow">
              {restaurant.description}
            </p>
          )}

          {restaurant.opening_hours && (
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-sm text-white/85 pt-1">
              <Clock className="w-4 h-4 text-primary animate-pulse" />
              <span>Hours: <span className="font-semibold">{restaurant.opening_hours}</span></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

