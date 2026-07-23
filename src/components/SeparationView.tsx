import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, ShieldAlert } from 'lucide-react';

export const SeparationView: React.FC = () => {
  const { persons, episodes, language } = useApp();

  const [selectedPersonId, setSelectedPersonId] = useState(persons[0]?.id || '');
  const selectedPerson = persons.find(p => p.id === selectedPersonId) || persons[0];
  const selectedEpisode = episodes.find(e => e.personId === selectedPerson?.id) || episodes[0];

  const [lastWorkingDay, setLastWorkingDay] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [separationType, setSeparationType] = useState<'Resignation' | 'Contract Expiry' | 'Retirement'>('Resignation');
  const [unusedLeaveDays, setUnusedLeaveDays] = useState(5.5);
  const [approvedDeductions, setApprovedDeductions] = useState(150);

  // Settlement calculations (Estimator only)
  const basicSalary = selectedEpisode?.basicSalaryRM || 4500;
  const dailyRate = basicSalary / 26; // EA rate approximation
  const leaveEncashmentRM = Math.round(dailyRate * unusedLeaveDays);
  const estimatedNet = basicSalary + leaveEncashmentRM - approvedDeductions;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-slate-700">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <LogOut className="w-4 h-4 text-amber-400" />
              {language === 'zh' ? '离职与 Final Settlement 估算工作表' : 'Offboarding & Final Employment Settlement Worksheet'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate Resignation Acceptance, Contract Expiry, or Retirement documents with estimated leave encashment and clearance checklist.
            </p>
          </div>
        </div>

        {/* Disclaimer Banner */}
        <div className="mt-4 p-3.5 bg-amber-950/70 border border-amber-800 text-amber-200 rounded-xl text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-300">
            <ShieldAlert className="w-4 h-4" /> Estimated Settlement Record Disclaimer
          </div>
          <p className="text-[11px] leading-relaxed">
            "Estimated Settlement Record — Final payroll calculation must be confirmed by the employer's payroll or finance function." BBH system does not perform statutory PCB/EPF/SOCSO tax deductions or full payroll filings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 text-xs">
          {/* Left Form */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Offboarding Parameters</h3>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Select Employee *</label>
                <select
                  value={selectedPersonId}
                  onChange={e => setSelectedPersonId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-semibold"
                >
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.nricOrPassport})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Separation Type</label>
                  <select
                    value={separationType}
                    onChange={e => setSeparationType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  >
                    <option value="Resignation">Voluntary Resignation</option>
                    <option value="Contract Expiry">Contract Expiry</option>
                    <option value="Retirement">Retirement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Last Working Day *</label>
                  <input
                    type="date"
                    value={lastWorkingDay}
                    onChange={e => setLastWorkingDay(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1">Unused Annual Leave (Days)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={unusedLeaveDays}
                    onChange={e => setUnusedLeaveDays(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Approved Deductions (RM)</label>
                  <input
                    type="number"
                    value={approvedDeductions}
                    onChange={e => setApprovedDeductions(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <button
                onClick={() => alert(`Resignation Acceptance Letter generated for ${selectedPerson?.fullName}!`)}
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl shadow transition"
              >
                Generate Resignation Acceptance Letter & Clearance Checklist
              </button>
            </div>
          </div>

          {/* Right Worksheet Calculation Preview */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Final Settlement Estimator Breakdown</h3>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between border-b border-slate-700 pb-2 font-bold text-slate-200">
                <span>{selectedPerson?.fullName}</span>
                <span>{selectedEpisode?.jobTitle}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Basic Salary (Current Month):</span>
                <span className="font-semibold">RM {basicSalary.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Unused Leave Encashment ({unusedLeaveDays} days @ RM {dailyRate.toFixed(2)}/day):</span>
                <span className="font-semibold text-teal-300">+ RM {leaveEncashmentRM.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Approved Deductions (Access Card/Laptop):</span>
                <span className="font-semibold text-rose-300">- RM {approvedDeductions.toLocaleString()}</span>
              </div>

              <div className="flex justify-between border-t border-slate-700 pt-3 text-sm font-extrabold text-teal-400">
                <span>Estimated Net Settlement Amount:</span>
                <span>RM {estimatedNet.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
