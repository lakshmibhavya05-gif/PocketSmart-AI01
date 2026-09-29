import React, { useState } from 'react';
import { useFinance, AppTab } from '../../context/FinanceContext';
import {
  Bell,
  Sun,
  Moon,
  Plus,
  Receipt,
  Menu,
  X,
  User,
  LogOut,
  Wallet,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onToggleMobileSidebar }) => {
  const {
    user,
    logout,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    unreadNotificationCount,
    setIsAddTxModalOpen,
    setIsReceiptModalOpen,
    formatCurrency,
    metrics,
  } = useFinance();

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const navLinks: Array<{ id: AppTab; label: string }> = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'transactions', label: 'Transactions' },
    { id: 'budgets', label: 'Budgets' },
    { id: 'ai', label: 'AI Assistant' },
    { id: 'savings', label: 'Savings Goals' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with subtle accent dot */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2 group text-left focus-visible:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-emerald-700 transition-colors">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center">
              PocketSmart<span className="text-emerald-600 dark:text-emerald-400 ml-0.5">AI</span>
            </span>
          </button>
        </div>

        {/* Zone 2: 4-6 clean text navigation links (Hidden on mobile/tablet) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap rounded-md relative ${
                  isActive
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/40 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions & utility controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Transaction */}
          <button
            onClick={() => setIsAddTxModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Transaction</span>
          </button>

          {/* Quick Scan Receipt */}
          <button
            onClick={() => setIsReceiptModalOpen(true)}
            title="Scan Receipt with AI"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none"
            aria-label="Scan receipt"
          >
            <Receipt className="w-4 h-4" />
          </button>

          {/* Notifications bell */}
          <button
            onClick={() => setActiveTab('notifications')}
            className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile / Auth */}
          <div className="relative">
            {user.isLoggedIn ? (
              <button
                onClick={() => setIsProfileDropdownOpen(prev => !prev)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-500/50 transition-all focus-visible:outline-none"
                aria-label="User account menu"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
            )}

            {/* Profile Dropdown */}
            {isProfileDropdownOpen && user.isLoggedIn && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                onMouseLeave={() => setIsProfileDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 pt-1">
                    <span>Balance</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatCurrency(metrics.availableBalance)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTab('settings');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Account Settings
                </button>

                <button
                  onClick={() => {
                    setActiveTab('ai');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  AI Financial Assistant
                </button>

                <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                <button
                  onClick={() => {
                    logout();
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
