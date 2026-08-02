import { AlertCircle } from 'lucide-react';

export function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-6 text-center space-y-4">
      <div className="p-4 bg-red-100 text-red-600 rounded-full">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">Oops!</h3>
      <p className="text-muted-foreground max-w-sm">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="mt-4 px-6 py-2 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
        >
          Start Over
        </button>
      )}
    </div>
  );
}
