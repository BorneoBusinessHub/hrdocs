import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CaseStage, DisciplinaryCase } from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gavel,
  MessageSquare,
  Plus,
  Send,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export const DisciplinaryCasesView: React.FC = () => {
  const { cases, saveCase, addCaseMessage, persons, episodes, setActiveTab, language } = useApp();

  const [selectedCase, setSelectedCase] = useState<DisciplinaryCase>(cases[0] || null);
  const [showNewCaseModal, setShowNewCaseModal] = useState(false);
  const [newMessageText, setNewMessageText] = useState('');
  const [showReplyRecorder, setShowReplyRecorder] = useState(false);
  const [offlineReplyText, setOfflineReplyText] = useState('');

  // New Case Form
  const [newCaseEmpId, setNewCaseEmpId] = useState(persons[0]?.id || '');
  const [newAllegation, setNewAllegation] = useState('');
  const [newFacts, setNewFacts] = useState('');
  const [newDeadline, setNewDeadline] = useState(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText || !selectedCase) return;
    addCaseMessage(selectedCase.id, newMessageText, 'HR', 'Jessica Lim (HR Admin)');
    setNewMessageText('');
  };

  const handleRecordEmployeeReply = () => {
    if (!selectedCase || !offlineReplyText) return;
    const updatedCase: DisciplinaryCase = {
      ...selectedCase,
      stage: 'Employee Responded',
      employeeReply: {
        submittedAt: new Date().toISOString(),
        submittedVia: 'Recorded by HR (Offline Paper)',
        explanationText: offlineReplyText,
      },
    };
    saveCase(updatedCase);
    setSelectedCase(updatedCase);
    setShowReplyRecorder(false);
    setOfflineReplyText('');
  };

  const handleAdvanceStage = (nextStage: CaseStage) => {
    if (!selectedCase) return;
    const updated: DisciplinaryCase = {
      ...selectedCase,
      stage: nextStage,
      closedDate: nextStage === 'Case Closed' ? new Date().toISOString().split('T')[0] : undefined,
    };
    saveCase(updated);
    setSelectedCase(updated);
  };

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const person = persons.find(p => p.id === newCaseEmpId);
    const ep = episodes.find(e => e.personId === newCaseEmpId);

    const newCase: DisciplinaryCase = {
      id: `case-${Date.now()}`,
      caseNumber: `DISC-2026-${String(cases.length + 1).padStart(3, '0')}`,
      employeeEpisodeId: ep?.id || 'ep-001',
      employeeName: person?.fullName || 'Employee',
      department: ep?.department || 'Operations',
      incidentDate: new Date().toISOString().split('T')[0],
      location: 'Company Premises',
      allegationsSummary: newAllegation,
      detailedFacts: newFacts,
      policyReferenced: 'Company Code of Conduct Sec 3',
      previousWarningsCount: 0,
      stage: 'Show Cause Prepared',
      replyDeadline: newDeadline,
      assignedManager: 'HR Department',
      messagesThread: [
        {
          id: `msg-${Date.now()}`,
          sender: 'HR',
          senderName: 'HR Initiator',
          timestamp: new Date().toISOString(),
          text: `Case created with allegations: ${newAllegation}`,
        },
      ],
    };

    saveCase(newCase);
    setSelectedCase(newCase);
    setShowNewCaseModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-slate-700">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Gavel className="w-4 h-4 text-rose-400" />
              {language === 'zh' ? '纪律案件流程与时间线 (Show Cause 至 Domestic Inquiry)' : 'Disciplinary Case Lifecycle & Audit Timeline'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Integrated disciplinary case management tracking facts, show cause letters, employee explanations, warnings, and domestic inquiry notices.
            </p>
          </div>

          <button
            onClick={() => setShowNewCaseModal(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Create Disciplinary Case
          </button>
        </div>

        {/* Master-Detail Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
          {/* Cases List (4 cols) */}
          <div className="lg:col-span-4 space-y-2">
            {cases.map(c => (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-xs space-y-1.5 ${
                  selectedCase?.id === c.id
                    ? 'bg-slate-900 border-rose-500 shadow-sm'
                    : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-center font-bold text-slate-100">
                  <span>{c.caseNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-semibold">
                    {c.stage}
                  </span>
                </div>
                <div className="font-semibold text-slate-200">{c.employeeName}</div>
                <p className="text-slate-400 line-clamp-1">{c.allegationsSummary}</p>
              </div>
            ))}
          </div>

          {/* Case Detail Workspace (8 cols) */}
          {selectedCase && (
            <div className="lg:col-span-8 bg-slate-900 border border-slate-700 rounded-2xl p-5 text-xs space-y-5">
              {/* Header */}
              <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-rose-400 text-sm">{selectedCase.caseNumber}</span>
                    <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">{selectedCase.department}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{selectedCase.employeeName}</h3>
                  <p className="text-slate-300 mt-0.5">{selectedCase.allegationsSummary}</p>
                </div>

                <div className="text-right">
                  <div className="text-slate-400 text-[11px]">Reply Deadline:</div>
                  <div className="font-bold text-rose-400 text-xs">{selectedCase.replyDeadline}</div>
                </div>
              </div>

              {/* Stage Progression Pipeline */}
              <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2">
                <div className="font-bold text-slate-200 flex justify-between items-center">
                  <span>Current Stage: <span className="text-teal-300">{selectedCase.stage}</span></span>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={() => setActiveTab('generator')}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                  >
                    Generate Show Cause Letter
                  </button>

                  <button
                    onClick={() => setShowReplyRecorder(true)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                  >
                    Record Employee Reply (Offline)
                  </button>

                  <button
                    onClick={() => handleAdvanceStage('Warning Issued')}
                    className="bg-amber-950 hover:bg-amber-900 text-amber-200 border border-amber-800 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                  >
                    Issue Warning Letter
                  </button>

                  <button
                    onClick={() => handleAdvanceStage('Notice of Domestic Inquiry Issued')}
                    className="bg-rose-950 hover:bg-rose-900 text-rose-200 border border-rose-800 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                  >
                    Issue Domestic Inquiry Notice
                  </button>

                  <button
                    onClick={() => handleAdvanceStage('Case Closed')}
                    className="bg-teal-950 hover:bg-teal-900 text-teal-200 border border-teal-800 px-3 py-1.5 rounded-lg text-[11px] font-semibold"
                  >
                    Close Case (Satisfactory Reply)
                  </button>
                </div>
              </div>

              {/* High Risk DI Banner */}
              {selectedCase.stage === 'Notice of Domestic Inquiry Issued' && (
                <div className="p-3.5 bg-rose-950/80 border border-rose-800 text-rose-200 rounded-xl space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-xs text-rose-300">
                    <ShieldAlert className="w-4 h-4" /> Notice of Domestic Inquiry Issued
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This document provides formal due process notice for a Domestic Inquiry hearing. BBH software provides template structure only and does NOT constitute legal representation or advice.
                  </p>
                </div>
              )}

              {/* Recorded Employee Reply Box */}
              {selectedCase.employeeReply && (
                <div className="p-3.5 bg-slate-800/90 border border-teal-700/50 rounded-xl space-y-1 text-slate-200">
                  <div className="font-bold text-teal-300 flex justify-between">
                    <span>Recorded Employee Explanation</span>
                    <span className="text-[10px] text-slate-400">{selectedCase.employeeReply.submittedVia}</span>
                  </div>
                  <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">{selectedCase.employeeReply.explanationText}</p>
                </div>
              )}

              {/* Threaded Communication History */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 border-b border-slate-800 pb-1 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-teal-400" /> Case Communication Thread
                </h4>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedCase.messagesThread.map((msg) => (
                    <div key={msg.id} className="p-2.5 bg-slate-800 rounded-xl border border-slate-700/70 space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-semibold text-slate-400">
                        <span className="text-teal-300">{msg.senderName} ({msg.sender})</span>
                        <span>{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-200 text-xs">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessageText}
                    onChange={e => setNewMessageText(e.target.value)}
                    placeholder="Add audit note or reply..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-2 text-slate-100 outline-none"
                  />
                  <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-2 rounded-xl flex items-center gap-1">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Case Modal */}
      {showNewCaseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 space-y-4">
            <h3 className="text-sm font-bold border-b border-slate-700 pb-2 text-rose-400 flex items-center gap-2">
              <Gavel className="w-4 h-4" /> Create Disciplinary Case
            </h3>

            <form onSubmit={handleCreateCaseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Select Employee *</label>
                <select
                  value={newCaseEmpId}
                  onChange={e => setNewCaseEmpId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                >
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.nricOrPassport})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Allegations Summary *</label>
                <input
                  type="text"
                  value={newAllegation}
                  onChange={e => setNewAllegation(e.target.value)}
                  placeholder="e.g. Unexcused absence for 3 consecutive days"
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detailed Facts & Incident Log</label>
                <textarea
                  rows={3}
                  value={newFacts}
                  onChange={e => setNewFacts(e.target.value)}
                  placeholder="Detailed timeline, witnesses, and policy violated..."
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Show Cause Reply Deadline *</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowNewCaseModal(false)}
                  className="px-4 py-2 bg-slate-700 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Employee Reply Modal */}
      {showReplyRecorder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-slate-100 space-y-4">
            <h3 className="text-sm font-bold border-b border-slate-700 pb-2 text-teal-400">
              Record Offline Employee Written Reply
            </h3>

            <p className="text-xs text-slate-300">
              Paste or summarize the physical hardcopy or email explanation provided by the employee:
            </p>

            <textarea
              rows={5}
              value={offlineReplyText}
              onChange={e => setOfflineReplyText(e.target.value)}
              placeholder="I hereby explain that my absence was due to an emergency flood situation at my residence..."
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-xs text-slate-100 outline-none"
            />

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-700">
              <button
                onClick={() => setShowReplyRecorder(false)}
                className="px-4 py-2 bg-slate-700 text-slate-300 text-xs rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordEmployeeReply}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded"
              >
                Save Reply Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
