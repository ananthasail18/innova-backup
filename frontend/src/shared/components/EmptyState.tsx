import { UtensilsCrossed } from 'lucide-react';

export function EmptyState({ title = "No items found", description = "Try adjusting your filters." }: { title?: string; description?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-6 text-center space-y-4">
      <div className="p-4 bg-muted text-muted-foreground rounded-full">
        <UtensilsCrossed className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
