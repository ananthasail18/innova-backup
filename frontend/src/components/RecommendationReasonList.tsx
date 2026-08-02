import type { RecommendationReason } from '@/services/types';
import { CheckCircle2 } from 'lucide-react';

export function RecommendationReasonList({ reasons }: { reasons: RecommendationReason[] }) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl space-y-2">
      <div className="flex items-center gap-2 text-primary font-bold text-sm">
        <CheckCircle2 className="w-4 h-4" />
        <span>Why we recommend this</span>
      </div>
      <ul className="space-y-1 pl-6 list-disc text-xs text-muted-foreground">
        {reasons.map((r, idx) => (
          <li key={idx}>{r.text}</li>
        ))}
      </ul>
    </div>
  );
}
