import { useState } from 'react';
import { useCart } from '@/hooks/CartContext';
import { CartItem } from '@/components/CartItem';
import { PriceTag } from '@/components/PriceTag';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRestaurantContext } from '@/hooks/RestaurantContext';

export function CartPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { restaurant } = useRestaurantContext();
  const navigate = useNavigate();
  
  const [isOrderComplete, setIsOrderComplete] = useState(false);
  const [feedback, setFeedback] = useState('');

  const returnUrl = restaurant ? `/restaurant/${restaurant.slug}` : '/';

  if (isOrderComplete) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-4">
        <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md space-y-6 shadow-xl text-center">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-primary">Order Placed!</h2>
            <p className="text-muted-foreground">Thank you for dining with TasteAI.</p>
          </div>
          
          <div className="space-y-3 text-left">
             <label className="text-sm font-bold block">We'd love your feedback:</label>
             <textarea 
               className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
               rows={4}
               placeholder="How was your experience?"
               value={feedback}
               onChange={(e) => setFeedback(e.target.value)}
             />
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => {
                if (feedback) console.log("Feedback submitted:", feedback);
                clearCart();
                navigate(returnUrl);
              }}
              className="w-full py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Submit Feedback
            </button>
            <button
              onClick={() => {
                clearCart();
                navigate(returnUrl);
              }}
              className="w-full py-3 text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between p-4 bg-background/80 backdrop-blur border-b border-border">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold">Your Order Cart</h1>
        <div className="w-9" />
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full p-4 space-y-6">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
            <div className="p-4 bg-muted text-muted-foreground rounded-full">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground">Discover dishes tailored to your taste profile.</p>
            <button
              onClick={() => navigate(returnUrl)}
              className="px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-2xl hover:bg-primary/90 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem key={item.dish.id} item={item} />
              ))}
            </div>

            <div className="p-4 bg-card border border-border rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">Subtotal</span>
                <PriceTag price={totalPrice} />
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground">Taxes & Charges</span>
                <PriceTag price={totalPrice * 0.05} />
              </div>
              <div className="border-t border-border pt-3 flex justify-between items-center text-base font-bold">
                <span>Total Amount</span>
                <PriceTag price={totalPrice * 1.05} />
              </div>
            </div>

            <button
              onClick={() => {
                setIsOrderComplete(true);
              }}
              className="w-full py-4 bg-primary text-primary-foreground font-bold text-base rounded-2xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Confirm & Place Order
            </button>
          </>
        )}
      </main>
    </div>
  );
}
