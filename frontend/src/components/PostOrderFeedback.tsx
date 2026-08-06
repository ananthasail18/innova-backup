import { useState } from 'react';
import type { Dish } from '@/services/types';
import { useSubmitFeedback, useLikeDish } from '@/services/queries';
import { useSession } from '@/hooks/SessionContext';
import { X, Star, AlertCircle, Sparkles, History, ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';

interface PostOrderFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  orderedDishes: Dish[];
}

interface DishFeedback {
  spice?: number;
  sweetness?: number;
  creaminess?: number;
  tanginess?: number;
  masala_intensity?: number;
  crunchiness?: number;
  oiliness?: number;
  saltiness?: number;
}

const DIMENSIONS: { key: keyof DishFeedback; label: string; less: string; more: string; lessEmoji: string; moreEmoji: string }[] = [
  { key: 'spice',           label: 'Spiciness',   less: 'Too Spicy',       more: 'Need More Spice',   lessEmoji: '🌶️', moreEmoji: '🔥' },
  { key: 'sweetness',       label: 'Sweetness',   less: 'Too Sweet',       more: 'Need Sweetness',    lessEmoji: '🍬', moreEmoji: '🍯' },
  { key: 'creaminess',      label: 'Creaminess',  less: 'Too Rich',        more: 'Need More Cream',   lessEmoji: '🥛', moreEmoji: '🧈' },
  { key: 'tanginess',       label: 'Tanginess',   less: 'Too Tangy',       more: 'Need More Tang',    lessEmoji: '🍋', moreEmoji: '🫙' },
  { key: 'masala_intensity',label: 'Masala',      less: 'Too Much Masala', more: 'Need More Masala',  lessEmoji: '🌿', moreEmoji: '🫚' },
  { key: 'crunchiness',     label: 'Crunchiness', less: 'Too Hard',        more: 'Need More Crunch',  lessEmoji: '💥', moreEmoji: '🥨' },
  { key: 'oiliness',        label: 'Oiliness',    less: 'Too Oily',        more: 'Too Dry',           lessEmoji: '💧', moreEmoji: '🏜️' },
  { key: 'saltiness',       label: 'Saltiness',   less: 'Too Salty',       more: 'Bland / Need Salt', lessEmoji: '🧂', moreEmoji: '🫙' },
];

