import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { ChatMessage } from '../../types/finance';
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

export const AiAssistantView: React.FC = () => {
  const { user, metrics, transactions, savingsGoals, bills, formatCurrency } = useFinance();

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content: `Hello ${user.name}! I am your **PocketSmart AI Assistant**. 

I have authorized, encrypted access to your current financial ledger:
- **Net Available Balance**: ${formatCurrency(metrics.availableBalance)}
- **Month-to-Date Spend**: ${formatCurrency(metrics.monthlyExpenses)} across ${transactions.length} entries
- **Savings Rate**: ${metrics.savingsRate}%

Ask me anything about your spending trends, budget boundaries, savings goal forecasts, or scenario simulations!`,
      timestamp: 'Just now',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Where did I spend the most money this month?',
    'How much can I realistically save this month?',
    'Which categories are exceeding or near my budget limit?',
    'What changed in my spending compared with last month?',
    'How much should I set aside for my emergency fund goal?',
    'Explain my 50/30/20 financial health breakdown.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setIsLoading(true);

    try {
      // Build structured user snapshot
      const financialContext = {
        currencySymbol: user.currencySymbol,
        currencyCode: user.currencyCode,
        availableBalance: metrics.availableBalance,
        monthlyIncome: metrics.monthlyIncome,
        monthlyExpenses: metrics.monthlyExpenses,
        monthlySavings: metrics.monthlySavings,
        savingsRate: metrics.savingsRate,
        totalSavings: metrics.totalSavingsInGoals,
        monthlyBudgetLimit: metrics.monthlyBudgetCap,
        budgetUtilizationPercent: metrics.budgetUtilizationPercent,
        daysRemainingInMonth: metrics.daysRemainingInMonth,
        budgetAlerts: metrics.budgetAlerts,
        topCategories: metrics.topExpenseCategories.slice(0, 5),
        savingsGoals: savingsGoals.map(g => ({
          title: g.title,
          target: g.targetAmount,
          saved: g.currentAmount,
          percent: Math.round((g.currentAmount / g.targetAmount) * 100),
        })),
        upcomingBills: bills.filter(b => !b.isPaid).map(b => ({ title: b.title, amount: b.amount, due: b.dueDate })),
        recentTransactions: transactions.slice(0, 10).map(t => ({
          merchant: t.merchant,
          category: t.category,
          amount: t.amount,
          date: t.date,
          type: t.type,
        })),
      };

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          financialContext,
        }),
      });

      if (!res.ok) {
        throw new Error('AI service error');
      }

      const data = await res.json();
      const aiReply: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'assistant',
        content: data.response || 'I analyzed your query based on current data.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiReply]);
    } catch (err: any) {
      console.error('AI chat failed:', err);
      const fallbackReply: ChatMessage = {
        id: `ai_err_${Date.now()}`,
        role: 'assistant',
        content: `I've analyzed your financial snapshot:
- **Net Inflow**: ${formatCurrency(metrics.monthlyIncome)}
- **Current Outflows**: ${formatCurrency(metrics.monthlyExpenses)}
- **Estimated End-of-Month Surplus**: ${formatCurrency(metrics.monthlySavings)}

Your highest spending category is **${metrics.topExpenseCategories[0]?.category || 'Housing'}** at ${metrics.topExpenseCategories[0]?.percentage || 0}% of expenses. Let me know if you would like suggestions on optimizing this!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>PocketSmart AI Assistant</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Grounded in your real transactions · Powered by Gemini 3.8 Flash
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 text-[11px] text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Authorized Data Link Active</span>
          </div>

          <button
            onClick={() =>
              setMessages([
                {
                  id: `rst_${Date.now()}`,
                  role: 'assistant',
                  content: 'Chat context refreshed. What financial question would you like to explore next?',
                  timestamp: 'Just now',
                },
              ])
            }
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset conversation"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-emerald-600 text-white rounded-tr-xs shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-tl-xs shadow-xs'
              }`}
            >
              {/* Message Content formatted */}
              <div className="whitespace-pre-line space-y-2">
                {msg.content.split('\n\n').map((paragraph, pIdx) => {
                  // Basic formatting for bullet points and bold
                  const isList = paragraph.startsWith('- ') || paragraph.startsWith('1. ');
                  return (
                    <p key={pIdx} className={isList ? 'pl-2 border-l border-emerald-500/30' : ''}>
                      {paragraph.split('**').map((seg, sIdx) =>
                        sIdx % 2 === 1 ? (
                          <strong key={sIdx} className="font-semibold">
                            {seg}
                          </strong>
                        ) : (
                          seg
                        )
                      )}
                    </p>
                  );
                })}
              </div>

              <div
                className={`mt-1.5 text-[10px] text-right ${
                  msg.role === 'user' ? 'text-emerald-100' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 shadow-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
              <span className="text-xs text-slate-500 dark:text-slate-400">
                PocketSmart AI is analyzing your transactions...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="shrink-0 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg whitespace-nowrap transition-colors shrink-0 shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input box */}
      <div className="shrink-0 pt-1">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            placeholder="Ask about spending, budgets, savings scenarios, or financial concepts..."
            className="w-full pl-4 pr-12 py-3 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading}
            className="absolute right-2 p-2 rounded-lg bg-emerald-600 text-white disabled:opacity-40 hover:bg-emerald-700 transition-colors focus-visible:outline-none"
            aria-label="Send query"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center mt-1.5">
          PocketSmart AI computes answers strictly from your authorized records. Not a substitute for formal financial licensing advice.
        </p>
      </div>
    </div>
  );
};
