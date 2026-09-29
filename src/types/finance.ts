export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
  | 'Food & Dining'
  | 'Transportation'
  | 'Housing'
  | 'Utilities'
  | 'Shopping'
  | 'Healthcare'
  | 'Entertainment'
  | 'Education'
  | 'Travel'
  | 'Investments'
  | 'Salary'
  | 'Freelance'
  | 'Other';

export type PaymentMethod =
  | 'UPI'
  | 'Credit Card'
  | 'Debit Card'
  | 'Net Banking'
  | 'Cash';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  date: string; // YYYY-MM-DD
  merchant: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  receiptUrl?: string;
  isRecurring?: boolean;
}

export interface BudgetCategory {
  id: string;
  category: TransactionCategory;
  monthlyLimit: number;
  period: string; // e.g. '2026-09'
}

export interface GoalContribution {
  id: string;
  amount: number;
  date: string;
  note?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // YYYY-MM-DD
  category: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
  contributions: GoalContribution[];
}

export interface BillReminder {
  id: string;
  title: string;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  category: TransactionCategory;
  recurring: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  isPaid: boolean;
  paymentMethod?: PaymentMethod;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'budget' | 'bill' | 'savings' | 'insight' | 'system';
  read: boolean;
  timestamp: string;
  linkTab?: string;
}

export interface FinancialInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'warning' | 'achievement' | 'tip';
  actionText?: string;
  actionTab?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  currencyCode: 'INR' | 'USD' | 'EUR' | 'GBP';
  currencySymbol: '₹' | '$' | '€' | '£';
  avatarUrl: string;
  isLoggedIn: boolean;
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  monthlyBudgetCap: number;
  notificationPreferences: {
    budgetThresholds: boolean;
    billReminders: boolean;
    goalMilestones: boolean;
    weeklySummaries: boolean;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface EducationLesson {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  keyTakeaway: string;
  calculatorType?: 'compound' | 'emergency' | 'debt';
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}
