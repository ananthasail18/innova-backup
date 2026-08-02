export function PriceTag({ price }: { price: number }) {
  return (
    <span className="font-semibold text-foreground">
      ₹{Number(price).toFixed(2)}
    </span>
  );
}
