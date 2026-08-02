import { useCart } from '@/shared/context/CartContext';
import { PriceTag } from './PriceTag';
import { useNavigate } from 'react-router-dom';

export function CartSummary() {
  const { totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border shadow-lg sm:relative sm:border-t-0 sm:shadow-none sm:p-0">
      <div className="max-w-md mx-auto sm:max-w-none bg-primary text-primary-foreground rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-primary/90 transition-colors" onClick={() => navigate('/cart')}>
        <div className="flex flex-col">
          <span className="text-sm font-medium opacity-90">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
          <span className="text-lg font-bold"><PriceTag price={totalPrice} /></span>
        </div>
        <div className="font-semibold text-lg flex items-center gap-2">
          View Cart →
        </div>
      </div>
    </div>
  );
}
