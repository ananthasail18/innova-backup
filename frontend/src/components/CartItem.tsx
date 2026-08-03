import type { CartItem as CartItemType } from '@/services/types';
import { PriceTag } from '@/components/PriceTag';
import { VegIndicator } from '@/components/VegIndicator';
import { useCart } from '@/hooks/CartContext';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { DishImage } from '@/components/DishImage';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
          <DishImage src={item.dish.image_url} alt={item.dish.name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm truncate">{item.dish.name}</h4>
            <VegIndicator isVegetarian={item.dish.is_vegetarian} />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            <PriceTag price={item.dish.price} /> each
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center bg-muted rounded-full p-1 border border-border">
          <button
            onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
            className="p-1 hover:bg-background rounded-full transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
            className="p-1 hover:bg-background rounded-full transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
        <button
          onClick={() => removeItem(item.dish.id)}
          className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
