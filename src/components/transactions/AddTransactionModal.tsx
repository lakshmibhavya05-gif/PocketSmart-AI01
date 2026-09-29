import React, { useState, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  TransactionType,
  TransactionCategory,
  PaymentMethod,
} from '../../types/finance';
import { X, Sparkles, Calendar, DollarSign, Tag, CreditCard, FileText } from 'lucide-react';

export const AddTransactionModal: React.FC = () => {
  const {
    isAddTxModalOpen,
    setIsAddTxModalOpen,
    addTransaction,
    user,
  } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState<string>('');
  const [merchant, setMerchant] = useState<string>('');
  const [category, setCategory] = useState<TransactionCategory>('Food & Dining');
  const [suggestedCategory, setSuggestedCategory] = useState<TransactionCategory | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [notes, setNotes] = useState<string>('');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  const expenseCategories: TransactionCategory[] = [
    'Food & Dining',
    'Transportation',
    'Housing',
    'Utilities',
    'Shopping',
    'Healthcare',
    'Entertainment',
    'Education',
    'Travel',
    'Investments',
    'Other',
  ];

  const incomeCategories: TransactionCategory[] = [
    'Salary',
    'Freelance',
    'Investments',
    'Other',
  ];

  // Auto-category suggestion engine based on merchant keywords
  useEffect(() => {
    const m = merchant.trim().toLowerCase();
    if (!m) {
      setSuggestedCategory(null);
      return;
    }

    let detected: TransactionCategory | null = null;
    let detectedType: TransactionType | null = null;

    if (m.includes('swiggy') || m.includes('zomato') || m.includes('mcdonald') || m.includes('restaurant') || m.includes('cafe') || m.includes('coffee') || m.includes('grocer') || m.includes('supermarket') || m.includes('food')) {
      detected = 'Food & Dining';
      detectedType = 'expense';
    } else if (m.includes('uber') || m.includes('ola') || m.includes('metro') || m.includes('petrol') || m.includes('fuel') || m.includes('diesel') || m.includes('rapido') || m.includes('cab')) {
      detected = 'Transportation';
      detectedType = 'expense';
    } else if (m.includes('amazon') || m.includes('flipkart') || m.includes('myntra') || m.includes('zara') || m.includes('store') || m.includes('mall') || m.includes('retail')) {
      detected = 'Shopping';
      detectedType = 'expense';
    } else if (m.includes('bescom') || m.includes('electricity') || m.includes('airtel') || m.includes('jio') || m.includes('wifi') || m.includes('water') || m.includes('broadband') || m.includes('gas')) {
      detected = 'Utilities';
      detectedType = 'expense';
    } else if (m.includes('rent') || m.includes('maintenance') || m.includes('society') || m.includes('apartment') || m.includes('landlord')) {
      detected = 'Housing';
      detectedType = 'expense';
    } else if (m.includes('netflix') || m.includes('spotify') || m.includes('cinema') || m.includes('pvr') || m.includes('movie') || m.includes('steam') || m.includes('hotstar') || m.includes('prime')) {
      detected = 'Entertainment';
      detectedType = 'expense';
    } else if (m.includes('hospital') || m.includes('pharmacy') || m.includes('apollo') || m.includes('doctor') || m.includes('clinic') || m.includes('medicine')) {
      detected = 'Healthcare';
      detectedType = 'expense';
    } else if (m.includes('school') || m.includes('college') || m.includes('udemy') || m.includes('coursera') || m.includes('course') || m.includes('book') || m.includes('tuition')) {
      detected = 'Education';
      detectedType = 'expense';
    } else if (m.includes('flight') || m.includes('hotel') || m.includes('makemytrip') || m.includes('booking') || m.includes('airbnb') || m.includes('indigo') || m.includes('train')) {
      detected = 'Travel';
      detectedType = 'expense';
    } else if (m.includes('salary') || m.includes('payroll') || m.includes('stipend')) {
      detected = 'Salary';
      detectedType = 'income';
    } else if (m.includes('freelance') || m.includes('client') || m.includes('consulting') || m.includes('upwork') || m.includes('fiverr')) {
      detected = 'Freelance';
      detectedType = 'income';
    } else if (m.includes('dividend') || m.includes('interest') || m.includes('mutual fund') || m.includes('zerodha') || m.includes('groww')) {
      detected = 'Investments';
    }

    if (detected) {
      setSuggestedCategory(detected);
      if (detectedType && detectedType !== type) {
        setType(detectedType);
      }
      setCategory(detected);
    } else {
      setSuggestedCategory(null);
    }
  }, [merchant]);

  if (!isAddTxModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    addTransaction({
      type,
      amount: numAmount,
      category,
      date,
      merchant: merchant.trim() || (type === 'income' ? 'Direct Credit' : 'General Purchase'),
      paymentMethod,
      notes: notes.trim() || undefined,
      isRecurring,
    });

    // Reset and close
    setAmount('');
    setMerchant('');
    setNotes('');
    setIsRecurring(false);
    setIsAddTxModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              +
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Record Transaction</h3>
          </div>
          <button
            onClick={() => setIsAddTxModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Segmented Type Controller */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (!expenseCategories.includes(category)) setCategory('Food & Dining');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                type === 'expense'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                if (!incomeCategories.includes(category)) setCategory('Salary');
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                type === 'income'
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Income
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Amount ({user.currencyCode})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold text-base">
                {user.currencySymbol}
              </span>
              <input
                type="number"
                step="any"
                min="0.01"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-8 pr-3 py-2 text-base font-semibold tabular-nums bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Merchant / Description with auto-suggest feedback */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
                {type === 'expense' ? 'Merchant or Store' : 'Source / Payer'}
              </label>
              {suggestedCategory && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <Sparkles className="w-3 h-3" />
                  Auto-categorized as {suggestedCategory}
                </span>
              )}
            </div>
            <input
              type="text"
              required
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              placeholder={type === 'expense' ? 'e.g. Swiggy, Uber, Supermarket' : 'e.g. Acme Corp, Client retainers'}
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TransactionCategory)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {(type === 'expense' ? expenseCategories : incomeCategories).map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="UPI">UPI (Google Pay, PhonePe, Paytm)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            {/* Recurring toggle */}
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={e => setIsRecurring(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>Recurring Monthly Bill / Outflow</span>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Shared bill with Rahul, reimbursable"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddTxModalOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors"
            >
              Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
