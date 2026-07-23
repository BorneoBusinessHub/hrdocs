import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { runComplianceCheck } from '../services/complianceEngine';
import { generateAIDraft } from '../services/aiService';
import { renderDocumentHTML } from '../services/pdfGenerator';
import { INITIAL_TEMPLATES } from '../services/templatesData';
import {
  ClauseBlock,
  ComplianceReport,
  HRDocument,
  Jurisdiction,
  TemplateFamily
} from '../types';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileCheck,
  FileText,
  Lock,
  RotateCcw,
  ShieldAlert,
  Sparkles,
  Wand2
} from 'lucide-react';

export const DocumentGeneratorView: React.FC = () => {
  const {
    company,
    persons,
    episodes,
    locations,
    signatories,
    saveDocument,
    issueDocument,
    documents,
    currentRole,
    addAuditLog,
    language
  } = useApp();

  // Mode: list or generator
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'records'>('create');
  
  // Editor mode: Guided vs Advanced
  const [editorMode, setEditorMode] = useState<'guided' | 'advanced'>('guided');

  // Selected Template
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(INITIAL_TEMPLATES[0].id);
  const selectedTemplate = INITIAL_TEMPLATES.find(t => t.id === selectedTemplateId) || INITIAL_TEMPLATES[0];

  // Selected Employee
  const [selectedPersonId, setSelectedPersonId] = useState<string>(persons[0]?.id || '');
  const selectedPerson = persons.find(p => p.id === selectedPersonId) || persons[0];
  const selectedEpisode = episodes.find(e => e.personId === selectedPerson?.id) || episodes[0];
  const selectedLocation = locations.find(l => l.id === selectedEpisode?.workLocationId) || locations[0];

  // Recommended Jurisdiction based on Work Location
  const recommendedJurisdiction: Jurisdiction = selectedLocation?.jurisdiction || 'Sarawak';
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<Jurisdiction>(recommendedJurisdiction);
  const [overrideReason, setOverrideReason] = useState<string>('');

  // Keep jurisdiction in sync when work location changes unless manually edited
  useEffect(() => {
    setSelectedJurisdiction(selectedLocation?.jurisdiction || 'Sarawak');
  }, [selectedLocation?.id]);

  // Form Field State
  const [fieldValues, setFieldValues] = useState<Record<string, any>>({
    employeeName: selectedPerson?.fullName || '',
    nric: selectedPerson?.nricOrPassport || '',
    jobTitle: selectedEpisode?.jobTitle || '',
    department: selectedEpisode?.department || '',
    basicSalaryRM: selectedEpisode?.basicSalaryRM || 4500,
    fixedAllowancesRM: selectedEpisode?.fixedAllowancesRM || 300,
    startDate: selectedEpisode?.startDate || new Date().toISOString().split('T')[0],
    noticePeriodWeeks: 4,
    yearsOfService: 2,
    weeklyHours: 45,
    incidentDate: new Date().toISOString().split('T')[0],
    incidentTime: '10:00 AM',
    incidentLocation: selectedLocation?.name || 'Sarawak HQ',
    detailedFacts: 'Failure to comply with company standard operating procedure during project execution.',
    replyDays: 5,
    replyDeadlineDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    signatoryName: signatories[0]?.name || '',
  });

  // Keep fields synced when selected person changes
  useEffect(() => {
    if (selectedPerson) {
      setFieldValues(prev => ({
        ...prev,
        employeeName: selectedPerson.fullName,
        nric: selectedPerson.nricOrPassport,
        jobTitle: selectedEpisode?.jobTitle || '',
        department: selectedEpisode?.department || '',
        basicSalaryRM: selectedEpisode?.basicSalaryRM || 4500,
      }));
    }
  }, [selectedPersonId]);

  // Clauses State for Advanced Block Editing
  const [clauses, setClauses] = useState<ClauseBlock[]>(selectedTemplate.clauses);

  useEffect(() => {
    setClauses(selectedTemplate.clauses);
  }, [selectedTemplateId]);

  // Compliance Report State
  const [complianceReport, setComplianceReport] = useState<ComplianceReport | null>(null);
  const [showRiskDrawer, setShowComplianceDrawer] = useState(false);

  // AI Assistant State
  const [showAIDrawer, setShowAIDrawer] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [aiTask, setAITask] = useState<'facts' | 'pip' | 'warning' | 'tone'>('facts');
  const [aiLoading, setAILoading] = useState(false);
  const [aiResponse, setAIResponse] = useState('');

  // Save or Draft Document Instance
  const buildCurrentDoc = (status: HRDocument['status'] = 'Draft'): HRDocument => {
    const isOverridden = selectedJurisdiction !== recommendedJurisdiction;
    const sysId = `DOC-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const refNo = `${company.referenceScheme.prefix}/${selectedTemplate.code}/${new Date().getFullYear()}/${String(documents.length + 1).padStart(3, '0')}`;

    return {
      id: `doc-${Date.now()}`,
      systemDocumentId: sysId,
      companyRefNumber: refNo,
      templateId: selectedTemplate.id,
      templateFamily: selectedTemplate.family as TemplateFamily,
      templateTitle: selectedTemplate.title,
      employeeEpisodeId: selectedEpisode?.id || 'ep-001',
      employeeName: fieldValues.employeeName || selectedPerson?.fullName || 'Employee',
      employeeNRICMasked: (fieldValues.nric || selectedPerson?.nricOrPassport || '').replace(/(\d{6})-\d{2}-(\d{4})/, '$1-**-****'),
      jurisdiction: selectedJurisdiction,
      jurisdictionOverridden: isOverridden,
      overrideReason: isOverridden ? overrideReason : undefined,
      status,
      version: '1.0',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      effectiveDate: fieldValues.startDate || new Date().toISOString().split('T')[0],
      signatoryId: signatories[0]?.id || 'sig-001',
      signatoryName: fieldValues.signatoryName || signatories[0]?.name || 'Authorized Signatory',
      fieldValues,
      clauses,
      verificationCode: `BTS-VER-${Math.floor(100000 + Math.random() * 900000)}`,
      hash: 'a3f8902c4b8e1a7702115ef6a3d9021a8f',
      approvalHistory: [
        {
          step: 'Preparation',
          actor: 'Current User',
          role: currentRole,
          action: 'Prepared',
          timestamp: new Date().toISOString(),
        },
      ],
    };
  };

  // Run Real-time Compliance Check
  const handleRunCheck = () => {
    const currentDoc = buildCurrentDoc('Compliance Check Required');
    const report = runComplianceCheck(currentDoc, selectedJurisdiction, recommendedJurisdiction);
    setComplianceReport(report);
    setShowComplianceDrawer(true);
  };

  // Run AI Drafting Request
  const handleRunAI = async () => {
    setAILoading(true);
    setAIResponse('');

    let promptText = aiPrompt;
    if (!promptText) {
      if (aiTask === 'facts') {
        promptText = `Draft formal incident facts for a Show Cause Letter: Employee missed project deadline on ${fieldValues.incidentDate} causing RM ${fieldValues.basicSalaryRM} project delay at ${selectedLocation?.name}.`;
      } else if (aiTask === 'pip') {
        promptText = `Generate 3 measurable 30-day Performance Improvement Plan (PIP) targets for a ${fieldValues.jobTitle} in ${fieldValues.department}.`;
      } else if (aiTask === 'warning') {
        promptText = `Write formal required corrective action text for a Written Warning letter regarding unexcused tardiness.`;
      } else {
        promptText = `Check and soften tone of: "${fieldValues.detailedFacts}" into professional Malaysian corporate HR style.`;
      }
    }

    const res = await generateAIDraft(promptText);
    setAILoading(false);
    if (res.error) {
      setAIResponse(`Error: ${res.error}`);
    } else {
      setAIResponse(res.text);
    }
  };

  // Accept AI Suggestion into Form
  const handleApplyAISuggestion = () => {
    if (!aiResponse) return;
    setFieldValues(prev => ({
      ...prev,
      detailedFacts: aiResponse,
    }));
    setShowAIDrawer(false);
  };

  // Issue Document Lock
  const handleIssueDoc = () => {
    const newDoc = buildCurrentDoc('Issued');
    saveDocument(newDoc);
    addAuditLog({
      type: 'Business',
      action: 'Issued & Locked Document',
      actor: 'Current User',
      role: currentRole,
      targetResource: `${newDoc.templateTitle} - ${newDoc.employeeName}`,
      resourceId: newDoc.id,
      ipAddress: '127.0.0.1',
      details: `Document ${newDoc.companyRefNumber} permanently locked into official PDF.`,
      mfaVerified: true,
    });
    setActiveSubTab('records');
  };

  // Generated Live HTML Preview
  const currentDocObj = buildCurrentDoc('Draft');
  const previewHTML = renderDocumentHTML(currentDocObj, company, selectedLocation, signatories[0], false);

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-[#1F2937] space-x-2 pb-1">
        <button
          onClick={() => setActiveSubTab('create')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'create'
              ? 'bg-[#2ECC71] text-[#0A0D12] shadow-[0_0_12px_rgba(46,204,113,0.25)]'
              : 'text-[#9CA3AF] hover:text-white hover:bg-[#111827]'
          }`}
        >
          {language === 'zh' ? '智能文档生成与双模式编辑器' : 'Document Generator & Dual Editor'}
        </button>
        <button
          onClick={() => setActiveSubTab('records')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
            activeSubTab === 'records'
              ? 'bg-[#2ECC71] text-[#0A0D12] shadow-[0_0_12px_rgba(46,204,113,0.25)]'
              : 'text-[#9CA3AF] hover:text-white hover:bg-[#111827]'
          }`}
        >
          {language === 'zh' ? '已生成文件档案库' : 'Generated Document Records'}
        </button>
      </div>

      {activeSubTab === 'create' && (
        <div className="space-y-4">
          {/* Top Bar: Template Selector & Editor Mode Toggle */}
          <div className="bg-[#111827] p-5 rounded-3xl border border-[#1F2937] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto text-xs">
              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Select Template Family *</label>
                <select
                  value={selectedTemplateId}
                  onChange={e => setSelectedTemplateId(e.target.value)}
                  className="bg-[#0D121A] text-white border border-[#374151] rounded-xl p-2.5 font-semibold outline-none focus:border-[#2ECC71] w-full"
                >
                  {INITIAL_TEMPLATES.map(t => (
                    <option key={t.id} value={t.id}>{t.title} ({t.family})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#9CA3AF] mb-1 font-medium">Target Employee *</label>
                <select
                  value={selectedPersonId}
                  onChange={e => setSelectedPersonId(e.target.value)}
                  className="bg-[#0D121A] text-white border border-[#374151] rounded-xl p-2.5 font-semibold outline-none focus:border-[#2ECC71] w-full"
                >
                  {persons.map(p => (
                    <option key={p.id} value={p.id}>{p.fullName} ({p.nricOrPassport})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center space-x-1.5 bg-[#0D121A] p-1 border border-[#374151] rounded-2xl text-xs">
              <button
                onClick={() => setEditorMode('guided')}
                className={`px-3.5 py-2 rounded-xl font-bold transition cursor-pointer ${
                  editorMode === 'guided' ? 'bg-[#2ECC71] text-[#0A0D12]' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                Guided Form Edit
              </button>
              <button
                onClick={() => setEditorMode('advanced')}
                className={`px-3.5 py-2 rounded-xl font-bold transition cursor-pointer ${
                  editorMode === 'advanced' ? 'bg-[#2ECC71] text-[#0A0D12]' : 'text-[#9CA3AF] hover:text-white'
                }`}
              >
                Advanced Clause Edit
              </button>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111827] p-4 rounded-2xl border border-[#1F2937]">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAIDrawer(true)}
                className="bg-[#1F2937] hover:bg-[#374151] text-white border border-[#374151] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#2ECC71]" />
                <span>AI Writing Assistant</span>
              </button>

              <button
                onClick={handleRunCheck}
                className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Run Compliance & Risk Check</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleIssueDoc}
                className="bg-[#2ECC71] hover:bg-[#27ae60] text-[#0A0D12] px-5 py-2 rounded-xl text-xs font-black flex items-center space-x-2 transition cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Approve & Issue Locked PDF</span>
              </button>
            </div>
          </div>

          {/* Editor Grid: Left Form/Clause Editor, Right Live A4 Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Jurisdiction Recommendation Box */}
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs space-y-3">
                <div className="flex justify-between items-center font-bold text-slate-200 border-b border-slate-700 pb-2">
                  <span>Jurisdiction Engine</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedJurisdiction === 'Sarawak'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-teal-950 text-teal-300 border border-teal-800'
                  }`}>
                    {selectedJurisdiction}
                  </span>
                </div>

                <p className="text-slate-300">
                  Recommended for <strong>{selectedLocation?.name}</strong>: <span className="text-teal-400 font-semibold">{recommendedJurisdiction}</span>
                </p>

                {selectedJurisdiction !== recommendedJurisdiction && (
                  <div className="p-3 bg-amber-950/80 border border-amber-800 text-amber-200 rounded-xl space-y-2">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400" /> Jurisdiction Manually Overridden
                    </div>
                    <label className="block text-[11px] text-amber-300">Required Written Justification for Approver *</label>
                    <input
                      type="text"
                      value={overrideReason}
                      onChange={e => setOverrideReason(e.target.value)}
                      placeholder="e.g. Employee seconded temporarily under West Malaysia headquarters contract."
                      className="w-full bg-slate-900 border border-amber-700 rounded p-2 text-slate-100 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Guided Mode Inputs */}
              {editorMode === 'guided' ? (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs space-y-4 shadow-sm">
                  <h3 className="font-bold text-slate-200 border-b border-slate-700 pb-2">Document Guided Fields</h3>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Job Title / Designation</label>
                      <input
                        type="text"
                        value={fieldValues.jobTitle}
                        onChange={e => setFieldValues({ ...fieldValues, jobTitle: e.target.value })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Basic Monthly Salary (RM)</label>
                      <input
                        type="number"
                        value={fieldValues.basicSalaryRM}
                        onChange={e => setFieldValues({ ...fieldValues, basicSalaryRM: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Notice Period (Weeks)</label>
                      <input
                        type="number"
                        value={fieldValues.noticePeriodWeeks}
                        onChange={e => setFieldValues({ ...fieldValues, noticePeriodWeeks: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-400 mb-1 font-medium">Weekly Standard Hours</label>
                      <input
                        type="number"
                        value={fieldValues.weeklyHours}
                        onChange={e => setFieldValues({ ...fieldValues, weeklyHours: Number(e.target.value) })}
                        className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                      />
                    </div>

                    {selectedTemplate.family === 'Show Cause Letter' && (
                      <div className="space-y-3 pt-2 border-t border-slate-700">
                        <div>
                          <label className="block text-slate-400 mb-1 font-medium">Incident Date & Time</label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={fieldValues.incidentDate}
                              onChange={e => setFieldValues({ ...fieldValues, incidentDate: e.target.value })}
                              className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                            />
                            <input
                              type="text"
                              value={fieldValues.incidentTime}
                              onChange={e => setFieldValues({ ...fieldValues, incidentTime: e.target.value })}
                              className="bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1 font-medium">Detailed Allegations & Facts *</label>
                          <textarea
                            rows={4}
                            value={fieldValues.detailedFacts}
                            onChange={e => setFieldValues({ ...fieldValues, detailedFacts: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-400 mb-1 font-medium">Reply Deadline Days</label>
                          <input
                            type="number"
                            value={fieldValues.replyDays}
                            onChange={e => setFieldValues({ ...fieldValues, replyDays: Number(e.target.value) })}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Advanced Block Clause Editor */
                <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs space-y-4 shadow-sm max-h-[600px] overflow-y-auto">
                  <h3 className="font-bold text-slate-200 border-b border-slate-700 pb-2">Clause Block Editor</h3>

                  {clauses.map((clause, idx) => (
                    <div key={clause.id} className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                      <div className="flex justify-between items-center font-semibold text-slate-200">
                        <span>{clause.title}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                          clause.status === 'BBH Standard' ? 'bg-teal-950 text-teal-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {clause.status}
                        </span>
                      </div>

                      <textarea
                        rows={3}
                        value={clause.content}
                        onChange={e => {
                          const updated = [...clauses];
                          updated[idx] = { ...updated[idx], content: e.target.value, status: 'User Modified' };
                          setClauses(updated);
                        }}
                        className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-slate-100 outline-none"
                      />

                      <div className="flex justify-between items-center text-[10px]">
                        <button
                          onClick={() => {
                            const updated = [...clauses];
                            const std = selectedTemplate.clauses[idx];
                            if (std) {
                              updated[idx] = { ...std, status: 'BBH Standard' };
                              setClauses(updated);
                            }
                          }}
                          className="text-teal-400 hover:underline flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" /> Restore BBH Standard
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column (7 cols): Live A4 Document Preview */}
            <div className="lg:col-span-7 bg-slate-800 border border-slate-700 rounded-2xl p-4 flex flex-col shadow-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-700 mb-3 text-xs">
                <span className="font-bold text-slate-200 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-teal-400" />
                  Live A4 Document Rendering Preview
                </span>
                <span className="text-slate-400 text-[10px]">Locked PDF Format Simulator</span>
              </div>

              <div className="bg-white rounded-lg p-2 overflow-hidden shadow-inner flex-1 border border-slate-600 min-h-[600px]">
                <iframe
                  title="PDF Preview"
                  srcDoc={previewHTML}
                  className="w-full h-full min-h-[580px] border-0"
                />
              </div>
            </div>
          </div>

          {/* Compliance & Risk Drawer Modal */}
          {showRiskDrawer && complianceReport && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 text-slate-100 space-y-4 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" /> Compliance Risk Report ({complianceReport.findings.length} Findings)
                  </h3>
                  <button onClick={() => setShowComplianceDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="space-y-3 text-xs">
                  {complianceReport.findings.length === 0 ? (
                    <div className="p-4 bg-teal-950/60 border border-teal-700 text-teal-200 rounded-xl font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      All statutory baseline checks passed! No system integrity or statutory conflicts detected.
                    </div>
                  ) : (
                    complianceReport.findings.map(finding => (
                      <div
                        key={finding.id}
                        className={`p-3.5 rounded-xl border space-y-1.5 ${
                          finding.severity === 'Red'
                            ? 'bg-rose-950/70 border-rose-800 text-rose-100'
                            : 'bg-amber-950/70 border-amber-800 text-amber-100'
                        }`}
                      >
                        <div className="flex justify-between items-center font-bold">
                          <span>[{finding.category}] {finding.ruleId}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold ${
                            finding.severity === 'Red' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                          }`}>
                            {finding.severity} Severity
                          </span>
                        </div>
                        <p className="font-semibold">{finding.messageEn}</p>
                        <p className="text-slate-300 text-[11px] font-sans">{finding.messageZh}</p>
                        {finding.legalReference && (
                          <div className="text-[10px] text-slate-400 font-mono">Reference: {finding.legalReference}</div>
                        )}
                        <div className="text-[11px] pt-1 text-teal-300 font-medium">
                          Suggested Action: {finding.suggestedAction}
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                  <button
                    onClick={() => alert("Bilingual Compliance Risk Report downloaded as PDF!")}
                    className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3.5 py-2 rounded-xl font-semibold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Risk Report (PDF)
                  </button>
                  <button
                    onClick={() => setShowComplianceDrawer(false)}
                    className="text-xs bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl font-bold"
                  >
                    Close Report
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* AI Writing Assistant Modal */}
          {showAIDrawer && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-100 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-700 pb-3">
                  <h3 className="text-sm font-bold text-teal-400 flex items-center gap-2">
                    <Wand2 className="w-4 h-4" /> AI HR Writing Assistant
                  </h3>
                  <button onClick={() => setShowAIDrawer(false)} className="text-slate-400 hover:text-white">✕</button>
                </div>

                <div className="p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-[11px] text-slate-300">
                  🔒 <strong>Privacy Redaction Active:</strong> Employee NRICs, salaries, and names are automatically anonymized before processing. AI is a drafting assistant, not legal counsel.
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Select Task</label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'facts', label: 'Polish Show Cause Facts' },
                        { id: 'pip', label: 'Draft PIP Targets' },
                        { id: 'warning', label: 'Warning Corrective Action' },
                        { id: 'tone', label: 'Softened Corporate Tone' },
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setAITask(t.id as any)}
                          className={`p-2 rounded-lg border text-left font-semibold transition ${
                            aiTask === t.id ? 'bg-teal-950 border-teal-600 text-teal-300' : 'bg-slate-900 border-slate-700 text-slate-300'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1 font-medium">Custom Prompt (Optional)</label>
                    <textarea
                      rows={3}
                      value={aiPrompt}
                      onChange={e => setAIPrompt(e.target.value)}
                      placeholder="Describe the incident, role, or performance issue..."
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 outline-none"
                    />
                  </div>

                  <button
                    onClick={handleRunAI}
                    disabled={aiLoading}
                    className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-bold py-2 rounded-xl flex items-center justify-center gap-2"
                  >
                    {aiLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    <span>{aiLoading ? 'Generating Compliant Draft...' : 'Generate AI Suggestion'}</span>
                  </button>

                  {aiResponse && (
                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                      <div className="font-bold text-teal-300">AI Suggested Text:</div>
                      <p className="text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">{aiResponse}</p>
                      <button
                        onClick={handleApplyAISuggestion}
                        className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-3 py-1.5 rounded-lg"
                      >
                        Accept Suggestion Into Form
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Records Subtab */}
      {activeSubTab === 'records' && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-sm">
          <h2 className="text-sm font-bold text-slate-100 border-b border-slate-700 pb-3 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-teal-400" />
            Issued Document Records & Working Copies
          </h2>

          <div className="space-y-3">
            {documents.map(d => (
              <div key={d.id} className="p-4 bg-slate-900 border border-slate-700 rounded-xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-slate-100 text-sm">{d.companyRefNumber}</span>
                    <span className="text-slate-400 ml-2">• System ID: <code className="text-teal-300">{d.systemDocumentId}</code></span>
                  </div>
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800">
                    {d.status}
                  </span>
                </div>

                <div className="text-slate-300 font-medium">
                  {d.templateTitle} — {d.employeeName} ({d.employeeNRICMasked})
                </div>

                <div className="flex flex-wrap justify-between items-center text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                  <span>Jurisdiction: <strong>{d.jurisdiction}</strong> | Effective: {d.effectiveDate}</span>

                  <div className="space-x-2">
                    <button
                      onClick={() => alert(`Downloading DOCX Working Copy with watermark "Editable Working Copy — Not Official Issued Version"`)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1 rounded font-medium"
                    >
                      DOCX Working Copy
                    </button>
                    <button
                      onClick={() => alert(`Opening Issued Locked PDF ${d.systemDocumentId}...`)}
                      className="bg-teal-600 hover:bg-teal-500 text-white px-2.5 py-1 rounded font-bold"
                    >
                      Download Locked PDF
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
