import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Transaction,
  BudgetCategory,
  SavingsGoal,
  BillReminder,
  NotificationItem,
  UserProfile,
  FinancialInsight,
  TransactionCategory,
} from '../types/finance';
import {
  INITIAL_USER,
  INITIAL_TRANSACTIONS,
  INITIAL_BUDGETS,
  INITIAL_SAVINGS_GOALS,
  INITIAL_BILLS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export type AppTab =
  | 'dashboard'
  | 'transactions'
  | 'budgets'
  | 'ai'
  | 'savings'
  | 'reports'
  | 'education'
  | 'notifications'
  | 'settings';

export type TimeRange = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

interface FinanceContextType {
  user: UserProfile;
  login: (email: string, pass: string, name?: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  resetToSampleData: () => void;
  clearAllData: () => void;

  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;

  theme: 'light' | 'dark';
  toggleTheme: () => void;

  timeRange: TimeRange;
  setTimeRange: (range: TimeRange) => void;

  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => Transaction;
  editTransaction: (id: string, updates: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  importTransactions: (newTxs: Transaction[]) => void;

  budgets: BudgetCategory[];
  updateBudgetLimit: (category: TransactionCategory, newLimit: number) => void;
  addBudgetCategory: (category: TransactionCategory, limit: number) => void;
  deleteBudgetCategory: (id: string) => void;

  savingsGoals: SavingsGoal[];
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'contributions' | 'createdAt' | 'status'>) => void;
  editSavingsGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  recordGoalContribution: (goalId: string, amount: number, note?: string) => void;
  toggleGoalStatus: (goalId: string) => void;

  bills: BillReminder[];
  addBill: (bill: Omit<BillReminder, 'id' | 'isPaid'>) => void;
  payBill: (billId: string) => void;
  deleteBill: (billId: string) => void;

  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;

  aiInsights: FinancialInsight[];
  refreshAiInsights: () => Promise<void>;
  isLoadingInsights: boolean;

  formatCurrency: (amount: number, options?: { hideSymbol?: boolean; round?: boolean }) => string;

  // Computed Financial Metrics
  metrics: {
    availableBalance: number;
    monthlyIncome: number;
    monthlyExpenses: number;
    monthlySavings: number;
    savingsRate: number;
    totalSavingsInGoals: number;
    monthlyBudgetCap: number;
    budgetSpent: number;
    budgetRemaining: number;
    budgetUtilizationPercent: number;
    daysRemainingInMonth: number;
    topExpenseCategories: Array<{ category: TransactionCategory; amount: number; percentage: number }>;
    categorySpendingMap: Record<string, number>;
    needsWantsSavings: {
      needs: { amount: number; percentage: number; targetPercentage: number };
      wants: { amount: number; percentage: number; targetPercentage: number };
      savings: { amount: number; percentage: number; targetPercentage: number };
    };
    budgetAlerts: string[];
  };

  // Modals
  isAddTxModalOpen: boolean;
  setIsAddTxModalOpen: (open: boolean) => void;
  isReceiptModalOpen: boolean;
  setIsReceiptModalOpen: (open: boolean) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: 'ps_user_v1',
  TRANSACTIONS: 'ps_transactions_v1',
  BUDGETS: 'ps_budgets_v1',
  GOALS: 'ps_goals_v1',
  BILLS: 'ps_bills_v1',
  NOTIFICATIONS: 'ps_notifs_v1',
  THEME: 'ps_theme_v1',
  INSIGHTS: 'ps_insights_v1',
};

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');

  // Core entities
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [budgets, setBudgets] = useState<BudgetCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
    } catch {
      return INITIAL_BUDGETS;
    }
  });

  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GOALS);
      return saved ? JSON.parse(saved) : INITIAL_SAVINGS_GOALS;
    } catch {
      return INITIAL_SAVINGS_GOALS;
    }
  });

  const [bills, setBills] = useState<BillReminder[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BILLS);
      return saved ? JSON.parse(saved) : INITIAL_BILLS;
    } catch {
      return INITIAL_BILLS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [aiInsights, setAiInsights] = useState<FinancialInsight[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSIGHTS);
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: '1',
              type: 'warning',
              title: 'Food & Dining Approaching Limit',
              description: 'You have utilized 75% of your food budget. Pace your dining delivery orders for the remaining 12 days.',
              actionText: 'Review Budget',
              actionTab: 'budgets',
            },
            {
              id: '2',
              type: 'opportunity',
              title: 'Emergency Fund within Reach',
              description: 'Allocating ₹15,000 from this month surplus will keep your safety fund on track for December.',
              actionText: 'Add Contribution',
              actionTab: 'savings',
            },
            {
              id: '3',
              type: 'achievement',
              title: '28% Net Savings Rate',
              description: 'Your savings rate outperforms the traditional 20% benchmark by 8 percentage points this month.',
              actionText: 'View Report',
              actionTab: 'reports',
            },
          ];
    } catch {
      return [];
    }
  });

  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isAddTxModalOpen, setIsAddTxModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSIGHTS, JSON.stringify(aiInsights));
  }, [aiInsights]);

  // Currency Formatter
  const formatCurrency = (amount: number, options?: { hideSymbol?: boolean; round?: boolean }) => {
    const val = options?.round ? Math.round(amount) : amount;
    const formatted = new Intl.NumberFormat(user.currencyCode === 'INR' ? 'en-IN' : 'en-US', {
      maximumFractionDigits: options?.round ? 0 : 2,
    }).format(val);

    if (options?.hideSymbol) return formatted;
    return `${user.currencySymbol}${formatted}`;
  };

  // Auth Operations
  const login = (email: string, _pass: string, name?: string) => {
    setUser(prev => ({
      ...prev,
      email,
      name: name || prev.name || 'User',
      isLoggedIn: true,
    }));
    return true;
  };

  const logout = () => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: false,
    }));
  };

  const updateUser = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  const resetToSampleData = () => {
    setUser(INITIAL_USER);
    setTransactions(INITIAL_TRANSACTIONS);
    setBudgets(INITIAL_BUDGETS);
    setSavingsGoals(INITIAL_SAVINGS_GOALS);
    setBills(INITIAL_BILLS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    setSavingsGoals([]);
    setBills([]);
    setNotifications([]);
  };

  // Transaction Operations
  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactions(prev => [newTx, ...prev]);

    // Check if budget exceeded
    if (tx.type === 'expense' && user.notificationPreferences.budgetThresholds) {
      const budget = budgets.find(b => b.category === tx.category);
      if (budget) {
        const totalCategorySpent = transactions
          .filter(t => t.type === 'expense' && t.category === tx.category)
          .reduce((sum, t) => sum + t.amount, 0) + tx.amount;

        const ratio = totalCategorySpent / budget.monthlyLimit;
        if (ratio >= 1.0) {
          addNotification({
            title: `Budget Limit Exceeded: ${tx.category}`,
            message: `You have spent ${user.currencySymbol}${totalCategorySpent.toLocaleString()} exceeding your ${user.currencySymbol}${budget.monthlyLimit.toLocaleString()} monthly limit!`,
            type: 'budget',
            linkTab: 'budgets',
          });
        } else if (ratio >= 0.8) {
          addNotification({
            title: `Budget Alert: ${tx.category} at ${(ratio * 100).toFixed(0)}%`,
            message: `You have reached ${user.currencySymbol}${totalCategorySpent.toLocaleString()} of your ${user.currencySymbol}${budget.monthlyLimit.toLocaleString()} limit.`,
            type: 'budget',
            linkTab: 'budgets',
          });
        }
      }
    }

    return newTx;
  };

  const editTransaction = (id: string, updates: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const importTransactions = (newTxs: Transaction[]) => {
    setTransactions(prev => [...newTxs, ...prev]);
  };

  // Budget Operations
  const updateBudgetLimit = (category: TransactionCategory, newLimit: number) => {
    setBudgets(prev => {
      const exists = prev.find(b => b.category === category);
      if (exists) {
        return prev.map(b => (b.category === category ? { ...b, monthlyLimit: newLimit } : b));
      }
      return [
        ...prev,
        {
          id: `b_${Date.now()}`,
          category,
          monthlyLimit: newLimit,
          period: '2026-09',
        },
      ];
    });
  };

  const addBudgetCategory = (category: TransactionCategory, limit: number) => {
    updateBudgetLimit(category, limit);
  };

  const deleteBudgetCategory = (id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  };

  // Savings Goal Operations
  const addSavingsGoal = (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'contributions' | 'createdAt' | 'status'>) => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `goal_${Date.now()}`,
      currentAmount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      contributions: [],
    };
    setSavingsGoals(prev => [newGoal, ...prev]);
  };

  const editSavingsGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setSavingsGoals(prev => prev.map(g => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsGoals(prev => prev.filter(g => g.id !== id));
  };

  const recordGoalContribution = (goalId: string, amount: number, note?: string) => {
    setSavingsGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId) return g;
        const newContr = {
          id: `c_${Date.now()}`,
          amount,
          date: new Date().toISOString().split('T')[0],
          note: note || 'Manual contribution',
        };
        const newTotal = g.currentAmount + amount;
        const isCompleted = newTotal >= g.targetAmount;

        if (isCompleted && user.notificationPreferences.goalMilestones) {
          addNotification({
            title: `Goal Accomplished: ${g.title}!`,
            message: `Congratulations! You reached 100% of your ${formatCurrency(g.targetAmount)} target.`,
            type: 'savings',
            linkTab: 'savings',
          });
        }

        return {
          ...g,
          currentAmount: newTotal,
          status: isCompleted ? 'completed' : g.status,
          contributions: [newContr, ...g.contributions],
        };
      })
    );

    // Optionally create a transaction entry for the contribution
    addTransaction({
      type: 'expense',
      amount,
      category: 'Investments',
      date: new Date().toISOString().split('T')[0],
      merchant: `Savings Goal: ${savingsGoals.find(g => g.id === goalId)?.title || 'Goal'}`,
      paymentMethod: 'UPI',
      notes: note || 'Contribution towards savings goal',
    });
  };

  const toggleGoalStatus = (goalId: string) => {
    setSavingsGoals(prev =>
      prev.map(g => {
        if (g.id !== goalId) return g;
        const nextStatus = g.status === 'active' ? 'paused' : 'active';
        return { ...g, status: nextStatus };
      })
    );
  };

  // Bill Operations
  const addBill = (bill: Omit<BillReminder, 'id' | 'isPaid'>) => {
    const newBill: BillReminder = {
      ...bill,
      id: `bill_${Date.now()}`,
      isPaid: false,
    };
    setBills(prev => [...prev, newBill]);
  };

  const payBill = (billId: string) => {
    const targetBill = bills.find(b => b.id === billId);
    if (!targetBill) return;

    setBills(prev => prev.map(b => (b.id === billId ? { ...b, isPaid: true } : b)));

    // Record as expense transaction
    addTransaction({
      type: 'expense',
      amount: targetBill.amount,
      category: targetBill.category,
      date: new Date().toISOString().split('T')[0],
      merchant: targetBill.title,
      paymentMethod: targetBill.paymentMethod || 'UPI',
      notes: `Bill payment for ${targetBill.title}`,
    });

    addNotification({
      title: `Bill Paid: ${targetBill.title}`,
      message: `Successfully recorded payment of ${formatCurrency(targetBill.amount)}.`,
      type: 'bill',
      linkTab: 'dashboard',
    });
  };

  const deleteBill = (billId: string) => {
    setBills(prev => prev.filter(b => b.id !== billId));
  };

  // Notification Operations
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: NotificationItem = {
      ...item,
      id: `n_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      read: false,
      timestamp: 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const unreadNotificationCount = useMemo(
    () => notifications.filter(n => !n.read).length,
    [notifications]
  );

  // Financial Metrics Computation
  const metrics = useMemo(() => {
    // Current month filter (assume September 2026 based on mock data)
    const currentMonthPrefix = '2026-09';
    const monthTxs = transactions.filter(t => t.date.startsWith(currentMonthPrefix));

    const monthlyIncome = monthTxs
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = monthTxs
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlySavings = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0;

    // All-time balance: sum of all income minus expenses
    const totalAllIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalAllExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const availableBalance = Math.max(0, totalAllIncome - totalAllExpense);

    const totalSavingsInGoals = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);

    // Budget computations
    const categorySpendingMap: Record<string, number> = {};
    for (const t of monthTxs) {
      if (t.type === 'expense') {
        categorySpendingMap[t.category] = (categorySpendingMap[t.category] || 0) + t.amount;
      }
    }

    const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.monthlyLimit, 0) || user.monthlyBudgetCap || 50000;
    const budgetSpent = monthlyExpenses;
    const budgetRemaining = Math.max(0, totalBudgetLimit - budgetSpent);
    const budgetUtilizationPercent = totalBudgetLimit > 0 ? Math.min(100, Math.round((budgetSpent / totalBudgetLimit) * 100)) : 0;

    // Days remaining in month
    const today = new Date();
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemainingInMonth = Math.max(1, lastDayOfMonth - today.getDate());

    // Top Expense Categories
    const topExpenseCategories = Object.entries(categorySpendingMap)
      .map(([cat, amount]) => ({
        category: cat as TransactionCategory,
        amount,
        percentage: monthlyExpenses > 0 ? Math.round((amount / monthlyExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    // 50/30/20 breakdown
    const needsCategories = ['Housing', 'Utilities', 'Food & Dining', 'Healthcare', 'Transportation'];
    const wantsCategories = ['Shopping', 'Entertainment', 'Travel', 'Other'];

    let needsAmount = 0;
    let wantsAmount = 0;
    for (const [cat, amt] of Object.entries(categorySpendingMap)) {
      if (needsCategories.includes(cat)) {
        needsAmount += amt;
      } else if (wantsCategories.includes(cat)) {
        wantsAmount += amt;
      }
    }

    const baseIncome = monthlyIncome || 1;
    const needsPercentage = Math.round((needsAmount / baseIncome) * 100);
    const wantsPercentage = Math.round((wantsAmount / baseIncome) * 100);
    const actualSavingsPercentage = Math.max(0, Math.round((monthlySavings / baseIncome) * 100));

    // Budget alerts
    const budgetAlerts: string[] = [];
    for (const b of budgets) {
      const spent = categorySpendingMap[b.category] || 0;
      if (spent >= b.monthlyLimit) {
        budgetAlerts.push(`${b.category} exceeded monthly limit (${formatCurrency(spent)} / ${formatCurrency(b.monthlyLimit)})`);
      } else if (spent >= b.monthlyLimit * 0.8) {
        budgetAlerts.push(`${b.category} near limit at ${Math.round((spent / b.monthlyLimit) * 100)}% (${formatCurrency(spent)} / ${formatCurrency(b.monthlyLimit)})`);
      }
    }

    return {
      availableBalance,
      monthlyIncome,
      monthlyExpenses,
      monthlySavings,
      savingsRate,
      totalSavingsInGoals,
      monthlyBudgetCap: totalBudgetLimit,
      budgetSpent,
      budgetRemaining,
      budgetUtilizationPercent,
      daysRemainingInMonth,
      topExpenseCategories,
      categorySpendingMap,
      needsWantsSavings: {
        needs: { amount: needsAmount, percentage: needsPercentage, targetPercentage: 50 },
        wants: { amount: wantsAmount, percentage: wantsPercentage, targetPercentage: 30 },
        savings: { amount: monthlySavings, percentage: actualSavingsPercentage, targetPercentage: 20 },
      },
      budgetAlerts,
    };
  }, [transactions, budgets, savingsGoals, user]);

  // AI Insights refresher
  const refreshAiInsights = async () => {
    setIsLoadingInsights(true);
    try {
      const payload = {
        financialContext: {
          currencySymbol: user.currencySymbol,
          currencyCode: user.currencyCode,
          monthlyIncome: metrics.monthlyIncome,
          monthlyExpenses: metrics.monthlyExpenses,
          monthlySavings: metrics.monthlySavings,
          budgetUtilizationPercent: metrics.budgetUtilizationPercent,
          topCategories: metrics.topExpenseCategories.slice(0, 4),
          savingsGoals: savingsGoals.map(g => ({ title: g.title, progress: `${Math.round((g.currentAmount / g.targetAmount) * 100)}%` })),
        },
      };

      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.insights) && data.insights.length > 0) {
          setAiInsights(data.insights);
        }
      }
    } catch (err) {
      console.error('Failed to fetch AI insights:', err);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <FinanceContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        resetToSampleData,
        clearAllData,

        activeTab,
        setActiveTab,

        theme,
        toggleTheme,

        timeRange,
        setTimeRange,

        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        importTransactions,

        budgets,
        updateBudgetLimit,
        addBudgetCategory,
        deleteBudgetCategory,

        savingsGoals,
        addSavingsGoal,
        editSavingsGoal,
        deleteSavingsGoal,
        recordGoalContribution,
        toggleGoalStatus,

        bills,
        addBill,
        payBill,
        deleteBill,

        notifications,
        unreadNotificationCount,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        addNotification,

        aiInsights,
        refreshAiInsights,
        isLoadingInsights,

        formatCurrency,
        metrics,

        isAddTxModalOpen,
        setIsAddTxModalOpen,
        isReceiptModalOpen,
        setIsReceiptModalOpen,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
