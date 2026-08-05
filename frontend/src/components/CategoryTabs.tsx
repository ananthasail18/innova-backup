import type { Category } from '@/services/types';

interface CategoryTabsProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelect: (categoryId: string | null) => void;
}

export function CategoryTabs({ categories, activeCategoryId, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto px-4 @md:px-8 py-3 scrollbar-none bg-background border-b border-border w-full">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 text-sm font-bold rounded-full whitespace-nowrap transition-colors ${
          activeCategoryId === null
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:bg-muted/80'
        }`}
      >
        All
      </button>
      
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 text-sm font-bold rounded-full whitespace-nowrap transition-colors ${
            activeCategoryId === cat.id
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
