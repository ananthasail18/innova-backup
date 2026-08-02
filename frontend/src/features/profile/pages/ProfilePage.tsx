import { useNavigate } from 'react-router-dom';
import { useSession } from '@/shared/context/SessionContext';
import { useUser, useTasteProfile } from '@/shared/services/queries';
import { ProfileSummary } from '../components/ProfileSummary';
import { TasteDimensionCard } from '../components/TasteDimensionCard';
import { TasteProfileSkeleton } from '../components/TasteProfileSkeleton';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { ErrorState } from '@/shared/components/ErrorState';

export function ProfilePage() {
  const { userId, setUserId } = useSession();
  const navigate = useNavigate();

  const { data: user, isLoading: loadingUser, isError: errorUser } = useUser(userId);
  const { data: profile, isLoading: loadingProfile, isError: errorProfile } = useTasteProfile(userId);

  if (loadingUser || loadingProfile) {
    return <TasteProfileSkeleton />;
  }

  if (errorUser || errorProfile || !user || !profile) {
    return (
      <div className="min-h-screen pt-20">
        <ErrorState 
          message="Could not load your Taste Identity. Your session may have expired." 
          onRetry={() => {
            setUserId(null);
            navigate('/');
          }} 
        />
      </div>
    );
  }

  const dimensions = [
    { label: 'spice', value: profile.spice_preference },
    { label: 'sweetness', value: profile.sweetness_preference },
    { label: 'creaminess', value: profile.creaminess_preference },
    { label: 'tanginess', value: profile.tanginess_preference },
    { label: 'smokiness', value: profile.smokiness_preference },
    { label: 'crunch', value: profile.crunch_preference },
    { label: 'adventure', value: profile.adventure_level },
    { label: 'portion', value: profile.portion_preference }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center p-4 bg-background/80 backdrop-blur border-b border-border">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold ml-2">Taste Identity</h1>
      </div>

      <main className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-8">
        <ProfileSummary user={user} profile={profile} />
        
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Your Flavor Vectors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dimensions.map((dim) => (
              <TasteDimensionCard key={dim.label} label={dim.label} value={dim.value} />
            ))}
          </div>
        </div>

        <div className="pt-8">
          <button
            onClick={() => navigate('/quiz')}
            className="w-full py-4 px-6 bg-muted text-foreground font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Taste Quiz
          </button>
        </div>
      </main>
    </div>
  );
}
