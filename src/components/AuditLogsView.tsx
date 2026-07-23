import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Download, History, Key, ShieldCheck } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs, exportCompanyDataJSON, currentRole, addAuditLog, language } = useApp();

  const [filterType, setFilterType] = useState<'All' | 'Business' | 'Security'>('All');
  const [legalHoldActive, setLegalHoldActive] = useState(false);
  const [supportToken, setSupportToken] = useState('');

  const filteredLogs = auditLogs.filter(l => filterType === 'All' || l.type === filterType);

  const handleToggleLegalHold = () => {
    setLegalHoldActive(!legalHoldActive);
    addAuditLog({
      type: 'Security',
      action: !legalHoldActive ? 'Enabled Legal Hold' : 'Disabled Legal Hold',
      actor: 'Current User',
      role: currentRole,
      targetResource: 'Company Data Archive',
      resourceId: 'all',
      ipAddress: '127.0.0.1',
      details: 'Toggled immutable legal hold state.',
      mfaVerified: true,
    });
  };

  const handleGenerateSupportToken = () => {
    const token = `SUP-24H-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    setSupportToken(token);
    addAuditLog({
      type: 'Security',
      action: 'Generated 24H Temporary Support Access Token',
      actor: 'Current User',
      role: currentRole,
      targetResource: 'Support Authorization',
      resourceId: token,
      ipAddress: '127.0.0.1',
      details: 'Granted 24h read-only support access.',
      mfaVerified: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-[#1F2937]">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="w-4 h-4 text-[#2ECC71]" />
              {language === 'zh' ? '审计日志与数据治理 (Audit Logs & Legal Hold)' : 'Audit Logs & Governance'}
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Comprehensive immutable audit trails for document issuance, NRIC unmasking, and role privilege changes.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportCompanyDataJSON}
              className="bg-[#1F2937] hover:bg-[#374151] text-white border border-[#374151] px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#2ECC71]" />
              <span>Full Company JSON Export</span>
            </button>
          </div>
        </div>

        {/* Legal Hold & Support Token Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 text-xs">
          <div className="p-5 bg-[#0D121A] border border-[#1F2937] rounded-2xl space-y-2">
            <div className="flex justify-between items-center font-bold text-white">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2ECC71]" /> Immutable Legal Hold
              </span>
              <button
                onClick={handleToggleLegalHold}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-[11px] transition cursor-pointer ${
                  legalHoldActive ? 'bg-amber-500 text-[#0A0D12]' : 'bg-[#111827] text-white border border-[#374151]'
                }`}
              >
                {legalHoldActive ? 'Legal Hold ACTIVE' : 'Enable Legal Hold'}
              </button>
            </div>
            <p className="text-[#9CA3AF] text-[11px]">
              When Legal Hold is active, all employee records, contracts, and disciplinary histories are protected against auto-deletion or purging.
            </p>
          </div>

          <div className="p-5 bg-[#0D121A] border border-[#1F2937] rounded-2xl space-y-2">
            <div className="flex justify-between items-center font-bold text-white">
              <span className="flex items-center gap-1.5">
                <Key className="w-4 h-4 text-amber-400" /> Time-Bound Support Access
              </span>
              <button
                onClick={handleGenerateSupportToken}
                className="bg-[#2ECC71] hover:bg-[#27ae60] text-[#0A0D12] font-black px-3.5 py-1.5 rounded-xl text-[11px] cursor-pointer"
              >
                Generate 24H Token
              </button>
            </div>
            {supportToken ? (
              <p className="text-[#2ECC71] font-mono text-[11px]">Active Token: <strong>{supportToken}</strong> (Expires in 24h)</p>
            ) : (
              <p className="text-[#9CA3AF] text-[11px]">Generate a temporary 24-hour token for BBH customer support troubleshooting.</p>
            )}
          </div>
        </div>

        {/* Logs Table */}
        <div className="mt-6 space-y-3">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2 text-xs">
            <span className="font-bold text-slate-200">Audit Trail Events</span>
            <div className="flex space-x-2">
              {['All', 'Business', 'Security'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-2.5 py-1 rounded font-semibold text-[10px] ${
                    filterType === type ? 'bg-teal-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs max-h-80 overflow-y-auto pr-1">
            {filteredLogs.map(log => (
              <div key={log.id} className="p-3 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-1">
                <div className="flex justify-between items-center font-bold text-slate-200">
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${log.type === 'Security' ? 'bg-amber-400' : 'bg-teal-400'}`}></span>
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-slate-300 text-[11px]">{log.details}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Actor: {log.actor} ({log.role}) • Resource: {log.targetResource} • IP: {log.ipAddress}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
