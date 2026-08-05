import type { RecommendationReason } from '@/services/types';
import { Check } from 'lucide-react';

export function RecommendationReasonList({ reasons }: { reasons: RecommendationReason[] }) {
  if (!reasons || reasons.length === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl space-y-3">
      <div className="text-sm font-bold text-foreground">
        Because:
      </div>
      <ul className="space-y-2 text-sm font-medium text-muted-foreground">
        {reasons.map((r, idx) => (
          <li key={idx} className="flex items-center gap-2">
            <span className="text-emerald-500 font-extrabold text-base">✔</span>
            <span className="text-white">{r.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
