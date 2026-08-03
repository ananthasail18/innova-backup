import { useState } from 'react';
import type { Dish } from '@/services/types';
import { useSubmitFeedback } from '@/services/queries';
import { useSession } from '@/hooks/SessionContext';
import { X, Check, Star, AlertCircle, Sparkles } from 'lucide-react';

interface PostOrderFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  orderedDishes: Dish[];
}

interface DishFeedback {
  spice?: number;
  oiliness?: number;
  saltiness?: number;
}

export function PostOrderFeedback({ isOpen, onClose, orderedDishes }: PostOrderFeedbackProps) {
  const { userId } = useSession();
  const submitFeedback = useSubmitFeedback();
  const [selectedDishes, setSelectedDishes] = useState<Record<string, boolean>>({});
  const [feedbackDeltas, setFeedbackDeltas] = useState<Record<string, DishFeedback>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const toggleDishSelection = (dishId: string) => {
    setSelectedDishes((prev) => ({
      ...prev,
      [dishId]: !prev[dishId],
    }));
  };

  const handleDeltaChange = (dishId: string, dimension: keyof DishFeedback, delta: number) => {
    setFeedbackDeltas((prev) => {
      const dishFeedback = prev[dishId] || {};
      const currentVal = dishFeedback[dimension];
      
      // If user clicks the active option, toggle it off (reset to 0.0/undefined)
      const newVal = currentVal === delta ? undefined : delta;
      
      return {
        ...prev,
        [dishId]: {
          ...dishFeedback,
          [dimension]: newVal,
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    // Aggregate deltas across all checked dishes
    const mergedDeltas: Record<string, number> = {
      spice: 0,
      oiliness: 0,
      saltiness: 0,
    };

    const descriptions: string[] = [];

    orderedDishes.forEach((dish) => {
      if (selectedDishes[dish.id]) {
        const feedback = feedbackDeltas[dish.id] || {};
        const dishDesc: string[] = [];

        if (feedback.spice) {
          mergedDeltas.spice += feedback.spice;
          dishDesc.push(feedback.spice > 0 ? "Need More Spice" : "Too Spicy");
        }
        if (feedback.oiliness) {
          mergedDeltas.oiliness += feedback.oiliness;
          dishDesc.push(feedback.oiliness > 0 ? "Need More Oil" : "Too Oily");
        }
        if (feedback.saltiness) {
          mergedDeltas.saltiness += feedback.saltiness;
          dishDesc.push(feedback.saltiness > 0 ? "Need More Salt" : "Too Salty");
        }

        if (dishDesc.length > 0) {
          descriptions.push(`${dish.name} (${dishDesc.join(', ')})`);
        }
      }
    });

    // Remove zero delta keys so we only post changes
    const finalDeltas: Record<string, number> = {};
    Object.entries(mergedDeltas).forEach(([key, val]) => {
      if (val !== 0) {
        finalDeltas[key] = Math.max(-0.25, Math.min(0.25, val)); // Clamp aggregated changes
      }
    });

    submitFeedback.mutate(
      {
        user_id: userId,
        event_type: "RECOMMENDATION_FEEDBACK",
        dimension_deltas: finalDeltas,
        event_description: descriptions.length > 0 
          ? `Feedback on ordered dishes: ${descriptions.join('; ')}`
          : "Ordered meals matched expectation perfectly."
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-card/95 border border-border rounded-3xl p-6 md:p-8 shadow-2xl relative max-h-[85vh] overflow-y-auto flex flex-col space-y-6">
        
        {/* Close Button */}
        {!isSubmitted && (
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {isSubmitted ? (
          <div className="text-center py-8 space-y-4 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black tracking-tight">Feedback Received!</h2>
            <p className="text-sm text-muted-foreground max-w-sm">
              Thank you! We've adjusted your Taste DNA. Your recommendations and radar dashboard have been updated in real-time.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md"
            >
              Continue Browsing
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 fill-amber-500/20" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">How was your meal?</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Help us refine your Taste DNA. Select any dishes that deviated from your expectations to adjust your future recommendations.
              </p>
            </div>

            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
              {orderedDishes.map((dish) => {
                const isChecked = !!selectedDishes[dish.id];
                const feedback = feedbackDeltas[dish.id] || {};

                return (
                  <div 
                    key={dish.id} 
                    className={`border rounded-2xl p-4 transition-all duration-300 ${isChecked ? 'bg-muted/40 border-primary/40' : 'bg-card border-border hover:border-border/80'}`}
                  >
                    <div 
                      onClick={() => toggleDishSelection(dish.id)}
                      className="flex items-center gap-3 cursor-pointer select-none"
                    >
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/50'}`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="font-bold text-sm">{dish.name}</span>
                    </div>

                    {isChecked && (
                      <div className="mt-4 pt-4 border-t border-border/50 space-y-4 animate-fadeIn">
                        {/* Spice controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Spiciness:</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeltaChange(dish.id, 'spice', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.spice === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >
                              🌶️ Too Spicy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeltaChange(dish.id, 'spice', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.spice === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >
                              Need More Spice
                            </button>
                          </div>
                        </div>

                        {/* Oiliness controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Oiliness:</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeltaChange(dish.id, 'oiliness', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.oiliness === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >
                              💧 Too Oily
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeltaChange(dish.id, 'oiliness', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.oiliness === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >
                              Too Dry
                            </button>
                          </div>
                        </div>

                        {/* Saltiness controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Saltiness:</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeltaChange(dish.id, 'saltiness', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.saltiness === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >
                              🧂 Too Salty
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeltaChange(dish.id, 'saltiness', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.saltiness === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >
                              Bland / Need Salt
                            </button>
                          </div>
                        </div>

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

            <div className="flex gap-4 pt-2">
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
                className="flex-1 p-3 bg-primary text-primary-foreground text-sm font-bold rounded-xl hover:bg-primary/95 transition-all shadow-md disabled:opacity-50 flex items-center justify-center"
              >
                {submitFeedback.isPending ? "Submitting..." : "Submit Feedback"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
