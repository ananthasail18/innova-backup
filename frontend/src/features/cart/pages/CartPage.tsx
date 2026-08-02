import { useCart } from '@/shared/context/CartContext';
import { CartItem } from '@/shared/components/CartItem';
import { EmptyState } from '@/shared/components/EmptyState';
import { PriceTag } from '@/shared/components/PriceTag';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function CartPage() {
  const { items, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center p-4 bg-background/80 backdrop-blur border-b border-border gap-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-bold">Your Order ({totalItems})</h1>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4">
        {items.length === 0 ? (
          <EmptyState title="Your cart is empty" description="Add some delicious items from our menu!" />
        ) : (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
              {items.map((item) => (
                <CartItem key={item.dish.id} item={item} />
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-lg border-b border-border pb-2">Order Summary</h3>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <PriceTag price={totalPrice} />
              </div>
            </div>
            
            <p className="text-center text-muted-foreground text-sm pt-4">
              Checkout is not available in this stage.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
