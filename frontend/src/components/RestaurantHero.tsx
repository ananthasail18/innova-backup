import type { Restaurant } from '@/services/types';

export function RestaurantHero({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className="relative bg-card border-b border-border p-6 md:p-8 space-y-2 text-center md:text-left">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6">
        {restaurant.logo_url ? (
          <img src={restaurant.logo_url} alt={restaurant.name} className="w-20 h-20 rounded-2xl object-cover border border-border" />
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl border border-primary/20">
            {restaurant.name.charAt(0)}
          </div>
        )}
        <div className="space-y-1">
          <h1 className="text-2xl md:text-4xl font-extrabold">{restaurant.name}</h1>
          {restaurant.description && (
            <p className="text-muted-foreground text-sm max-w-xl">{restaurant.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
