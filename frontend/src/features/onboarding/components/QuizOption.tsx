export function QuizOption({ 
  label, 
  isSelected, 
  onClick 
}: { 
  label: string; 
  isSelected: boolean; 
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
        isSelected 
          ? 'border-primary bg-primary/10 font-semibold' 
          : 'border-muted bg-card hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      {label}
    </button>
  );
}
