import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/shared/context/SessionContext';
import { useCreateUser, useRestaurant, useUser, useTasteProfile } from '@/shared/services/queries';
import { ErrorState } from '@/shared/components/ErrorState';

export function LandingPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useSession();
  const createUser = useCreateUser();
  const { data: restaurant, isLoading, isError, refetch } = useRestaurant();

  const { data: user, isError: userError } = useUser(userId);
  const { data: profile, isError: profileError } = useTasteProfile(userId);

  // If user already exists in DB and has a profile, skip onboarding and go straight to restaurant
  useEffect(() => {
    if (userError) {
      setUserId(null); // Invalid session, clear it
    } else if (userId && user && restaurant) {
      if (profile) {
        navigate(`/restaurant/${restaurant.id}`);
      } else if (profileError) {
        // User exists but has no profile, must have dropped off during quiz
        navigate('/quiz');
      }
    }
  }, [userId, user, userError, profile, profileError, restaurant, navigate, setUserId]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || !restaurant) {
    return <ErrorState message="Failed to load restaurant information." onRetry={refetch} />;
  }

  const handleGetStarted = () => {
    createUser.mutate(
      { name: 'Guest' },
      {
        onSuccess: (user) => {
          setUserId(user.id);
          navigate('/quiz');
        },
      }
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex-1 flex flex-col justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 w-full max-w-2xl mx-auto p-6 md:p-10 text-center text-white space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              {restaurant.name}
            </h1>
            <p className="text-xl md:text-2xl text-white/90">
              Discover your perfect dish.
            </p>
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
