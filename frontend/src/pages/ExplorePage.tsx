import { useSession } from '@/hooks/SessionContext';
import { useRestaurantContext } from '@/hooks/RestaurantContext';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import type { ApiResponse, Dish } from '@/services/types';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { Users, Flame, Plus, ChevronRight, Sparkles } from 'lucide-react';
import { DishImage } from '@/components/DishImage';

interface ExploreItem {
  dish: Dish;
  liked_by_count: number;
  avg_similarity: number;
}

function ExploreCard({ item }: { item: ExploreItem }) {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const { dish, liked_by_count, avg_similarity } = item;

  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden flex gap-3 p-3 active:scale-[0.98] transition-all"
    >
      {/* Dish image */}
      <div
        className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer"
        onClick={() => navigate(`/dish/${dish.id}`)}
      >
        <DishImage
          src={dish.image_url}
          alt={dish.name}
          className="w-full h-full object-cover"
        />
        {dish.is_veg && (
          <span className="absolute top-1 left-1 bg-emerald-500 text-white text-[8px] font-black px-1 py-0.5 rounded">
            VEG
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3
            className="font-bold text-sm text-foreground truncate cursor-pointer hover:text-primary transition-colors"
            onClick={() => navigate(`/dish/${dish.id}`)}
          >
            {dish.name}
          </h3>
          <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{dish.description}</p>

          {/* Community badge */}
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="flex items-center gap-1 bg-violet-500/15 text-violet-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-500/20">
              <Users className="w-2.5 h-2.5" />
              {liked_by_count} {liked_by_count === 1 ? 'person' : 'people'} with your taste liked this
            </span>
            <span className="flex items-center gap-0.5 text-[10px] text-emerald-400 font-bold">
              <Sparkles className="w-2.5 h-2.5" />
              {avg_similarity}% match
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="font-extrabold text-sm text-foreground">₹{dish.price}</span>
          <button
            onClick={() => addItem(dish, 1)}
            className="flex items-center gap-1 bg-primary text-primary-foreground text-[11px] font-bold px-3 py-1.5 rounded-xl hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Plus className="w-3 h-3" /> Add
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate(`/dish/${dish.id}`)}
        className="shrink-0 self-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ExplorePage() {
  const { userId } = useSession();
  const { restaurant } = useRestaurantContext();

  const { data, isLoading } = useQuery({
    queryKey: ['community-explore', userId, restaurant?.id],
    queryFn: async () => {
      if (!userId) return [];
      const params: any = {};
      if (restaurant?.id) params.restaurant_id = restaurant.id;
      const { data } = await api.get<ApiResponse<ExploreItem[]>>(
        `/community/explore/${userId}`,
        { params }
      );
      return data.data ?? [];
    },
    enabled: !!userId,
  });

  const items = data ?? [];

  return (
    <div className="flex flex-col h-full overflow-y-auto pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-xl border-b border-border px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-violet-500/10 text-violet-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-base text-foreground tracking-tight">Community Explore</h1>
            <p className="text-[11px] text-muted-foreground">What people with your taste profile are loving</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {isLoading ? (
          // Skeleton
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-3 flex gap-3 animate-pulse">
              <div className="w-20 h-20 bg-muted rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-3 bg-muted rounded w-3/4" />
                <div className="h-2 bg-muted rounded w-1/2" />
                <div className="h-5 bg-muted rounded-full w-2/3" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 px-6">
            <div className="p-4 bg-violet-500/10 text-violet-400 rounded-2xl">
              <Flame className="w-8 h-8" />
            </div>
            <h2 className="font-extrabold text-lg text-foreground">No community data yet!</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As more people order and give 👍 feedback, you'll see what people with a similar Taste DNA are loving here.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider px-1">
              {items.length} dishes trending among your taste tribe
            </p>
            {items.map((item) => (
              <ExploreCard key={item.dish.id} item={item} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
