export function PriceTag({ price, currency = '₹' }: { price: number; currency?: string }) {
  return <span className="font-semibold text-foreground">{currency}{price.toFixed(2)}</span>;
}
