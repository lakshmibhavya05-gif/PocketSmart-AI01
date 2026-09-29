import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { SavingsGoal } from '../../types/finance';
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  PauseCircle,
  PlayCircle,
  DollarSign,
  X,
  History,
  Sparkles,
} from 'lucide-react';

export const SavingsGoalsView: React.FC = () => {
  const {
    savingsGoals,
    addSavingsGoal,
    editSavingsGoal,
    deleteSavingsGoal,
    recordGoalContribution,
    toggleGoalStatus,
    formatCurrency,
    user,
    metrics,
  } = useFinance();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  // New goal form
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Safety Net');

  // Contribute form
  const [contributionAmount, setContributionAmount] = useState('');
  const [contributionNote, setContributionNote] = useState('');

  // History modal
  const [historyGoal, setHistoryGoal] = useState<SavingsGoal | null>(null);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(targetAmount);
    if (!title || isNaN(num) || num <= 0 || !targetDate) return;

    addSavingsGoal({
      title,
      targetAmount: num,
      targetDate,
      category,
    });

    setTitle('');
    setTargetAmount('');
    setTargetDate('');
    setIsAddModalOpen(false);
  };

  const handleContribute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const num = parseFloat(contributionAmount);
    if (isNaN(num) || num <= 0) return;

    recordGoalContribution(selectedGoal.id, num, contributionNote);
    setContributionAmount('');
    setContributionNote('');
    setIsContributeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Savings Goals & Milestones
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Turn aspirations into reachable mathematical milestones with contribution automation.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Savings Goal</span>
        </button>
      </div>

      {/* Summary KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total Capital in Goals</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
            {formatCurrency(metrics.totalSavingsInGoals)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Protected from daily spend</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Active Goals</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
            {savingsGoals.filter(g => g.status === 'active').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Funded regularly each month</p>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Completed Milestones</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums mt-1">
            {savingsGoals.filter(g => g.status === 'completed').length}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">100% target accomplished</p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {savingsGoals.map(goal => {
          const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          // Calculate suggested monthly contribution
          const today = new Date();
          const target = new Date(goal.targetDate);
          const monthsDiff = Math.max(
            1,
            (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth())
          );
          const suggestedMonthly = Math.round(remaining / monthsDiff);

          const isCompleted = goal.status === 'completed' || percent >= 100;
          const isPaused = goal.status === 'paused';

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all shadow-xs flex flex-col justify-between space-y-4 ${
                isCompleted
                  ? 'border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/20'
                  : isPaused
                  ? 'border-slate-200 dark:border-slate-800 opacity-75'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {goal.title}
                      </h3>
                      {isCompleted && (
                        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Achieved
                        </span>
                      )}
                      {isPaused && (
                        <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          Paused
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span>{goal.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Target: {goal.targetDate}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setHistoryGoal(goal)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                      title="Contribution history"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleGoalStatus(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
                      title={isPaused ? 'Resume goal' : 'Pause goal'}
                    >
                      {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteSavingsGoal(goal.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                      title="Delete goal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress amount */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
                      {formatCurrency(goal.currentAmount)}
                    </span>
                    <span className="text-xs text-slate-400 ml-1.5">
                      of {formatCurrency(goal.targetAmount)}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {percent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2 w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500 shadow-xs"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Footer calculations & Contribute action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {!isCompleted ? (
                    <span>
                      Suggested:{' '}
                      <strong className="text-slate-800 dark:text-slate-200 tabular-nums">
                        {formatCurrency(suggestedMonthly)}/mo
                      </strong>{' '}
                      ({monthsDiff} mos left)
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-medium">Goal reached successfully!</span>
                  )}
                </div>

                {!isCompleted && (
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setContributionAmount(suggestedMonthly.toString());
                      setIsContributeModalOpen(true);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Contribute</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Create New Savings Goal</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Goal Name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Emergency Fund, Laptop, College Fees, Vacation"
                  className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Amount ({user.currencyCode})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">
                    {user.currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    min="100"
                    value={targetAmount}
                    onChange={e => setTargetAmount(e.target.value)}
                    placeholder="e.g. 150000"
                    className="w-full pl-8 pr-3 py-2 text-xs font-semibold tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={e => setTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    <option value="Safety Net">Safety Net / Emergency</option>
                    <option value="Technology">Technology / Work</option>
                    <option value="Travel">Travel & Vacation</option>
                    <option value="Self Growth">Education & Career</option>
                    <option value="Vehicle">Vehicle / Bike</option>
                    <option value="Home">Home Purchase</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Contribute Modal */}
      {isContributeModalOpen && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Contribute to {selectedGoal.title}
              </h3>
              <button onClick={() => setIsContributeModalOpen(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleContribute} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Contribution Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold text-xs">
                    {user.currencySymbol}
                  </span>
                  <input
                    type="number"
                    step="any"
                    required
                    min="1"
                    value={contributionAmount}
                    onChange={e => setContributionAmount(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-base font-bold tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={contributionNote}
                  onChange={e => setContributionNote(e.target.value)}
                  placeholder="e.g. Monthly salary surplus, bonus"
                  className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsContributeModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Confirm Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Contribution History Timeline Modal */}
      {historyGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Contribution History
                </h3>
                <p className="text-xs text-slate-500">{historyGoal.title}</p>
              </div>
              <button onClick={() => setHistoryGoal(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1">
              {historyGoal.contributions.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">
                  No contributions recorded yet.
                </p>
              ) : (
                historyGoal.contributions.map(c => (
                  <div
                    key={c.id}
                    className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">
                        {c.note || 'Savings allocation'}
                      </p>
                      <p className="text-[11px] text-slate-400 tabular-nums">{c.date}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      +{formatCurrency(c.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end shrink-0">
              <button
                onClick={() => setHistoryGoal(null)}
                className="px-4 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
