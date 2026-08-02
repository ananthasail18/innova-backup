import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/SessionContext';
import { useSubmitQuiz } from '@/services/queries';
import { QuizCard } from '@/components/QuizCard';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 'q_paneer_butter',
    text: "When eating Paneer Butter Masala or Chicken Tikka Masala, what's your reaction to the spice?",
    options: [
      { id: 'opt_too_spicy', text: "Too spicy, I need water!" },
      { id: 'opt_just_right', text: "Just right, perfectly balanced flavor." },
      { id: 'opt_too_mild', text: "Too mild, add more chili!" },
    ],
  },
  {
    id: 'q_desserts',
    text: "How often do you order dessert after a meal?",
    options: [
      { id: 'opt_never', text: "Rarely or never, I prefer savory food." },
      { id: 'opt_sometimes', text: "Sometimes, if something looks really good." },
      { id: 'opt_always', text: "Always, I have a huge sweet tooth!" },
    ],
  },
  {
    id: 'q_gobi_manchurian',
    text: "Your favorite style of Indo-Chinese starters like Gobi Manchurian:",
    options: [
      { id: 'opt_mild', text: "Mild, saucy, and rich." },
      { id: 'opt_medium', text: "Medium spice with a nice crisp." },
      { id: 'opt_spicy', text: "Super spicy and extra crunchy!" },
    ],
  },
  {
    id: 'q_adventure',
    text: "How adventurous are you when trying new cuisines?",
    options: [
      { id: 'opt_familiar', text: "I stick to what I know and love." },
      { id: 'opt_sometimes', text: "I'll try new twists on familiar dishes." },
      { id: 'opt_love_new', text: "Love exploring exotic and unusual flavors!" },
    ],
  },
  {
    id: 'q_sauce',
    text: "Which sauce profile appeals most to you?",
    options: [
      { id: 'opt_rich_cheesy', text: "Rich, creamy, and buttery." },
      { id: 'opt_zesty_tangy', text: "Zesty, tangy, and citrusy." },
      { id: 'opt_smoky_bbq', text: "Smoky, charred, and savory." },
    ],
  },
  {
    id: 'q_crunch',
    text: "How important is crunch/texture in your dish?",
    options: [
      { id: 'opt_not_really', text: "Not important, soft & comforting is great." },
      { id: 'opt_okay', text: "A little texture contrast is nice." },
      { id: 'opt_must_have', text: "Must have crispiness in every bite!" },
    ],
  },
  {
    id: 'q_portion',
    text: "What is your typical meal preference size?",
    options: [
      { id: 'opt_light', text: "Light bite or small plates." },
      { id: 'opt_standard', text: "Standard single main course." },
      { id: 'opt_feast', text: "Hearty feast with multiple items!" },
    ],
  },
  {
    id: 'q_smoked',
    text: "How do you feel about charcoal-smoked or tandoori flavors?",
    options: [
      { id: 'opt_pass', text: "Pass, I prefer clean fresh flavors." },
      { id: 'opt_sounds_good', text: "Sounds good, adds great depth." },
      { id: 'opt_need_it', text: "Need it! Tandoori & smoked dishes are top tier." },
    ],
  },
];

export function QuizPage() {
  const navigate = useNavigate();
  const { userId } = useSession();
  const submitQuiz = useSubmitQuiz();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedOptionId = answers[currentQuestion.id] || null;

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
  };

  const handleNext = () => {
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit Quiz
      if (!userId) return;
      const formattedAnswers = Object.entries(answers).map(([qId, optId]) => ({
        question_id: qId,
        selected_option_id: optId,
      }));

      submitQuiz.mutate(
        { user_id: userId, answers: formattedAnswers },
        {
          onSuccess: () => {
            navigate('/restaurant');
          },
        }
      );
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-4 md:p-8 max-w-2xl mx-auto justify-between space-y-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-muted disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold tracking-wider text-muted-foreground uppercase">Taste Identity</span>
          <div className="w-9" />
        </div>

        <ProgressIndicator current={currentIndex + 1} total={QUIZ_QUESTIONS.length} />

        <QuizCard
          question={currentQuestion}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
        />
      </div>

      <button
        onClick={handleNext}
        disabled={!selectedOptionId || submitQuiz.isPending}
        className="w-full py-4 px-6 bg-primary text-primary-foreground font-bold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
      >
        {currentIndex === QUIZ_QUESTIONS.length - 1 ? (
          <>
            <span>Complete Profile</span>
            <Check className="w-5 h-5" />
          </>
        ) : (
          <>
            <span>Next Question</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );
}
