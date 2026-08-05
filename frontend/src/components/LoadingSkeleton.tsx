export function LoadingSkeleton({ items = 4 }: { items?: number }) {
  return (
    <div className="grid grid-cols-1 @sm:grid-cols-2 @md:grid-cols-3 @lg:grid-cols-4 gap-6 p-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3 p-4 border rounded-2xl animate-pulse bg-card">
          <div className="w-full aspect-[4/3] bg-muted rounded-xl" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
