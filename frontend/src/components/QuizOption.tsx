interface QuizOptionProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function QuizOption({ id, text, isSelected, onSelect }: QuizOptionProps) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`w-full p-4 text-left font-semibold rounded-2xl border transition-all ${
        isSelected
          ? 'bg-primary/10 border-primary text-primary shadow-sm'
          : 'bg-card border-border hover:border-primary/50 text-foreground'
      }`}
    >
      {text}
    </button>
  );
}
