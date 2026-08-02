import type { CartItem as CartItemType } from '@/shared/types';
import { useCart } from '@/shared/context/CartContext';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { PriceTag } from './PriceTag';

export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity } = useCart();
  const { dish, quantity } = item;

  return (
    <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        {dish.image_url && (
          <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-foreground truncate">{dish.name}</h4>
        <div className="mt-1">
          <PriceTag price={dish.price} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1 border border-border">
          <button 
            onClick={() => updateQuantity(dish.id, quantity - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors"
          >
            {quantity === 1 ? <Trash2 className="w-4 h-4 text-red-500" /> : <Minus className="w-4 h-4" />}
          </button>
          <span className="font-medium text-sm w-4 text-center">{quantity}</span>
          <button 
            onClick={() => updateQuantity(dish.id, quantity + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
