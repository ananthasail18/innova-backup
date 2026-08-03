import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/SessionContext';
import { useCart } from '@/hooks/CartContext';
import { useCreateUser, useTasteProfile } from '@/services/queries';
import { useRestaurantContext } from '@/hooks/RestaurantContext';
import { RestaurantHero } from '@/components/RestaurantHero';
import { CategoryTabs } from '@/components/CategoryTabs';
import { DishGrid } from '@/components/DishGrid';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { CartSummary } from '@/components/CartSummary';
import { RecommendationCarousel } from '@/components/RecommendationCarousel';
import { QrCode, ShoppingBag } from 'lucide-react';

export function RestaurantPage() {
  return <RestaurantPageInner />;
}

function RestaurantPageInner() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { userId, setUserId } = useSession();
  const { items } = useCart();
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
      const timer = setTimeout(() => setIsLoaded(true), 150);
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

  // If no taste profile exists, show the restaurant-specific landing/onboarding page
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
      <div className="flex flex-col min-h-screen bg-background">
        <div className="relative flex-1 flex flex-col justify-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url('${restaurant.cover_image || restaurant.hero_image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80'}')` }}
          />
          <div className="absolute inset-0 bg-black/60" />
          
          <div className="relative z-10 w-full max-w-2xl mx-auto p-6 md:p-10 text-center text-white space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                {restaurant.name}
              </h1>
              <p className="text-xl md:text-2xl text-white/90">
                {restaurant.description || "Discover your perfect dish."}
              </p>
              {restaurant.cuisine && (
                <span className="inline-block mt-2 px-3 py-1 bg-primary text-primary-foreground text-sm font-semibold rounded-full uppercase tracking-wider">
                  {restaurant.cuisine}
                </span>
              )}
            </div>
            
            <div className="pt-8">
              <button
                onClick={handleGetStarted}
                disabled={createUser.isPending}
                className="px-8 py-4 bg-primary text-primary-foreground text-lg font-bold rounded-full hover:bg-primary/90 transition-transform hover:scale-105 shadow-xl disabled:opacity-50"
              >
                {createUser.isPending ? 'Loading...' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter menu dishes based on selected category
  const filteredDishes = activeCategoryId 
    ? menu.filter(d => d.category_id === activeCategoryId)
    : menu;

  return (
    <div className={`flex flex-col min-h-screen bg-background pb-24 transition-all duration-700 ease-in-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {restaurant.logo && (
            <img src={restaurant.logo} alt={restaurant.name} className="w-8 h-8 rounded-full object-cover" />
          )}
          <h1 className="font-bold">{restaurant.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/scanner')}
            className="p-2 bg-muted text-foreground hover:bg-muted/80 rounded-full transition-colors flex items-center justify-center"
            title="Scan QR Code"
          >
            <QrCode className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold hover:bg-secondary/80 transition-colors relative"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Cart</span>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {items.length}
              </span>
            )}
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="px-4 py-2 bg-muted text-foreground text-sm font-semibold rounded-full hover:bg-muted/80 transition-colors"
          >
            My Taste Profile
          </button>
        </div>
      </div>

      <div className={`transition-all duration-1000 delay-100 ease-out ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <RestaurantHero restaurant={restaurant} />
      </div>

      {recommendations && recommendations.length > 0 && (
        <div className={`transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
          <RecommendationCarousel recommendations={recommendations} />
        </div>
      )}
      
      <div className="sticky top-0 z-30">
        <CategoryTabs 
          categories={categories} 
          activeCategoryId={activeCategoryId} 
          onSelect={setActiveCategoryId} 
        />
      </div>

      <main className="flex-1">
        <div className={`transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <DishGrid dishes={filteredDishes} />
        </div>
      </main>

      <CartSummary />
    </div>
  );
}

