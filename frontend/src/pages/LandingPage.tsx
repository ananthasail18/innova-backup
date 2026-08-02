import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/SessionContext';
import { useCreateUser, useTasteProfile } from '@/services/queries';
import { ErrorState } from '@/components/ErrorState';
import { Sparkles, UtensilsCrossed } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const { userId, setUserId } = useSession();
  const createUser = useCreateUser();
  const { data: tasteProfile, isLoading: isProfileLoading, isError: isProfileError } = useTasteProfile(userId);

  useEffect(() => {
    if (!userId && !createUser.isPending && !createUser.isSuccess && !createUser.isError) {
      createUser.mutate(
        { name: 'Guest' },
        {
          onSuccess: (user) => {
            setUserId(user.id);
          },
        }
      );
    }
  }, [userId, createUser, setUserId]);

  const handleStart = () => {
    if (tasteProfile?.onboarding_completed) {
      navigate('/restaurant');
    } else {
      navigate('/quiz');
    }
  };

  const handleReset = () => {
    setUserId(null);
    window.location.reload();
  };

  if (createUser.isError || isProfileError) {
    return <ErrorState message="Failed to initialize session. Click below to start over." onRetry={handleReset} />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-6 text-center">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 text-primary rounded-3xl mb-2">
            <UtensilsCrossed className="w-12 h-12" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Taste<span className="text-primary">AI</span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Your personalized AI dining assistant that curates menu recommendations tailored strictly to your taste vectors.
          </p>
        </div>

        <button
          onClick={handleStart}
          disabled={createUser.isPending || isProfileLoading}
          className="w-full py-4 px-6 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Sparkles className="w-5 h-5" />
          <span>{tasteProfile?.onboarding_completed ? 'View Menu & Recommendations' : 'Take Taste Identity Quiz'}</span>
        </button>
      </div>
    </div>
  );
}
