import { QuizOption } from './QuizOption';

export interface QuestionDef {
  id: string;
  text: string;
  options: { id: string; label: string }[];
}

export function QuizCard({ 
  question, 
  selectedOptionId, 
  onSelect 
}: { 
  question: QuestionDef; 
  selectedOptionId: string | null; 
  onSelect: (id: string) => void;
}) {
  return (
    <div className="bg-card border border-border shadow-sm rounded-3xl p-6 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl md:text-3xl font-bold leading-tight">
        {question.text}
      </h2>
      <div className="space-y-3">
        {question.options.map((opt) => (
          <QuizOption 
            key={opt.id}
            label={opt.label}
            isSelected={selectedOptionId === opt.id}
            onClick={() => onSelect(opt.id)}
          />
        ))}
      </div>
    </div>
  );
}
