import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  PieChart,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { metrics, formatCurrency, user, transactions } = useFinance();

  const [statementMonth, setStatementMonth] = useState('2026-09');

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadReport = () => {
    const reportData = {
      user: user.name,
      email: user.email,
      statementPeriod: statementMonth,
      generatedAt: new Date().toISOString(),
      summary: {
        totalIncome: metrics.monthlyIncome,
        totalExpenses: metrics.monthlyExpenses,
        netSavings: metrics.monthlySavings,
        savingsRate: `${metrics.savingsRate}%`,
        budgetCap: metrics.monthlyBudgetCap,
        budgetUtilization: `${metrics.budgetUtilizationPercent}%`,
      },
      rule50_30_20: {
        needs: { amount: metrics.needsWantsSavings.needs.amount, percent: `${metrics.needsWantsSavings.needs.percentage}%`, target: '50%' },
        wants: { amount: metrics.needsWantsSavings.wants.amount, percent: `${metrics.needsWantsSavings.wants.percentage}%`, target: '30%' },
        savings: { amount: metrics.needsWantsSavings.savings.amount, percent: `${metrics.needsWantsSavings.savings.percentage}%`, target: '20%' },
      },
      categoryBreakdown: metrics.topExpenseCategories,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PocketSmart_Statement_${statementMonth}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Score calculation for Financial Health (0-100)
  const healthScore = Math.min(
    100,
    Math.max(
      30,
      Math.round(
        (metrics.savingsRate >= 20 ? 40 : metrics.savingsRate * 2) +
          (metrics.budgetUtilizationPercent <= 85 ? 35 : Math.max(10, 35 - (metrics.budgetUtilizationPercent - 85))) +
          (metrics.needsWantsSavings.needs.percentage <= 55 ? 25 : 15)
      )
    )
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Reports & Financial Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Audit monthly statements, assess 50/30/20 balance, and download compliance ledgers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Statement</span>
          </button>
        </div>
      </div>

      {/* Financial Health Score & Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              PocketSmart Health Score
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {healthScore}
              </span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              {healthScore >= 80 ? 'Grade A · Robust Financial Trajectory' : 'Grade B · Stable Cash Velocity'}
            </p>
          </div>
          <p className="text-[11px] text-slate-400 mt-3 border-t border-slate-100 dark:border-slate-800 pt-2">
            Calculated from savings rate, budget variance, and emergency fund buffer.
          </p>
        </div>

        {/* Total Inflow vs Outflow */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              September 2026 Cash Velocity
            </span>
            <div className="mt-2 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Gross Income:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {formatCurrency(metrics.monthlyIncome)}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Total Outflow:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  {formatCurrency(metrics.monthlyExpenses)}
                </span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-white">Net Surplus:</span>
                <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                  {formatCurrency(metrics.monthlySavings)}
                </span>
              </div>
            </div>
          </div>
          <span className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {metrics.savingsRate}% of every incoming rupee is converted into wealth.
          </span>
        </div>

        {/* Budget Performance Metric */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Budget Adherence
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                {metrics.budgetUtilizationPercent}%
              </span>
              <span className="text-xs text-slate-400">utilized</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Remaining buffer: <strong className="tabular-nums text-slate-900 dark:text-white">{formatCurrency(metrics.budgetRemaining)}</strong>
            </p>
          </div>
          <span className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {metrics.daysRemainingInMonth} days remaining in current monthly cycle.
          </span>
        </div>
      </div>

      {/* 50/30/20 Rule Compliance Deep-Dive */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            50 / 30 / 20 Framework Audit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Benchmarks your income against the gold-standard allocation for sustainable wealth creation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Needs */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                1. Needs (Essentials)
              </span>
              <span className="text-xs font-semibold text-slate-500">Target 50%</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                {formatCurrency(metrics.needsWantsSavings.needs.amount)}
              </span>
              <span
                className={`text-xs font-bold tabular-nums ${
                  metrics.needsWantsSavings.needs.percentage <= 50 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {metrics.needsWantsSavings.needs.percentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-800 dark:bg-slate-200 rounded-full"
                style={{ width: `${Math.min(100, metrics.needsWantsSavings.needs.percentage)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Rent, food staples, electricity, WiFi, and health costs.
            </p>
          </div>

          {/* Wants */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                2. Wants (Lifestyle)
              </span>
              <span className="text-xs font-semibold text-slate-500">Target 30%</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                {formatCurrency(metrics.needsWantsSavings.wants.amount)}
              </span>
              <span
                className={`text-xs font-bold tabular-nums ${
                  metrics.needsWantsSavings.wants.percentage <= 30 ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {metrics.needsWantsSavings.wants.percentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-slate-500 rounded-full"
                style={{ width: `${Math.min(100, metrics.needsWantsSavings.wants.percentage)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Dining out, shopping, streaming, and leisure travel.
            </p>
          </div>

          {/* Savings */}
          <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                3. Savings & Surplus
              </span>
              <span className="text-xs font-semibold text-emerald-600">Target 20%</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums">
                {formatCurrency(metrics.needsWantsSavings.savings.amount)}
              </span>
              <span className="text-xs font-bold text-emerald-600 tabular-nums">
                {metrics.needsWantsSavings.savings.percentage}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, metrics.needsWantsSavings.savings.percentage)}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">
              Emergency fund, goal contributions, and investments.
            </p>
          </div>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Category Distribution & Outflow Share
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase">
              <tr>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-right">Amount Spent</th>
                <th className="py-2.5 px-4 text-right">Share of Outflow</th>
                <th className="py-2.5 px-4 text-right">Daily Run Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {metrics.topExpenseCategories.map(cat => (
                <tr key={cat.category} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {cat.category}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-slate-800 dark:text-slate-200 font-medium">
                    {formatCurrency(cat.amount)}
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-slate-600 dark:text-slate-300">
                    {cat.percentage}%
                  </td>
                  <td className="py-2.5 px-4 text-right tabular-nums text-slate-500 dark:text-slate-400">
                    {formatCurrency(cat.amount / 30, { round: true })}/day
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
