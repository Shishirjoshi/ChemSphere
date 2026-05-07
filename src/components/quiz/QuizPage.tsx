import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { 
  Timer, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Trophy, 
  RefreshCcw, 
  BarChart, 
  Sparkles,
  ChevronRight,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';

const QUESTIONS = [
  {
    id: '1',
    question: 'Define the IUPAC name for CH3-CH2-CH2-OH.',
    options: ['Ethanol', 'Propan-1-ol', 'Butan-1-ol', 'Propan-2-ol'],
    correctAnswer: 1,
    explanation: 'The chain has 3 carbons with -OH at the first carbon, hence Propan-1-ol.'
  },
  {
    id: '2',
    question: 'What is the geometry of a CH4 molecule according to VSEPR theory?',
    options: ['Linear', 'Trigonal Planar', 'Tetrahedral', 'Bent'],
    correctAnswer: 2,
    explanation: 'Methane (CH4) has 4 bond pairs and 0 lone pairs, leading to a Tetrahedral geometry.'
  },
  {
    id: '3',
    question: 'Which of the following is an example of an intensive property in thermodynamics?',
    options: ['Volume', 'Entropy', 'Density', 'Internal Energy'],
    correctAnswer: 2,
    explanation: 'Intensive properties do not depend on the amount of matter. Density is independent of sample size.'
  },
  {
    id: '4',
    question: 'What is the primary product when Ethene reacts with H2 in presence of Ni?',
    options: ['Ethane', 'Ethyne', 'Ethanol', 'Formaldehyde'],
    correctAnswer: 0,
    explanation: 'Catalytic hydrogenation of Ethene (alkene) yields Ethane (alkane).'
  },
  {
    id: '5',
    question: 'In coordination compounds, the number of ligands attached to the central metal atom is called:',
    options: ['Oxidation number', 'Coordination number', 'Effective atomic number', 'Valency'],
    correctAnswer: 1,
    explanation: 'Coordination number is the total number of coordinate bonds formed with the central metal.'
  }
];

export const QuizPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins

  const startQuiz = () => {
    setCurrentStep('quiz');
    setCurrentIndex(0);
    setAnswers(new Array(QUESTIONS.length).fill(null));
    setScore(0);
    setTimeLeft(300);
  };

  const handleAnswer = (optionIdx: number) => {
    if (answers[currentIndex] !== null) return;
    
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIdx;
    setAnswers(newAnswers);

    if (optionIdx === QUESTIONS[currentIndex].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setCurrentStep('result');
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#3b82f6', '#a855f7']
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {currentStep === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-12 rounded-[3rem] bg-white/5 border border-white/10 text-center backdrop-blur-xl"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-cyan-500/20">
              <Trophy size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black mb-4">NEB Chemistry Mock Quiz</h2>
            <p className="text-white/50 mb-10 text-lg">Test your knowledge with 5 exam-style questions. <br /> You have 5 minutes to complete them.</p>
            
            <div className="grid grid-cols-3 gap-6 mb-12 max-w-lg mx-auto">
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-cyan-400">
                     <CheckCircle2 size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">5 Questions</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-purple-400">
                     <Timer size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">5 Minutes</span>
               </div>
               <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-yellow-400">
                     <Sparkles size={20} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">+100 XP</span>
               </div>
            </div>

            <button
              onClick={startQuiz}
              className="px-10 py-5 bg-cyan-500 text-white font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-cyan-500/30 flex items-center gap-3 mx-auto"
            >
              Start Challenge <ArrowRight size={20} />
            </button>
          </motion.div>
        )}

        {currentStep === 'quiz' && (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="p-8 lg:p-12 rounded-[2.5rem] bg-[#0A0F1E] border border-white/10"
          >
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-12">
               <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">Question {currentIndex + 1} of {QUESTIONS.length}</span>
                  <div className="h-2 w-48 bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-cyan-500 transition-all duration-500" style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }} />
                  </div>
               </div>
               <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-white/80">
                  <Timer size={18} className="text-cyan-400" />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
               </div>
            </div>

            {/* Question */}
            <h3 className="text-2xl lg:text-3xl font-bold mb-10 leading-tight">
               {QUESTIONS[currentIndex].question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4 mb-12">
               {QUESTIONS[currentIndex].options.map((opt, i) => {
                  const isAnswered = answers[currentIndex] !== null;
                  const isSelected = answers[currentIndex] === i;
                  const isCorrect = i === QUESTIONS[currentIndex].correctAnswer;
                  
                  return (
                    <button
                      key={i}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(i)}
                      className={cn(
                        "p-6 rounded-2xl border transition-all text-left flex items-center justify-between group",
                        !isAnswered ? "bg-white/2 border-white/10 hover:border-cyan-500/50 hover:bg-white/5" : 
                        isCorrect ? "bg-emerald-500/10 border-emerald-500/50" : 
                        isSelected ? "bg-red-500/10 border-red-500/50" : "bg-white/2 border-white/10 opacity-50"
                      )}
                    >
                      <span className={cn(
                        "text-lg font-medium",
                        isAnswered && isCorrect ? "text-emerald-400" : isAnswered && isSelected ? "text-red-400" : "text-white/80"
                      )}>
                        {opt}
                      </span>
                      {isAnswered && isCorrect && <CheckCircle2 className="text-emerald-400" size={24} />}
                      {isAnswered && isSelected && !isCorrect && <XCircle className="text-red-400" size={24} />}
                    </button>
                  );
               })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4">
               {answers[currentIndex] !== null ? (
                 <div className="flex-1 p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <InfoIcon className="text-cyan-400 flex-shrink-0" size={18} />
                    <p className="text-sm text-white/50"><span className="text-white font-bold">Explanation:</span> {QUESTIONS[currentIndex].explanation}</p>
                 </div>
               ) : <div className="flex-1" />}
               
               <button
                 disabled={answers[currentIndex] === null}
                 onClick={nextQuestion}
                 className={cn(
                    "px-8 py-4 rounded-xl font-bold transition-all flex items-center gap-2",
                    answers[currentIndex] !== null ? "bg-white text-[#050B18]" : "bg-white/5 text-white/20 cursor-not-allowed"
                 )}
               >
                  {currentIndex === QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  <ArrowRight size={18} />
               </button>
            </div>
          </motion.div>
        )}

        {currentStep === 'result' && (
           <motion.div
             key="result"
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             className="p-12 rounded-[3.5rem] bg-white/5 border border-white/10 text-center relative overflow-hidden backdrop-blur-xl"
           >
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600" />
             
             <h2 className="text-5xl font-black mb-2 tracking-tight">Challenge <span className="text-cyan-400">Completed!</span></h2>
             <p className="text-white/40 mb-12 font-medium">Great effort on your NEB Chemistry prep.</p>
             
             <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-16">
                <div className="relative">
                   <svg className="w-48 h-48">
                      <circle cx="96" cy="96" r="88" className="stroke-white/5 fill-none" strokeWidth="8" />
                      <circle 
                        cx="96" 
                        cy="96" 
                        r="88" 
                        className="stroke-cyan-500 fill-none transition-all duration-1000" 
                        strokeWidth="8" 
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - score/QUESTIONS.length)}
                        strokeLinecap="round"
                      />
                   </svg>
                   <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl font-black">{score}</span>
                      <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Out of {QUESTIONS.length}</span>
                   </div>
                </div>

                <div className="flex flex-col items-start gap-4">
                   <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 w-64 lg:w-72">
                      <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                         <BarChart size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-white/30 uppercase">Accuracy</p>
                         <h4 className="text-xl font-black">{(score/QUESTIONS.length) * 100}%</h4>
                      </div>
                   </div>
                   <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 w-64 lg:w-72">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                         <Zap size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-white/30 uppercase">XP Earned</p>
                         <h4 className="text-xl font-black">+{score * 20} XP</h4>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                   onClick={startQuiz}
                   className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#050B18] font-bold flex items-center justify-center gap-2 hover:bg-cyan-400 transition-colors shadow-lg"
                >
                   <RefreshCcw size={18} /> Retake Quiz
                </button>
                <button
                   onClick={() => window.location.reload()}
                   className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all"
                >
                   Back to Dashboard
                </button>
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const InfoIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
  </svg>
);
