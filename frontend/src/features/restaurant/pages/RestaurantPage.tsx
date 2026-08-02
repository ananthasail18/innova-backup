import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/shared/context/SessionContext';
import { useRestaurant, useCategories, useDishes, useRecommendations } from '@/shared/services/queries';
import { RestaurantHero } from '../components/RestaurantHero';
import { CategoryTabs } from '../components/CategoryTabs';
import { DishGrid } from '../components/DishGrid';
import { LoadingSkeleton } from '@/shared/components/LoadingSkeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { CartSummary } from '@/shared/components/CartSummary';
import { RecommendationCarousel } from '../components/RecommendationCarousel';

export function RestaurantPage() {
  useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useSession();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const { data: restaurant, isLoading: loadingRest, isError: errorRest, refetch: refetchRest } = useRestaurant();
  const { data: categories, isLoading: loadingCat, isError: errorCat, refetch: refetchCat } = useCategories();
  const { data: dishes, isLoading: loadingDishes, isError: errorDishes, refetch: refetchDishes } = useDishes(activeCategoryId);
  const { data: recsData } = useRecommendations(userId);

  if (loadingRest || loadingCat) {
    return <LoadingSkeleton items={6} />;
  }

  if (errorRest || !restaurant || errorCat || !categories) {
    return (
      <ErrorState 
        message="Failed to load restaurant menu." 
        onRetry={() => {
          if (errorRest) {
             navigate('/');
          } else {
             refetchRest(); 
             refetchCat(); 
          }
        }} 
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border p-4 flex justify-between items-center">
        <h1 className="font-bold">{restaurant.name}</h1>
        <button 
          onClick={() => navigate('/profile')}
          className="px-4 py-2 bg-muted text-foreground text-sm font-semibold rounded-full hover:bg-muted/80 transition-colors"
        >
          My Taste Profile
        </button>
      </div>

      <RestaurantHero restaurant={restaurant} />

      {recsData && recsData.recommendations && recsData.recommendations.length > 0 && (
        <RecommendationCarousel recommendations={recsData.recommendations} />
      )}
      
      <div className="sticky top-0 z-30">
        <CategoryTabs 
          categories={categories} 
          activeCategoryId={activeCategoryId} 
          onSelect={setActiveCategoryId} 
        />
      </div>

      <main className="flex-1">
        {loadingDishes ? (
          <LoadingSkeleton items={8} />
        ) : errorDishes ? (
          <ErrorState message="Failed to load dishes." onRetry={refetchDishes} />
        ) : (
          <DishGrid dishes={dishes || []} />
        )}
      </main>

      <CartSummary />
    </div>
  );
}