export function PostOrderFeedback({ isOpen, onClose, orderedDishes }: PostOrderFeedbackProps) {
  const { userId } = useSession();
  const submitFeedback = useSubmitFeedback();
  const likeDish = useLikeDish();

  // liked: true = thumbs up, null = no choice
  const [likedDishes, setLikedDishes] = useState<Record<string, boolean | null>>({});
  // which dishes have "Suggest Improvement" expanded
  const [expandedDishes, setExpandedDishes] = useState<Record<string, boolean>>({});
  const [feedbackDeltas, setFeedbackDeltas] = useState<Record<string, DishFeedback>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<any>(null);

  if (!isOpen) return null;

  const toggleExpanded = (dishId: string) => {
    setExpandedDishes(prev => ({ ...prev, [dishId]: !prev[dishId] }));
  };

  const toggleLike = (dishId: string) => {
    setLikedDishes(prev => ({ ...prev, [dishId]: prev[dishId] === true ? null : true }));
  };

  const handleDeltaChange = (dishId: string, dimension: keyof DishFeedback, delta: number) => {
    setFeedbackDeltas(prev => {
      const curr = prev[dishId] || {};
      return { ...prev, [dishId]: { ...curr, [dimension]: curr[dimension] === delta ? undefined : delta } };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // Submit likes as community signals
    orderedDishes.forEach((dish) => {
      if (likedDishes[dish.id] !== null && likedDishes[dish.id] !== undefined) {
        likeDish.mutate({
          user_id: userId,
          dish_id: dish.id,
          liked: likedDishes[dish.id] as boolean,
          would_reorder: likedDishes[dish.id] as boolean,
        });
      }
    });

    // Aggregate dimension deltas from expanded dishes
    const mergedDeltas: Record<string, number> = {};
    const descriptions: string[] = [];

    orderedDishes.forEach((dish) => {
      if (!expandedDishes[dish.id]) return;
      const fb = feedbackDeltas[dish.id] || {};
      const dishDesc: string[] = [];
      DIMENSIONS.forEach(({ key, less, more }) => {
        const val = fb[key];
        if (val !== undefined) {
          mergedDeltas[key] = (mergedDeltas[key] || 0) + val;
          dishDesc.push(val < 0 ? less : more);
        }
      });
      if (dishDesc.length > 0) descriptions.push(`${dish.name} (${dishDesc.join(', ')})`);
    });

    // Clamp aggregated changes
    const finalDeltas: Record<string, number> = {};
    Object.entries(mergedDeltas).forEach(([k, v]) => {
      if (v !== 0) finalDeltas[k] = Math.max(-0.25, Math.min(0.25, v));
    });

    submitFeedback.mutate(
      {
        user_id: userId,
        event_type: 'RECOMMENDATION_FEEDBACK',
        dimension_deltas: finalDeltas,
        event_description: descriptions.length > 0
          ? `Feedback: ${descriptions.join('; ')}`
          : 'Meal matched expectations.',
      },
      {
        onSuccess: (data) => {
          setUpdatedProfile(data);
          setIsSubmitted(true);
        },
      }
    );
  };

  const getRecentEvolution = () => {
    if (!updatedProfile?.dna_matrix) return null;
    const matrix = typeof updatedProfile.dna_matrix === 'string'
      ? JSON.parse(updatedProfile.dna_matrix)
      : updatedProfile.dna_matrix;
    return matrix.recent_evolution?.[0] ?? null;
  };

  const recentEvent = getRecentEvolution();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card/95 border border-border rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto flex flex-col space-y-6">

        {/* Close Button */}
        {!isSubmitted && (
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}

        {isSubmitted ? (
          <div className="text-center py-6 space-y-6 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-primary/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight">Taste DNA Updated!</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Thank you for the feedback. Your profile has dynamically adapted.
              </p>
            </div>
            {recentEvent && (
              <div className="w-full bg-muted/40 border border-primary/30 rounded-2xl p-5 text-left space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                <div className="flex items-center gap-2 text-primary font-bold">
                  <History className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-wider">Evolution Log</span>
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="text-xs font-semibold text-foreground">{recentEvent.event}</p>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">{recentEvent.description}</p>
                </div>
              </div>
            )}
            <button
              onClick={onClose}
              className="mt-6 w-full py-3.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md active:scale-95"
            >
              Close & Browse
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Header */}
            <div className="space-y-1.5 text-center">
              <div className="w-11 h-11 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 fill-amber-500/20" />
              </div>
              <h2 className="text-xl font-black tracking-tight">How was your meal?</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                👍 dishes you loved, or tap <span className="text-primary font-semibold">Suggest Improvement</span> to help us refine your Taste DNA.
              </p>
            </div>

            {/* Dish list */}
            <div className="space-y-3 max-h-[52vh] overflow-y-auto pr-1 no-scrollbar">
              {orderedDishes.map((dish) => {
                const likeState = likedDishes[dish.id];
                const isExpanded = !!expandedDishes[dish.id];
                const feedback = feedbackDeltas[dish.id] || {};

                return (
                  <div
                    key={dish.id}
                    className={`border rounded-2xl p-3.5 transition-all duration-300 ${isExpanded ? 'bg-muted/30 border-primary/30' : 'bg-card border-border'}`}
                  >
                    {/* Row: dish name | 👍 | Suggest Improvement */}
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm flex-1 truncate">{dish.name}</span>

                      {/* Thumbs up */}
                      <button
                        type="button"
                        onClick={() => toggleLike(dish.id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                          likeState === true
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                            : 'border-border text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-400'
                        }`}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                        {likeState === true && <span>Liked</span>}
                      </button>

                      {/* Suggest Improvement toggle */}
                      <button
                        type="button"
                        onClick={() => toggleExpanded(dish.id)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 ${
                          isExpanded
                            ? 'bg-primary/10 border-primary/40 text-primary'
                            : 'border-border text-muted-foreground hover:border-primary/30 hover:text-primary'
                        }`}
                      >
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        <span>Suggest Improvement</span>
                      </button>
                    </div>

                    {/* Expandable dimension sliders */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-border/50 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                        {DIMENSIONS.map(({ key, label, less, more, lessEmoji, moreEmoji }) => (
                          <div key={key} className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-muted-foreground w-20 shrink-0">{label}</span>
                            <div className="flex gap-1.5 flex-wrap justify-end">
                              <button
                                type="button"
                                onClick={() => handleDeltaChange(dish.id, key, -0.10)}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                                  feedback[key] === -0.10
                                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                                    : 'bg-muted/20 border-border text-muted-foreground hover:bg-muted/40'
                                }`}
                              >
                                {lessEmoji} {less}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeltaChange(dish.id, key, 0.10)}
                                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all border ${
                                  feedback[key] === 0.10
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                    : 'bg-muted/20 border-border text-muted-foreground hover:bg-muted/40'
                                }`}
                              >
                                {moreEmoji} {more}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {submitFeedback.isError && (
              <div className="w-full flex gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs items-start">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Failed to save feedback. Please try again.</span>
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={submitFeedback.isPending}
                className="flex-1 p-3 border border-border text-sm font-bold rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
              >
                Skip
              </button>
              <button
                type="submit"
                disabled={submitFeedback.isPending}
                className="flex-1 p-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitFeedback.isPending ? 'Submitting…' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
