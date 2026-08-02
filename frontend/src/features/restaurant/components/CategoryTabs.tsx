import type { Category } from '@/shared/types';

export function CategoryTabs({ 
  categories, 
  activeCategoryId, 
  onSelect 
}: { 
  categories: Category[]; 
  activeCategoryId: string | null; 
  onSelect: (id: string | null) => void;
}) {
  return (
    <div className="w-full overflow-x-auto scrollbar-hide border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="flex px-4 py-3 gap-2 min-w-max max-w-5xl mx-auto">
        <button
          onClick={() => onSelect(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
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
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategoryId === cat.id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
