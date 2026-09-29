/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AuthModal } from './components/auth/AuthModal';
import { AddTransactionModal } from './components/transactions/AddTransactionModal';
import { ReceiptScannerModal } from './components/transactions/ReceiptScannerModal';

import { DashboardView } from './components/dashboard/DashboardView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { BudgetsView } from './components/budgets/BudgetsView';
import { AiAssistantView } from './components/ai/AiAssistantView';
import { SavingsGoalsView } from './components/savings/SavingsGoalsView';
import { ReportsView } from './components/reports/ReportsView';
import { EducationView } from './components/education/EducationView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SettingsView } from './components/settings/SettingsView';

const MainAppContent: React.FC = () => {
  const { activeTab } = useFinance();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Top Bar following Top Bar Contract */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
      />

      <div className="flex-1 flex">
        {/* Left Sidebar (Desktop + Mobile Drawer) */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'transactions' && <TransactionsView />}
            {activeTab === 'budgets' && <BudgetsView />}
            {activeTab === 'ai' && <AiAssistantView />}
            {activeTab === 'savings' && <SavingsGoalsView />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'education' && <EducationView />}
            {activeTab === 'notifications' && <NotificationsView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>

          {/* Simple, unpretentious footer per design constitution */}
          <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-900/50 text-[11px] text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <span>© 2026 PocketSmart AI. Your Smart Pocket. Your Smarter Future.</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Non-custodial Ledger</span>
              <span aria-hidden="true">·</span>
              <span>256-bit Encrypted Local Storage</span>
              <span aria-hidden="true">·</span>
              <span>RBI Account Aggregator Ready</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Modals */}
      <AddTransactionModal />
      <ReceiptScannerModal />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainAppContent />
    </FinanceProvider>
  );
}
