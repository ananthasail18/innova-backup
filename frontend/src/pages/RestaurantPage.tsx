import { useState } from 'react';
import { useSession } from '@/hooks/SessionContext';
import { useRestaurant, useCategories, useDishes, useRecommendations } from '@/services/queries';
import { RestaurantHero } from '@/components/RestaurantHero';
import { CategoryTabs } from '@/components/CategoryTabs';
import { DishGrid } from '@/components/DishGrid';
import { RecommendationCarousel } from '@/components/RecommendationCarousel';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { CartSummary } from '@/components/CartSummary';
import { User, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function RestaurantPage() {
  const { userId } = useSession();
  const navigate = useNavigate();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  const { data: restaurant, isLoading: isRestLoading, isError: isRestError, refetch: refetchRest } = useRestaurant();
  const { data: categories, isLoading: isCatLoading } = useCategories();
  const { data: dishes, isLoading: isDishesLoading } = useDishes(selectedCategoryId);
  const { data: recsResponse } = useRecommendations(userId);

  if (isRestLoading || isCatLoading || isDishesLoading) {
    return <LoadingSkeleton items={6} />;
  }

  if (isRestError || !restaurant) {
    return <ErrorState message="Failed to load restaurant information. Click below to restart." onRetry={refetchRest} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Top Navbar */}
      <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur border-b border-border sticky top-0 z-30">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          <span>TasteAI</span>
        </div>

        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full text-xs font-bold hover:bg-muted/80 transition-colors"
        >
          <User className="w-4 h-4 text-primary" />
          <span>My Taste Profile</span>
        </button>
      </div>

      <RestaurantHero restaurant={restaurant} />

      {recsResponse?.recommendations && (
        <RecommendationCarousel recommendations={recsResponse.recommendations} />
      )}

      {categories && (
        <CategoryTabs
          categories={categories}
          activeCategoryId={selectedCategoryId}
          onSelect={setSelectedCategoryId}
        />
      )}

      <main className="flex-1">
        <DishGrid dishes={dishes || []} />
      </main>

      <CartSummary />
    </div>
  );
}
