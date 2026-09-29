import React from 'react';
import { useFinance, TimeRange } from '../../context/FinanceContext';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
  TrendingUp,
  Receipt,
  Plus,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    formatCurrency,
    metrics,
    timeRange,
    setTimeRange,
    transactions,
    savingsGoals,
    bills,
    payBill,
    aiInsights,
    setActiveTab,
    setIsAddTxModalOpen,
    setIsReceiptModalOpen,
  } = useFinance();

  const recentTransactions = transactions.slice(0, 5);
  const pendingBills = bills.filter(b => !b.isPaid).slice(0, 3);
  const activeGoals = savingsGoals.filter(g => g.status === 'active').slice(0, 3);

  // SVG Chart data for Monthly Spending Trend (Last 6 points)
  const spendingTrend = [
    { label: 'W1', value: 9200 },
    { label: 'W2', value: 11400 },
    { label: 'W3', value: 8900 },
    { label: 'W4', value: 14200 },
    { label: 'W5', value: 9600 },
    { label: 'Curr', value: metrics.monthlyExpenses > 0 ? Math.round(metrics.monthlyExpenses / 4) : 9800 },
  ];

  const maxTrend = Math.max(...spendingTrend.map(d => d.value), 15000);

  return (
    <div className="space-y-6">
      {/* Top Banner: Welcome & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Financial Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time cash flow, budget utilization, and AI financial recommendations.
          </p>
        </div>

        {/* Time range switcher & primary actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Segmented Time Range Controller */}
          <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['weekly', 'monthly', 'quarterly', 'yearly'] as TimeRange[]).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsReceiptModalOpen(true)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Scan Receipt</span>
          </button>

          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Entry</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Available Balance */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Net Available Balance
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formatCurrency(metrics.availableBalance)}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Liquid across cash & bank</span>
            </div>
          </div>
        </div>

        {/* Monthly Income */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Inflow ({timeRange})
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums tracking-tight">
              +{formatCurrency(metrics.monthlyIncome)}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Salary & active clients</span>
            </div>
          </div>
        </div>

        {/* Monthly Expenses */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Outflow ({timeRange})
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400 tabular-nums tracking-tight">
              -{formatCurrency(metrics.monthlyExpenses)}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="tabular-nums">{metrics.budgetUtilizationPercent}% of monthly budget</span>
            </div>
          </div>
        </div>

        {/* Total Savings & Rate */}
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Net Savings & Surplus
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formatCurrency(metrics.monthlySavings)}
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{metrics.savingsRate}% Savings Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Financial Insights Highlight Card */}
      {aiInsights.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-transparent border border-emerald-500/20 dark:border-emerald-500/30">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                PocketSmart AI Highlights
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('ai')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Ask AI Assistant</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiInsights.slice(0, 3).map(insight => (
              <div
                key={insight.id}
                className="p-3 rounded-lg bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {insight.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {insight.description}
                  </p>
                </div>

                {insight.actionText && (
                  <button
                    onClick={() => {
                      if (insight.actionTab) setActiveTab(insight.actionTab as any);
                    }}
                    className="mt-2.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>{insight.actionText}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid: Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Spending Trends & Income vs Expense (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Income vs Expenses Interactive Bar/Area comparison */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Income vs Expense Comparison
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Monthly cash velocity and net surplus allocation
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Income
                </span>
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded bg-rose-500" /> Expenses
                </span>
              </div>
            </div>

            {/* SVG Visual Bar Comparison */}
            <div className="h-48 w-full flex items-end justify-around pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex flex-col items-center gap-2 w-1/3">
                <span className="text-xs font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(metrics.monthlyIncome, { round: true })}
                </span>
                <div
                  className="w-16 sm:w-24 bg-emerald-500 rounded-t-lg transition-all duration-500 shadow-xs"
                  style={{
                    height: `${Math.min(130, Math.max(30, (metrics.monthlyIncome / (metrics.monthlyIncome || 1)) * 130))}px`,
                  }}
                />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Income
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 w-1/3">
                <span className="text-xs font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                  {formatCurrency(metrics.monthlyExpenses, { round: true })}
                </span>
                <div
                  className="w-16 sm:w-24 bg-rose-500 rounded-t-lg transition-all duration-500 shadow-xs"
                  style={{
                    height: `${Math.min(130, Math.max(20, (metrics.monthlyExpenses / (metrics.monthlyIncome || 1)) * 130))}px`,
                  }}
                />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Total Expenses
                </span>
              </div>

              <div className="flex flex-col items-center gap-2 w-1/3">
                <span className="text-xs font-semibold tabular-nums text-slate-700 dark:text-slate-300">
                  {formatCurrency(metrics.monthlySavings, { round: true })}
                </span>
                <div
                  className="w-16 sm:w-24 bg-slate-300 dark:bg-slate-700 rounded-t-lg transition-all duration-500 shadow-xs"
                  style={{
                    height: `${Math.min(130, Math.max(15, (metrics.monthlySavings / (metrics.monthlyIncome || 1)) * 130))}px`,
                  }}
                />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Net Savings
                </span>
              </div>
            </div>

            {/* Quick 50/30/20 summary indicators */}
            <div className="grid grid-cols-3 gap-2 pt-3 text-center">
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Needs (Target 50%)</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {metrics.needsWantsSavings.needs.percentage}% ({formatCurrency(metrics.needsWantsSavings.needs.amount, { round: true })})
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Wants (Target 30%)</p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                  {metrics.needsWantsSavings.wants.percentage}% ({formatCurrency(metrics.needsWantsSavings.wants.amount, { round: true })})
                </p>
              </div>
              <div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Savings (Target 20%)</p>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {metrics.needsWantsSavings.savings.percentage}% ({formatCurrency(metrics.needsWantsSavings.savings.amount, { round: true })})
                </p>
              </div>
            </div>
          </div>

          {/* Recent Transactions List */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recent Transactions
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Live itemized entries from your connected cards and cash
                </p>
              </div>
              <button
                onClick={() => setActiveTab('transactions')}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <span>View All ({transactions.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentTransactions.map(tx => (
                <div
                  key={tx.id}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-lg px-2 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        tx.type === 'income'
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {tx.type === 'income' ? (
                        <ArrowDownRight className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {tx.merchant}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{tx.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{tx.paymentMethod}</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">{tx.date}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-bold tabular-nums shrink-0 ${
                      tx.type === 'income'
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Spending by Category & Upcoming Bills & Savings Goals */}
        <div className="space-y-6">
          {/* Top Spending by Category */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Spending by Category
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Highest outflow distributions this month
                </p>
              </div>
              <button
                onClick={() => setActiveTab('budgets')}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Budgets
              </button>
            </div>

            <div className="space-y-3 pt-1">
              {metrics.topExpenseCategories.slice(0, 5).map(cat => (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {cat.category}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                      {formatCurrency(cat.amount)} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Bills Widget */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Upcoming Bills
                </h2>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                {pendingBills.length} pending
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingBills.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400 py-3 text-center">
                  All scheduled bills are fully paid!
                </p>
              ) : (
                pendingBills.map(bill => (
                  <div
                    key={bill.id}
                    className="p-3 rounded-lg border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {bill.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-amber-500" />
                        <span>Due {bill.dueDate}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatCurrency(bill.amount)}
                      </span>
                      <button
                        onClick={() => payBill(bill.id)}
                        className="px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded transition-colors"
                      >
                        Pay
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Savings Goals Widget */}
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Savings Goals
              </h2>
              <button
                onClick={() => setActiveTab('savings')}
                className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Manage Goals
              </button>
            </div>

            <div className="space-y-3">
              {activeGoals.map(goal => {
                const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 truncate pr-2">
                        {goal.title}
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {pct}%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      <span>{formatCurrency(goal.currentAmount, { round: true })}</span>
                      <span>Target: {formatCurrency(goal.targetAmount, { round: true })}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
