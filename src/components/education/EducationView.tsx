import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { EDUCATION_LESSONS, EDUCATION_BANNER } from '../../data/mockData';
import { EducationLesson } from '../../types/finance';
import {
  GraduationCap,
  Calculator,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  ShieldAlert,
  Percent,
} from 'lucide-react';

export const EducationView: React.FC = () => {
  const { formatCurrency, user } = useFinance();

  const [selectedLesson, setSelectedLesson] = useState<EducationLesson>(EDUCATION_LESSONS[0]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);

  // Interactive Calculators state
  // Compound Interest:
  const [principal, setPrincipal] = useState<number>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [years, setYears] = useState<number>(10);
  const [rate, setRate] = useState<number>(12); // 12% equity index

  // Emergency Fund:
  const [monthlyNeeds, setMonthlyNeeds] = useState<number>(35000);
  const [monthsCount, setMonthsCount] = useState<number>(6);

  // Calculate compound interest: A = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1)/(r/n)]
  const calculateCompoundTotal = () => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const futureValPrincipal = principal * Math.pow(1 + r, n);
    const futureValContributions = monthlyContribution * ((Math.pow(1 + r, n) - 1) / r);
    const total = futureValPrincipal + futureValContributions;
    const invested = principal + monthlyContribution * n;
    const interest = total - invested;
    return { total: Math.round(total), invested: Math.round(invested), interest: Math.round(interest) };
  };

  const compoundResult = calculateCompoundTotal();
  const emergencyTotal = monthlyNeeds * monthsCount;

  const handleQuizAnswer = (index: number) => {
    if (isQuizSubmitted) return;
    setSelectedQuizOption(index);
    setIsQuizSubmitted(true);
    if (index === selectedLesson.quiz.correctIndex) {
      if (!completedLessonIds.includes(selectedLesson.id)) {
        setCompletedLessonIds(prev => [...prev, selectedLesson.id]);
      }
    }
  };

  const handleSelectLesson = (lesson: EducationLesson) => {
    setSelectedLesson(lesson);
    setSelectedQuizOption(null);
    setIsQuizSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-600" />
            <span>Financial Literacy & Tools</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Master fundamental money habits, avoid scams, and model wealth growth with interactive tools.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>{completedLessonIds.length} of {EDUCATION_LESSONS.length} Completed</span>
        </div>
      </div>

      {/* Featured Banner Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm max-h-48 group">
        <img
          src={EDUCATION_BANNER}
          alt="Financial Education Banner"
          referrerPolicy="no-referrer"
          className="w-full h-48 object-cover brightness-90 group-hover:scale-102 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/60 to-transparent flex items-center px-6 sm:px-10">
          <div className="max-w-md text-white space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              PocketSmart Academy
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight">
              Knowledge is Your Highest-Yield Asset
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every lesson includes grounded explanations, mathematical rules of thumb, and interactive simulators.
            </p>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Lesson Selector + Content & Calculators */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lessons List */}
        <div className="space-y-2">
          <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
            Lessons & Topics
          </h2>

          <div className="space-y-1.5">
            {EDUCATION_LESSONS.map(lesson => {
              const isSelected = selectedLesson.id === lesson.id;
              const isDone = completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => handleSelectLesson(lesson)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-500/80 shadow-xs'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3
                        className={`text-xs font-bold truncate ${
                          isSelected ? 'text-emerald-900 dark:text-emerald-200' : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {lesson.title}
                      </h3>
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      <span>{lesson.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{lesson.readTime}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Calculator Section Card */}
          <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white space-y-3 shadow-md">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Interactive Calculators</span>
            </div>
            <p className="text-xs text-slate-300">
              Experiment with Compound Interest & Emergency Fund targets below to visualize your personal numbers.
            </p>
          </div>
        </div>

        {/* Right: Active Lesson Details, Calculator, & Quiz (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Lesson Content */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  {selectedLesson.category}
                </span>
                <span className="text-xs text-slate-400">{selectedLesson.readTime}</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {selectedLesson.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-1 pb-2 border-b border-slate-100 dark:border-slate-800">
                "{selectedLesson.summary}"
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {selectedLesson.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Key Takeaway Box */}
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider block mb-1">
                Key Principle
              </span>
              <p className="text-xs font-medium text-emerald-900 dark:text-emerald-100">
                {selectedLesson.keyTakeaway}
              </p>
            </div>

            {/* Embedded Calculator if applicable */}
            {selectedLesson.calculatorType === 'compound' && (
              <div className="mt-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>Compound Interest Wealth Simulator</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Initial Capital</label>
                    <input
                      type="number"
                      step="1000"
                      value={principal}
                      onChange={e => setPrincipal(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Monthly Deposit</label>
                    <input
                      type="number"
                      step="500"
                      value={monthlyContribution}
                      onChange={e => setMonthlyContribution(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Years Invested</label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={years}
                      onChange={e => setYears(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">Annual Return (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={rate}
                      onChange={e => setRate(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg tabular-nums"
                    />
                  </div>
                </div>

                {/* Compound Result Banner */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <span className="text-[11px] text-slate-500">Your Deposits</span>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                      {formatCurrency(compoundResult.invested)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">Interest Compounded</span>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      +{formatCurrency(compoundResult.interest)}
                    </p>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">Total Portfolio Value</span>
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(compoundResult.total)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {selectedLesson.calculatorType === 'emergency' && (
              <div className="mt-4 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <ShieldAlert className="w-4 h-4 text-emerald-600" />
                  <span>Emergency Fund Cushion Sizing</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Monthly Survival Expenses (Needs only)
                    </label>
                    <input
                      type="number"
                      step="1000"
                      value={monthlyNeeds}
                      onChange={e => setMonthlyNeeds(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">
                      Target Buffer Duration (Months)
                    </label>
                    <select
                      value={monthsCount}
                      onChange={e => setMonthsCount(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                    >
                      <option value={3}>3 Months (Dual-income / stable salaried)</option>
                      <option value={6}>6 Months (Recommended standard buffer)</option>
                      <option value={9}>9 Months (Freelancers / volatile income)</option>
                      <option value={12}>12 Months (Single earners / business owners)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs text-slate-600 dark:text-slate-300">
                    Recommended Liquid Reserve:
                  </span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatCurrency(emergencyTotal)}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Interactive Knowledge Check Quiz */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>Quick Knowledge Check</span>
              </div>

              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {selectedLesson.quiz.question}
              </p>

              <div className="space-y-2">
                {selectedLesson.quiz.options.map((option, oIdx) => {
                  let optionStyle =
                    'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800';

                  if (isQuizSubmitted) {
                    if (oIdx === selectedLesson.quiz.correctIndex) {
                      optionStyle =
                        'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-200 font-semibold';
                    } else if (selectedQuizOption === oIdx) {
                      optionStyle =
                        'border-rose-400 bg-rose-50/60 dark:bg-rose-950/50 text-rose-800 dark:text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={isQuizSubmitted}
                      onClick={() => handleQuizAnswer(oIdx)}
                      className={`w-full text-left p-2.5 text-xs rounded-xl border transition-all flex items-center justify-between ${optionStyle}`}
                    >
                      <span>{option}</span>
                      {isQuizSubmitted && oIdx === selectedLesson.quiz.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isQuizSubmitted &&
                        selectedQuizOption === oIdx &&
                        oIdx !== selectedLesson.quiz.correctIndex && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                    </button>
                  );
                })}
              </div>

              {isQuizSubmitted && (
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedQuizOption === selectedLesson.quiz.correctIndex ? 'Correct!' : 'Explanation:'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                    {selectedLesson.quiz.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
