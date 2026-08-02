export function ProgressIndicator({ current, total }: { current: number; total: number }) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground font-medium">
        <span>Question {current} of {total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
