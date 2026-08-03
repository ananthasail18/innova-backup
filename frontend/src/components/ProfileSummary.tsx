import type { User, TasteProfile } from '@/services/types';
import { User as UserIcon, Sparkles } from 'lucide-react';

export function ProfileSummary({ user, profile }: { user: User; profile: TasteProfile }) {
  return (
    <div className="bg-card border border-border p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
          <UserIcon className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email || 'Guest User'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
        <Sparkles className="w-4 h-4" />
        <span>Taste DNA Confidence: {Math.round(profile.confidence_score * 100)}%</span>
      </div>
    </div>
  );
}
