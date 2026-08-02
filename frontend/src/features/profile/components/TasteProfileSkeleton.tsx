export function TasteProfileSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 md:p-8 max-w-3xl mx-auto w-full space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-muted rounded-3xl h-40 w-full" />
        
        {/* Dimensions Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-muted border border-border p-4 rounded-2xl h-16" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
