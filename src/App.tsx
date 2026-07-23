import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CompanyProfileView } from './components/CompanyProfileView';
import { EmployeesView } from './components/EmployeesView';
import { DocumentGeneratorView } from './components/DocumentGeneratorView';
import { TemplatesView } from './components/TemplatesView';
import { DisciplinaryCasesView } from './components/DisciplinaryCasesView';
import { EmploymentChangesView } from './components/EmploymentChangesView';
import { SeparationView } from './components/SeparationView';
import { ApprovalsView } from './components/ApprovalsView';
import { PoliciesHolidaysView } from './components/PoliciesHolidaysView';
import { AuditLogsView } from './components/AuditLogsView';
import { SubscriptionView } from './components/SubscriptionView';
import { VerificationPortalView } from './components/VerificationPortalView';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <main className="flex-1 bg-[#0A0D12] p-6 md:p-8 overflow-y-auto">
      {activeTab === 'dashboard' && <DashboardView />}
      {activeTab === 'company' && <CompanyProfileView />}
      {activeTab === 'employees' && <EmployeesView />}
      {activeTab === 'generator' && <DocumentGeneratorView />}
      {activeTab === 'templates' && <TemplatesView />}
      {activeTab === 'cases' && <DisciplinaryCasesView />}
      {activeTab === 'changes' && <EmploymentChangesView />}
      {activeTab === 'separation' && <SeparationView />}
      {activeTab === 'approvals' && <ApprovalsView />}
      {activeTab === 'policies' && <PoliciesHolidaysView />}
      {activeTab === 'audit' && <AuditLogsView />}
      {activeTab === 'subscription' && <SubscriptionView />}
      {activeTab === 'verify' && <VerificationPortalView />}
    </main>
  );
};

export function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#0A0D12] text-[#E0E0E0] flex flex-col font-sans selection:bg-[#2ECC71] selection:text-[#0A0D12]">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainContent />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
