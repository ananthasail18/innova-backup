import type { Restaurant } from '@/shared/types';

export function RestaurantHero({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="relative w-full h-[40vh] min-h-[300px] flex items-end justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      <div className="relative z-10 w-full max-w-5xl mx-auto p-6 md:p-10 text-white text-center md:text-left flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{restaurant.name}</h1>
          {restaurant.description && (
            <p className="text-lg text-white/90 max-w-2xl">{restaurant.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
