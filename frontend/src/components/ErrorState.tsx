import { AlertCircle } from 'lucide-react';

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
      <div className="p-3 bg-red-500/10 text-red-500 rounded-full">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold">Oops!</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-full hover:bg-primary/90 transition-colors"
        >
          Start Over
        </button>
      )}
    </div>
  );
}
