import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/shared/context/SessionContext';
import { useSubmitQuiz } from '@/shared/services/queries';
import { QuizCard, type QuestionDef } from '../components/QuizCard';
import { ProgressIndicator } from '../components/ProgressIndicator';
import type { QuizAnswer } from '@/shared/types';

const QUIZ_QUESTIONS: QuestionDef[] = [
  {
    id: 'q_paneer_butter',
    text: 'Paneer Butter Masala usually feels...',
    options: [
      { id: 'opt_too_spicy', label: 'Too spicy' },
      { id: 'opt_just_right', label: 'Just right' },
      { id: 'opt_too_mild', label: 'Too mild' }
    ]
  },
  {
    id: 'q_desserts',
    text: 'How do you usually order desserts?',
    options: [
      { id: 'opt_never', label: 'Never' },
      { id: 'opt_sometimes', label: 'Sometimes' },
      { id: 'opt_always', label: 'Always' }
    ]
  },
  {
    id: 'q_gobi_manchurian',
    text: 'When eating Gobi Manchurian you prefer...',
    options: [
      { id: 'opt_mild', label: 'Mild' },
      { id: 'opt_medium', label: 'Medium' },
      { id: 'opt_spicy', label: 'Spicy' }
    ]
  },
  {
    id: 'q_adventure',
    text: 'How adventurous are you when trying new dishes?',
    options: [
      { id: 'opt_familiar', label: 'Prefer familiar food' },
      { id: 'opt_sometimes', label: 'Sometimes experiment' },
      { id: 'opt_love_new', label: 'Love trying new food' }
    ]
  },
  {
    id: 'q_sauce',
    text: 'When choosing a sauce, you lean towards...',
    options: [
      { id: 'opt_rich_cheesy', label: 'Rich & Cheesy' },
      { id: 'opt_zesty_tangy', label: 'Zesty & Tangy' },
      { id: 'opt_smoky_bbq', label: 'Smoky BBQ' }
    ]
  },
  {
    id: 'q_crunch',
    text: 'Texture-wise, do you enjoy a satisfying crunch in your meals?',
    options: [
      { id: 'opt_not_really', label: 'Not really' },
      { id: 'opt_okay', label: "It's okay" },
      { id: 'opt_must_have', label: 'A must-have' }
    ]
  },
  {
    id: 'q_portion',
    text: 'How large of a meal do you usually prefer?',
    options: [
      { id: 'opt_light', label: 'Light bite' },
      { id: 'opt_standard', label: 'Standard meal' },
      { id: 'opt_feast', label: 'Feast' }
    ]
  },
  {
    id: 'q_smoked',
    text: "When you see 'Smoked' on a menu, you think...",
    options: [
      { id: 'opt_pass', label: 'Pass' },
      { id: 'opt_sounds_good', label: 'Sounds good' },
      { id: 'opt_need_it', label: 'I need it' }
    ]
  }
];

export function QuizPage() {
  const { userId } = useSession();
  const navigate = useNavigate();
  const submitQuiz = useSubmitQuiz();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  
  // If no user is in session, we shouldn't be taking the quiz. Redirect to home.
  if (!userId) {
    navigate('/', { replace: true });
    return null;
  }

  const handleSelect = (optionId: string) => {
    const currentQ = QUIZ_QUESTIONS[currentIndex];
    const newAnswers = [...answers, { question_id: currentQ.id, selected_option_id: optionId }];
    
    if (currentIndex < QUIZ_QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished quiz
      submitQuiz.mutate({
        user_id: userId,
        answers: newAnswers
      }, {
        onSuccess: () => {
          // Hardcoded restaurant ID from the seed script for now
          // In a real app we might get the ID from a QR code or context
          navigate('/restaurant/1');
        },
        onError: (err) => {
          console.error("Failed to submit quiz", err);
          // Show error toast ideally
        }
      });
    }
  };

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  if (submitQuiz.isPending) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <h2 className="text-xl font-bold">Analyzing your taste identity...</h2>
        <p className="text-muted-foreground">Mapping your flavor vectors</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-4 md:p-8 max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center space-y-8">
        <ProgressIndicator current={currentIndex + 1} total={QUIZ_QUESTIONS.length} />
        <QuizCard 
          key={currentQuestion.id} // forces re-animation on new question
          question={currentQuestion} 
          selectedOptionId={null} 
          onSelect={handleSelect} 
        />
      </div>
    </div>
  );
}
