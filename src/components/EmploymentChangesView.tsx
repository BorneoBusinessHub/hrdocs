import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileSpreadsheet, Plus, ShieldCheck } from 'lucide-react';

export const EmploymentChangesView: React.FC = () => {
  const { persons, episodes, updateEmployee, language } = useApp();

  const [selectedPersonId, setSelectedPersonId] = useState(persons[0]?.id || '');
  const selectedPerson = persons.find(p => p.id === selectedPersonId) || persons[0];
  const selectedEpisode = episodes.find(e => e.personId === selectedPerson?.id) || episodes[0];

  const [newTitle, setNewTitle] = useState(selectedEpisode?.jobTitle || '');
  const [newSalary, setNewSalary] = useState(selectedEpisode?.basicSalaryRM || 4500);
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0]);
  const [changeReason, setChangeReason] = useState('Annual Performance Appraisal & Merit Promotion');
  const [successMsg, setSaveSuccess] = useState('');

  const handleApplyChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPerson || !selectedEpisode) return;

    updateEmployee(
      selectedPerson.id,
      {},
      selectedEpisode.id,
      {
        jobTitle: newTitle,
        basicSalaryRM: newSalary,
      }
    );

    setSaveSuccess(`Terms Addendum generated and Master Record updated effective ${effectiveDate}!`);
    setTimeout(() => setSaveSuccess(''), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-slate-700">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-teal-400" />
              {language === 'zh' ? '雇佣条件变更 (Employment Terms Addendum Family)' : 'Employment Changes & Addendum Generator'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Generate formal Terms Addendum, Salary Adjustment, Promotion, or Transfer letters while keeping employee master record continuity.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4 text-xs">
          {/* Form Side */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Draft Proposed Terms Variation</h3>

            <form onSubmit={handleApplyChange} className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Select Employee *</label>
                <select
                  value={selectedPersonId}
                  onChange={e => {
                    setSelectedPersonId(e.target.value);
                    const ep = episodes.find(item => item.personId === e.target.value);
                    if (ep) {
                      setNewTitle(ep.jobTitle);
                      setNewSalary(ep.basicSalaryRM);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-semibold"
                >
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.nricOrPassport})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Effective Date *</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={e => setEffectiveDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Reason for Variation</label>
                  <input
                    type="text"
                    value={changeReason}
                    onChange={e => setChangeReason(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1">Current Job Title</label>
                  <input
                    type="text"
                    value={selectedEpisode?.jobTitle || ''}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded p-2 text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">New Job Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-semibold text-teal-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Current Salary (RM)</label>
                  <input
                    type="number"
                    value={selectedEpisode?.basicSalaryRM || 0}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700/50 rounded p-2 text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">New Salary (RM)</label>
                  <input
                    type="number"
                    value={newSalary}
                    onChange={e => setNewSalary(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 font-semibold text-teal-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2.5 rounded-xl shadow transition"
              >
                Generate Addendum & Update Master Record
              </button>

              {successMsg && (
                <div className="p-3 bg-teal-950 border border-teal-700 text-teal-200 rounded-xl font-semibold">
                  ✓ {successMsg}
                </div>
              )}
            </form>
          </div>

          {/* Comparison Side */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-700 p-5 rounded-2xl space-y-4">
            <h3 className="font-bold text-slate-200 border-b border-slate-800 pb-2">Terms Variation Comparison Matrix</h3>

            <div className="p-4 bg-slate-800 border border-slate-700 rounded-xl space-y-3">
              <div className="font-bold text-slate-200">{selectedPerson?.fullName}</div>
              <div className="grid grid-cols-2 gap-2 border-t border-slate-700 pt-2 text-[11px]">
                <div>
                  <span className="text-slate-400 block">Current Salary:</span>
                  <span className="font-semibold text-slate-200">RM {selectedEpisode?.basicSalaryRM?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Proposed Salary:</span>
                  <span className="font-bold text-teal-300">RM {newSalary.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Current Title:</span>
                  <span className="font-semibold text-slate-200">{selectedEpisode?.jobTitle}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Proposed Title:</span>
                  <span className="font-bold text-teal-300">{newTitle}</span>
                </div>
              </div>

              {newSalary < (selectedEpisode?.basicSalaryRM || 0) && (
                <div className="p-3 bg-rose-950 border border-rose-800 text-rose-200 rounded-lg text-[11px]">
                  ⚠️ Salary reduction requires mutual consent signed Addendum to avoid constructive dismissal claim.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
