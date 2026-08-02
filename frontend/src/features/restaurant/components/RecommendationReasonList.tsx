import type { RecommendationReason } from '@/shared/types';
import { CheckCircle2 } from 'lucide-react';

export function RecommendationReasonList({ reasons }: { reasons: RecommendationReason[] }) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl space-y-3">
      <h4 className="font-bold text-primary flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5" />
        Why we recommend this
      </h4>
      <ul className="space-y-2">
        {reasons.map((reason, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            <span className="text-foreground/90">{reason.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
