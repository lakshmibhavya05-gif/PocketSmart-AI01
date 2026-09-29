import React from 'react';
import { useFinance, AppTab } from '../../context/FinanceContext';
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Sparkles,
  Target,
  BarChart3,
  GraduationCap,
  Bell,
  Settings,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const {
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    formatCurrency,
    metrics,
  } = useFinance();

  const menuItems: Array<{ id: AppTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }> = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'budgets', label: 'Budgets', icon: PieChart },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
    { id: 'savings', label: 'Savings Goals', icon: Target },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'education', label: 'Financial Education', icon: GraduationCap },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotificationCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (tab: AppTab) => {
    setActiveTab(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Navigation items list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Menu
          </div>

          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAi = item.id === 'ai';

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : isAi
                        ? 'text-emerald-500 group-hover:text-emerald-600'
                        : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white tabular-nums">
                    {item.badge}
                  </span>
                )}

                {isAi && item.badge === undefined && (
                  <span className="shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40">
                    Live
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: Budget utilization widget */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-500 dark:text-slate-400">Monthly Budget</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                {metrics.budgetUtilizationPercent}%
              </span>
            </div>

            {/* Utilization progress bar */}
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  metrics.budgetUtilizationPercent >= 100
                    ? 'bg-rose-500'
                    : metrics.budgetUtilizationPercent >= 80
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, metrics.budgetUtilizationPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              <span className="tabular-nums">Spent: {formatCurrency(metrics.budgetSpent, { round: true })}</span>
              <span className="tabular-nums">{metrics.daysRemainingInMonth}d left</span>
            </div>
          </div>

          {/* Privacy & encryption badge */}
          <div className="mt-2.5 px-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Encrypted & Private Data</span>
          </div>
        </div>
      </aside>
    </>
  );
};
