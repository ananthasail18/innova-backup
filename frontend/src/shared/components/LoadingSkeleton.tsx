export function LoadingSkeleton({ items = 6 }: { items?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-muted bg-card overflow-hidden shadow-sm animate-pulse">
          <div className="w-full aspect-[4/3] bg-muted/60" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-muted/60 rounded-md w-3/4" />
            <div className="h-4 bg-muted/60 rounded-md w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
