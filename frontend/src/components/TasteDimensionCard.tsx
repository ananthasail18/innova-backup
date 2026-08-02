export function TasteDimensionCard({ 
  label, 
  value 
}: { 
  label: string; 
  value: number; 
}) {
  const percentage = Math.round(value * 100);
  const displayName = label.replace('_preference', '').replace('_level', '').replace(/^\w/, c => c.toUpperCase());

  return (
    <div className="bg-card border border-border p-4 rounded-2xl flex flex-col gap-2">
      <div className="flex justify-between items-center text-sm font-medium">
        <span>{displayName}</span>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
