import React from 'react';
import { Sparkles } from 'lucide-react';

interface ZomatoDishBadgeProps {
  matchPercentage: number;
  reason?: string;
  size?: 'sm' | 'md';
}

export const ZomatoDishBadge: React.FC<ZomatoDishBadgeProps> = ({ 
  matchPercentage, 
  reason,
  size = 'md' 
}) => {
  const getBadgeStyle = (score: number) => {
    if (score >= 88) {
      return 'bg-gradient-to-r from-emerald-950/90 to-teal-900/90 text-emerald-400 border-emerald-500/50 shadow-emerald-950/50';
    }
    if (score >= 70) {
      return 'bg-gradient-to-r from-amber-950/90 to-orange-900/90 text-amber-400 border-amber-500/50 shadow-amber-950/50';
    }
    return 'bg-neutral-900/90 text-neutral-400 border-neutral-700/50';
  };

  const isSmall = size === 'sm';

  return (
    <div className="flex flex-col items-start gap-1">
      <div 
        className={`inline-flex items-center gap-1.5 rounded-full font-bold border backdrop-blur-md shadow-md transition-all ${
          isSmall ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        } ${getBadgeStyle(matchPercentage)}`}
      >
        <Sparkles className={`animate-spin-slow ${isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-orange-400`} />
        <span>{matchPercentage}% Taste DNA Match</span>
      </div>
      
      {reason && (
        <span className="text-[11px] text-neutral-400 italic pl-1">
          💡 {reason}
        </span>
      )}
    </div>
  );
};
