import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '@/hooks/SessionContext';
import { useSubmitQuiz, useCreateUser } from '@/services/queries';
import { QuizCard } from '@/components/QuizCard';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { ArrowLeft, Check } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 'q_spice',
    text: "What is the level of spice you usually prefer?",
    options: [
      { id: 'opt_too_mild', text: "Mild, I prefer it not spicy." },
      { id: 'opt_just_right', text: "Medium, perfectly balanced." },
      { id: 'opt_too_spicy', text: "Spicy, I love the heat!" },
    ],
  },
  {
    id: 'q_sweetness',
    text: "How much of a sweet tooth do you have?",
    options: [
      { id: 'opt_never', text: "I prefer savory over sweet." },
      { id: 'opt_sometimes', text: "A balanced sweetness is nice." },
      { id: 'opt_always', text: "I absolutely love sweet dishes!" },
    ],
  },
  {
    id: 'q_creaminess',
    text: "Do you enjoy rich, creamy textures in your food?",
    options: [
      { id: 'opt_no_cream', text: "Not really, I prefer lighter dishes." },
      { id: 'opt_some_cream', text: "A little creamy is good." },
      { id: 'opt_very_creamy', text: "Yes, the richer and creamier the better!" },
    ],
  },
  {
    id: 'q_tanginess',
    text: "How do you feel about tangy, zesty, or sour flavors?",
    options: [
      { id: 'opt_no_tang', text: "I try to avoid sour flavors." },
      { id: 'opt_some_tang', text: "A little zest adds good flavor." },
      { id: 'opt_very_tangy', text: "I love bold, tangy, and citrusy flavors!" },
    ],
  },
  {
    id: 'q_masala',
    text: "How intense do you like the spices and masala?",
    options: [
      { id: 'opt_light_masala', text: "Lightly spiced, let the ingredients shine." },
      { id: 'opt_med_masala', text: "Moderately spiced." },
      { id: 'opt_heavy_masala', text: "Heavy on the masala, very flavorful!" },
    ],
  },
  {
    id: 'q_crunch',
    text: "How important is crunch/texture in your dish?",
    options: [
      { id: 'opt_not_really', text: "Soft and comforting is great." },
      { id: 'opt_okay', text: "A little texture contrast is nice." },
      { id: 'opt_must_have', text: "Must have crispiness in every bite!" },
    ],
  },
  {
    id: 'q_oiliness',
    text: "What is your preference on richness or oiliness?",
    options: [
      { id: 'opt_low_oil', text: "As lean and dry as possible." },
      { id: 'opt_med_oil', text: "A standard amount is fine." },
      { id: 'opt_high_oil', text: "I don't mind it rich and buttery." },
    ],
  },
  {
    id: 'q_saltiness',
    text: "How salty do you like your food?",
    options: [
      { id: 'opt_low_salt', text: "Low sodium, very mildly salted." },
      { id: 'opt_med_salt', text: "Perfectly seasoned." },
      { id: 'opt_high_salt', text: "I enjoy quite savory, salty flavors." },
    ],
  }
];

export function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restaurantSlug = searchParams.get('restaurant') || 'rameshwaram-cafe';
  const { userId, setUserId } = useSession();
  const submitQuiz = useSubmitQuiz();
  const createUser = useCreateUser();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];
  const selectedOptionId = answers[currentQuestion.id] || null;

  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }));
    
    // Auto-advance to next question if not on the last one
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 400); // 400ms delay for visual feedback of selection
    }
  };

  const executeSubmission = (targetUserId: string) => {
    const formattedAnswers = Object.entries(answers).map(([qId, optId]) => ({
      question_id: qId,
      selected_option_id: optId,
    }));

    submitQuiz.mutate(
      { user_id: targetUserId, answers: formattedAnswers },
      {
        onSuccess: () => {
          navigate(`/restaurant/${restaurantSlug}`);
        },
      }
    );
  };

  const handleSubmit = () => {
    // Submit Quiz - ensure user session exists
    if (!userId) {
      createUser.mutate(
        { name: 'Guest User' },
        {
          onSuccess: (newUser) => {
            setUserId(newUser.id);
            executeSubmission(newUser.id);
          },
        }
      );
    } else {
      executeSubmission(userId);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isLastQuestion = currentIndex === QUIZ_QUESTIONS.length - 1;

  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 p-4 @md:p-8 max-w-2xl mx-auto justify-between space-y-6 text-neutral-100">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-full hover:bg-neutral-800 disabled:opacity-30 transition-colors"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-300" />
          </button>
          <span className="text-xs font-black tracking-wider text-orange-400 uppercase">Taste DNA Onboarding</span>
          <div className="w-9" />
        </div>

        <ProgressIndicator current={currentIndex + 1} total={QUIZ_QUESTIONS.length} />

        <QuizCard
          question={currentQuestion}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
        />
      </div>

      {isLastQuestion && (
        <button
          onClick={handleSubmit}
          disabled={!selectedOptionId || submitQuiz.isPending || createUser.isPending}
          className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg shadow-orange-950/50 active:scale-95"
        >
          <span>Establish Taste DNA</span>
          <Check className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
