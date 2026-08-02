import type { User, TasteProfile } from '@/shared/types';
import { Target } from 'lucide-react';

export function ProfileSummary({ 
  user, 
  profile 
}: { 
  user: User; 
  profile: TasteProfile; 
}) {
  const confidencePercent = Math.round(profile.confidence_score * 100);

  return (
    <div className="bg-primary text-primary-foreground p-6 md:p-8 rounded-3xl space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Hi, {user.name}!</h2>
        <p className="opacity-90 text-lg mt-1">Here is your unique Taste Identity.</p>
      </div>
      
      <div className="flex items-center gap-3 pt-4 border-t border-primary-foreground/20">
        <div className="p-2 bg-primary-foreground text-primary rounded-full">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <div className="text-sm opacity-90 font-medium">Confidence Score</div>
          <div className="font-bold text-xl">{confidencePercent}% Profile Accuracy</div>
        </div>
      </div>
    </div>
  );
}
