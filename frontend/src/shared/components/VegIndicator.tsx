import { Leaf, Drumstick } from 'lucide-react';

export function VegIndicator({ isVegetarian }: { isVegetarian: boolean }) {
  if (isVegetarian) {
    return (
      <div className="flex items-center gap-1 text-green-600 border border-green-600 rounded-sm px-1 text-[10px] font-bold uppercase">
        <Leaf className="w-3 h-3" />
        <span>Veg</span>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1 text-red-600 border border-red-600 rounded-sm px-1 text-[10px] font-bold uppercase">
      <Drumstick className="w-3 h-3" />
      <span>Non-Veg</span>
    </div>
  );
}
