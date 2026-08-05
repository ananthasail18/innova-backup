export function TasteProfileSkeleton() {
  return (
    <div className="p-4 max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-24 bg-card rounded-2xl border border-border" />
      <div className="grid grid-cols-1 @sm:grid-cols-2 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-16 bg-card rounded-2xl border border-border" />
        ))}
      </div>
    </div>
  );
}
