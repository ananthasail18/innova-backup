import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/SessionContext';
import { useCreateUser, useTasteProfile } from '@/services/queries';
import { useRestaurantContext } from '@/hooks/RestaurantContext';
import { CategoryTabs } from '@/components/CategoryTabs';
import { DishGrid } from '@/components/DishGrid';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { CartSummary } from '@/components/CartSummary';
import { RecommendationCarousel } from '@/components/RecommendationCarousel';
import { Sparkles, Star } from 'lucide-react';

export function RestaurantPage() {
  return <RestaurantPageInner />;
}

function RestaurantPageInner() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { userId, setUserId } = useSession();
  const { restaurant, categories, menu, recommendations, isLoading, isError, refetch, setRestaurantSlug } = useRestaurantContext();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (slug) {
      setRestaurantSlug(slug);
    }
  }, [slug, setRestaurantSlug]);

  useEffect(() => {
    if (!isLoading && restaurant) {
      const timer = setTimeout(() => setIsLoaded(true), 100);
      return () => clearTimeout(timer);
    } else {
      setIsLoaded(false);
    }
  }, [isLoading, restaurant]);
  
  const { data: profile, isLoading: loadingProfile } = useTasteProfile(userId);
  const createUser = useCreateUser();

  if (isLoading || loadingProfile) {
    return <LoadingSkeleton items={6} />;
  }

  if (isError || !restaurant) {
    return <ErrorState message="Failed to load restaurant information." onRetry={refetch} />;
  }

  // If no taste profile exists, onboard user
  if (!profile) {
    const handleGetStarted = () => {
      createUser.mutate(
        { name: 'Guest' },
        {
          onSuccess: (user) => {
            setUserId(user.id);
            navigate(`/quiz?restaurant=${restaurant.slug}`);
          },
        }
      );
    };

    return (
      <div className="flex flex-col min-h-screen bg-neutral-950 items-center justify-center p-6 text-center">
        <div className="max-w-sm space-y-6">
          <div className="w-16 h-16 bg-orange-500/20 text-orange-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white">{restaurant.name}</h1>
          <p className="text-neutral-400 text-sm">Discover personalized dish recommendations based on your unique 8D Taste DNA.</p>
          <button
            onClick={handleGetStarted}
            disabled={createUser.isPending}
            className="w-full py-3.5 bg-orange-500 text-white font-extrabold rounded-xl shadow-lg hover:bg-orange-600 transition-all"
          >
            {createUser.isPending ? 'Loading...' : 'Start Taste Quiz'}
          </button>
        </div>
      </div>
    );
  }

  // Filter menu dishes based on selected category
  const filteredDishes = activeCategoryId 
    ? menu.filter(d => d.category_id === activeCategoryId)
    : menu;

  return (
    <div className={`flex flex-col min-h-screen bg-neutral-950 text-neutral-100 pb-24 transition-all duration-500 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Compact Top Restaurant Bar (Replaces Giant Hero Banner) */}
      <div className="bg-neutral-900/90 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          {restaurant.logo ? (
            <img src={restaurant.logo} alt={restaurant.name} className="w-7 h-7 rounded-full object-cover border border-neutral-700" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-orange-500/20 text-orange-400 font-bold text-xs flex items-center justify-center">
              {restaurant.name[0]}
            </div>
          )}
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-tight leading-none">{restaurant.name}</h1>
            <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-emerald-400" /> 4.8
              </span>
              <span>• {restaurant.cuisine || 'Authentic Food'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/quiz')}
          className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[11px] font-extrabold px-2.5 py-1 rounded-full hover:bg-orange-500/20 transition-all"
        >
          <Sparkles className="w-3 h-3 text-orange-400" />
          <span>8D Taste DNA</span>
        </button>
      </div>

      {/* Start Directly with Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="pt-2">
          <RecommendationCarousel recommendations={recommendations} />
        </div>
      )}
      
      {/* Scrollable Category Tabs */}
      <div className="sticky top-0 z-30 bg-neutral-950/95 backdrop-blur border-b border-neutral-800">
        <CategoryTabs 
          categories={categories} 
          activeCategoryId={activeCategoryId} 
          onSelect={setActiveCategoryId} 
        />
      </div>

      {/* Main Spaced Dish Menu Grid */}
      <main className="flex-1">
        <DishGrid dishes={filteredDishes} />
      </main>

      <CartSummary />
    </div>
  );
}
