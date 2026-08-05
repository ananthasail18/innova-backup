import { useState } from 'react';
import type { Dish } from '@/services/types';
import { useSubmitFeedback } from '@/services/queries';
import { useSession } from '@/hooks/SessionContext';
import { X, Check, Star, AlertCircle, Sparkles, History } from 'lucide-react';

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

export function PostOrderFeedback({ isOpen, onClose, orderedDishes }: PostOrderFeedbackProps) {
  const { userId } = useSession();
  const submitFeedback = useSubmitFeedback();
  const [selectedDishes, setSelectedDishes] = useState<Record<string, boolean>>({});
  const [feedbackDeltas, setFeedbackDeltas] = useState<Record<string, DishFeedback>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [updatedProfile, setUpdatedProfile] = useState<any>(null);

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
      sweetness: 0,
      creaminess: 0,
      tanginess: 0,
      masala_intensity: 0,
      crunchiness: 0,
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
        if (feedback.sweetness) {
          mergedDeltas.sweetness += feedback.sweetness;
          dishDesc.push(feedback.sweetness > 0 ? "Need More Sweetness" : "Too Sweet");
        }
        if (feedback.creaminess) {
          mergedDeltas.creaminess += feedback.creaminess;
          dishDesc.push(feedback.creaminess > 0 ? "Need More Creaminess" : "Too Rich");
        }
        if (feedback.tanginess) {
          mergedDeltas.tanginess += feedback.tanginess;
          dishDesc.push(feedback.tanginess > 0 ? "Need More Tang" : "Too Sour/Tangy");
        }
        if (feedback.masala_intensity) {
          mergedDeltas.masala_intensity += feedback.masala_intensity;
          dishDesc.push(feedback.masala_intensity > 0 ? "Need More Masala" : "Overpowering Masala");
        }
        if (feedback.crunchiness) {
          mergedDeltas.crunchiness += feedback.crunchiness;
          dishDesc.push(feedback.crunchiness > 0 ? "Need More Crunch" : "Too Hard");
        }
        if (feedback.oiliness) {
          mergedDeltas.oiliness += feedback.oiliness;
          dishDesc.push(feedback.oiliness > 0 ? "Too Dry" : "Too Oily");
        }
        if (feedback.saltiness) {
          mergedDeltas.saltiness += feedback.saltiness;
          dishDesc.push(feedback.saltiness > 0 ? "Need Salt" : "Too Salty");
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
        onSuccess: (data) => {
          setUpdatedProfile(data);
          setIsSubmitted(true);
        },
      }
    );
  };

  const getRecentEvolution = () => {
    if (!updatedProfile || !updatedProfile.dna_matrix) return null;
    const matrix = typeof updatedProfile.dna_matrix === 'string' 
      ? JSON.parse(updatedProfile.dna_matrix) 
      : updatedProfile.dna_matrix;
      
    if (matrix.recent_evolution && matrix.recent_evolution.length > 0) {
      return matrix.recent_evolution[0]; // Get the latest change
    }
    return null;
  };

  const recentEvent = getRecentEvolution();

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
          <div className="text-center py-6 space-y-6 flex flex-col items-center animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-primary/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight">Taste DNA Updated!</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Thank you for the feedback. Your continuous learning profile has dynamically adapted.
              </p>
            </div>
            
            {/* Taste DNA Update History Preview */}
            {recentEvent && (
              <div className="w-full bg-muted/40 border border-primary/30 rounded-2xl p-5 mt-4 text-left space-y-3 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full" />
                <div className="flex items-center gap-2 text-primary font-bold">
                  <History className="w-4 h-4" />
                  <span className="text-sm uppercase tracking-wider">Evolution Log</span>
                </div>
                <div className="space-y-1 relative z-10">
                  <p className="text-xs font-semibold text-foreground">{recentEvent.event}</p>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    {recentEvent.description}
                  </p>
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-center">
              <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Star className="w-6 h-6 fill-amber-500/20" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">How was your meal?</h2>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Help us refine your Taste DNA. Select any dishes that deviated from your expectations across any of our 8 dimensions.
              </p>
            </div>

            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
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
                        {/* 1. Spiciness */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Spiciness:</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'spice', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.spice === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >🌶️ Too Spicy</button>
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'spice', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.spice === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >Need More Spice</button>
                          </div>
                        </div>

                        {/* 2. Sweetness */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Sweetness:</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'sweetness', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.sweetness === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >🍬 Too Sweet</button>
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'sweetness', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.sweetness === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >Need Sweetness</button>
                          </div>
                        </div>

                        {/* 3. Creaminess */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Creaminess:</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'creaminess', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.creaminess === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >🥛 Too Rich</button>
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'creaminess', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.creaminess === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >Need More Cream</button>
                          </div>
                        </div>

                        {/* 4. Tanginess */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Tanginess:</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'tanginess', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.tanginess === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >🍋 Too Sour/Tangy</button>
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'tanginess', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.tanginess === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >Need More Tang</button>
                          </div>
                        </div>

                        {/* 5. Masala Intensity */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Masala:</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'masala_intensity', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.masala_intensity === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >🌿 Too Much Masala</button>
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'masala_intensity', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.masala_intensity === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >Need More Masala</button>
                          </div>
                        </div>

                        {/* 6. Crunchiness */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Crunchiness:</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'crunchiness', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.crunchiness === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >💥 Too Hard</button>
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'crunchiness', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.crunchiness === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >Need More Crunch</button>
                          </div>
                        </div>

                        {/* 7. Oiliness */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Oiliness:</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'oiliness', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.oiliness === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >💧 Too Oily</button>
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'oiliness', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.oiliness === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >Too Dry</button>
                          </div>
                        </div>

                        {/* 8. Saltiness */}
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-muted-foreground">Saltiness:</span>
                          <div className="flex gap-2">
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'saltiness', -0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.saltiness === -0.10 ? 'bg-red-500/10 text-red-500 border-red-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >🧂 Too Salty</button>
                            <button type="button" onClick={() => handleDeltaChange(dish.id, 'saltiness', 0.10)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all border ${feedback.saltiness === 0.10 ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-muted/30 border-border hover:bg-muted/50'}`}
                            >Bland / Need Salt</button>
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
