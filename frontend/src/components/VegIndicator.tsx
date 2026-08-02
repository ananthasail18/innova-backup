export function VegIndicator({ isVegetarian }: { isVegetarian: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center border text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
        isVegetarian
          ? 'border-green-600 text-green-500 bg-green-950/30'
          : 'border-red-600 text-red-500 bg-red-950/30'
      }`}
    >
      {isVegetarian ? 'VEG' : 'NON-VEG'}
    </span>
  );
}
