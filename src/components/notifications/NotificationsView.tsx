import React, { useState } from 'react';
import { useFinance, AppTab } from '../../context/FinanceContext';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Filter,
  SlidersHorizontal,
  Clock,
  ExternalLink,
  PieChart,
  Calendar,
  Target,
  Sparkles,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    setActiveTab,
    user,
    updateUser,
  } = useFinance();

  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'budget' | 'bill' | 'savings'>('all');
  const [showConfig, setShowConfig] = useState(false);

  const filteredNotifs = notifications.filter(n => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'budget') return n.type === 'budget';
    if (activeFilter === 'bill') return n.type === 'bill';
    if (activeFilter === 'savings') return n.type === 'savings';
    return true;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'budget':
        return <PieChart className="w-4 h-4 text-amber-500" />;
      case 'bill':
        return <Calendar className="w-4 h-4 text-rose-500" />;
      case 'savings':
        return <Target className="w-4 h-4 text-emerald-500" />;
      case 'insight':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" />
            <span>Smart Notifications Center</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Calibrated financial alerts, bill deadlines, and spending threshold notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(prev => !prev)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Alert Preferences</span>
          </button>

          <button
            onClick={markAllNotificationsRead}
            className="px-3.5 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark All Read</span>
          </button>
        </div>
      </div>

      {/* Alert Preferences Panel (Toggleable) */}
      {showConfig && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3 animate-in fade-in duration-150">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Notification Rules & Thresholds
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Control which automated alerts trigger sound and in-app badges. No alarmist spam.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50/50 cursor-pointer">
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Budget 80% & 100% Thresholds
              </span>
              <input
                type="checkbox"
                checked={user.notificationPreferences.budgetThresholds}
                onChange={e =>
                  updateUser({
                    notificationPreferences: {
                      ...user.notificationPreferences,
                      budgetThresholds: e.target.checked,
                    },
                  })
                }
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50/50 cursor-pointer">
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Upcoming Bill Deadlines (7-day advance)
              </span>
              <input
                type="checkbox"
                checked={user.notificationPreferences.billReminders}
                onChange={e =>
                  updateUser({
                    notificationPreferences: {
                      ...user.notificationPreferences,
                      billReminders: e.target.checked,
                    },
                  })
                }
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50/50 cursor-pointer">
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Savings Goal Milestones (50%, 75%, 100%)
              </span>
              <input
                type="checkbox"
                checked={user.notificationPreferences.goalMilestones}
                onChange={e =>
                  updateUser({
                    notificationPreferences: {
                      ...user.notificationPreferences,
                      goalMilestones: e.target.checked,
                    },
                  })
                }
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50/50 cursor-pointer">
              <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                Weekly Cash Velocity Digest
              </span>
              <input
                type="checkbox"
                checked={user.notificationPreferences.weeklySummaries}
                onChange={e =>
                  updateUser({
                    notificationPreferences: {
                      ...user.notificationPreferences,
                      weeklySummaries: e.target.checked,
                    },
                  })
                }
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto">
        {(['all', 'unread', 'budget', 'bill', 'savings'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize whitespace-nowrap transition-colors ${
              activeFilter === tab
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              No notifications matching this filter
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Your financial ledger and budget boundaries are in normal parameters.
            </p>
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                !n.read
                  ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 shadow-xs ring-1 ring-emerald-500/20'
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 opacity-80'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                  {getIconForType(n.type)}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      {n.title}
                    </h3>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1.5 tabular-nums">
                    {n.timestamp}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {n.linkTab && (
                  <button
                    onClick={() => {
                      markNotificationRead(n.id);
                      setActiveTab(n.linkTab as AppTab);
                    }}
                    className="p-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 rounded-lg flex items-center gap-1"
                    title="Open related section"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(n.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Dismiss notification"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
