import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/SessionContext';
import { useDishes, useDishRecommendation } from '@/services/queries';
import { useCart } from '@/hooks/CartContext';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ErrorState } from '@/components/ErrorState';
import { PriceTag } from '@/components/PriceTag';
import { VegIndicator } from '@/components/VegIndicator';
import { AvailabilityBadge } from '@/components/AvailabilityBadge';
import { ArrowLeft, Plus, Star } from 'lucide-react';
import { CartSummary } from '@/components/CartSummary';
import { RecommendationReasonList } from '@/components/RecommendationReasonList';

export function DishDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userId } = useSession();
  
  const { data: dishes, isLoading, isError, refetch } = useDishes();
  const { data: recommendation } = useDishRecommendation(userId, id!);
  const { addItem } = useCart();

  if (isLoading) return <LoadingSkeleton items={1} />;
  
  const dish = dishes?.find(d => d.id === id);
  if (isError || !dish) return <ErrorState message="Failed to load dish details." onRetry={refetch} />;

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
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full">
        <div className="w-full aspect-[4/3] sm:aspect-[16/9] bg-muted">
          {dish.image_url ? (
            <img 
              src={dish.image_url} 
              alt={dish.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
          )}
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">{dish.name}</h1>
              <VegIndicator isVegetarian={dish.is_vegetarian} />
            </div>

            {recommendation && (
              <div className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                <Star className="w-4 h-4 fill-current" />
                {Math.round(recommendation.score * 100)}% Match
              </div>
            )}
            
            <div className="text-2xl font-bold">
              <PriceTag price={dish.price} />
            </div>

            <AvailabilityBadge isAvailable={dish.is_available} />

            {dish.description && (
              <p className="text-muted-foreground text-lg leading-relaxed">
                {dish.description}
              </p>
            )}

            {recommendation && <RecommendationReasonList reasons={recommendation.reasons} />}

            {/* Flavor Profile */}
            <div className="space-y-4 pt-6 border-t border-border">
              <h3 className="text-lg font-bold text-foreground">Dish Flavor Profile</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Spice', value: dish.spice_level },
                  { label: 'Sweetness', value: dish.sweetness_level },
                  { label: 'Creaminess', value: dish.creaminess_level },
                  { label: 'Tanginess', value: dish.tanginess_level },
                  { label: 'Smokiness', value: dish.smokiness_level },
                  { label: 'Crunch', value: dish.crunchiness_level },
                  { label: 'Adventure', value: dish.adventure_level },
                  { label: 'Portion Size', value: dish.portion_size },
                ].map((dim) => {
                  const percentage = Math.round(dim.value * 100);
                  return (
                    <div key={dim.label} className="bg-card border border-border p-3.5 rounded-2xl flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <span>{dim.label}</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {((dish.ingredients && dish.ingredients.length > 0) || (dish.allergens && dish.allergens.length > 0) || (dish.dietary_tags && dish.dietary_tags.length > 0) || dish.chef_notes) && (
              <div className="space-y-6 pt-6 border-t border-border">
                
                {dish.ingredients && dish.ingredients.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm text-foreground">Ingredients</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {dish.ingredients.map(ing => (
                        <span key={ing} className="px-2.5 py-1 bg-muted/70 text-foreground border border-border/50 rounded-full text-xs font-medium">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {dish.allergens && dish.allergens.length > 0 && (
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-red-500">Allergens</h3>
                    <p className="text-muted-foreground text-sm">{dish.allergens.join(', ')}</p>
                  </div>
                )}
                
                {dish.dietary_tags && dish.dietary_tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dish.dietary_tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-muted text-muted-foreground rounded-md text-xs font-bold uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                )}
                
                {dish.chef_notes && (
                  <div className="space-y-1 bg-muted/50 p-4 rounded-xl border border-border">
                    <h3 className="font-bold text-sm text-foreground">Chef's Notes</h3>
                    <p className="text-muted-foreground text-sm italic">"{dish.chef_notes}"</p>
                  </div>
                )}

              </div>
            )}
          </div>
          
          <button
            disabled={!dish.is_available}
            onClick={() => addItem(dish)}
            className="w-full py-4 px-6 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add to Cart
          </button>
        </div>
      </main>
      
      <CartSummary />
    </div>
  );
}
