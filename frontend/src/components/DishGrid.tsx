import type { Dish } from '@/services/types';
import { DishCard } from '@/components/DishCard';
import { EmptyState } from '@/components/EmptyState';

export function DishGrid({ dishes }: { dishes: Dish[] }) {
  if (dishes.length === 0) {
    return <EmptyState title="No dishes available" description="This category seems to be empty." />;
  }

  return (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 p-4 md:p-8">
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
}
