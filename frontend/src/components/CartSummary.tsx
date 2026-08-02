import { useCart } from '@/hooks/CartContext';
import { PriceTag } from '@/components/PriceTag';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CartSummary() {
  const { totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
      <div className="bg-primary text-primary-foreground p-4 rounded-2xl shadow-xl flex items-center justify-between border border-primary/20 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-foreground/10 rounded-xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-medium opacity-90">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
            <p className="font-bold text-sm">
              <PriceTag price={totalPrice} />
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate('/cart')}
          className="flex items-center gap-1.5 bg-primary-foreground text-primary px-4 py-2 rounded-xl font-bold text-sm hover:bg-primary-foreground/90 transition-colors"
        >
          <span>View Cart</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
