import { QuizOption } from '@/components/QuizOption';

interface QuizCardProps {
  question: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
  };
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
}

export function QuizCard({ question, selectedOptionId, onSelectOption }: QuizCardProps) {
  return (
    <div className="bg-card border border-border p-6 @md:p-8 rounded-3xl space-y-6 shadow-md">
      <h2 className="text-xl @md:text-2xl font-bold leading-snug">{question.text}</h2>
      <div className="space-y-3">
        {question.options.map((opt) => (
          <QuizOption
            key={opt.id}
            id={opt.id}
            text={opt.text}
            isSelected={selectedOptionId === opt.id}
            onSelect={onSelectOption}
          />
        ))}
      </div>
    </div>
  );
}
