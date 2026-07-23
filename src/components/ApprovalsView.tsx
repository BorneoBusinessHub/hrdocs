import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckSquare, ShieldAlert, UserCheck } from 'lucide-react';

export const ApprovalsView: React.FC = () => {
  const { documents, saveDocument, currentRole, addAuditLog, language } = useApp();

  const pendingDocs = documents.filter(d => d.status === 'Pending Approval' || d.status === 'Compliance Check Required');

  const handleApprove = (docId: string) => {
    const target = documents.find(d => d.id === docId);
    if (!target) return;

    const updated = {
      ...target,
      status: 'Issued' as const,
      approvalHistory: [
        ...target.approvalHistory,
        {
          step: 'Approval & Risk Signoff',
          actor: 'Current Approver',
          role: currentRole,
          action: 'Approved & Signed Off',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    saveDocument(updated);

    addAuditLog({
      type: 'Business',
      action: 'Risk Approved & Issued Document',
      actor: 'Current Approver',
      role: currentRole,
      targetResource: target.templateTitle,
      resourceId: target.id,
      ipAddress: '127.0.0.1',
      details: `Document ${target.companyRefNumber} approved by ${currentRole}.`,
      mfaVerified: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-slate-700">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-teal-400" />
              {language === 'zh' ? '审批队列与合规风险签署 (Risk-Tiered Approvals)' : 'Approvals Queue & Compliance Sign-Off'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-risk documents or overridden jurisdiction contracts require formal review and written justification before official PDF issuance.
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4 text-xs">
          {pendingDocs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/60 border border-slate-700 rounded-2xl text-slate-400">
              No documents currently pending risk approval.
            </div>
          ) : (
            pendingDocs.map(doc => (
              <div key={doc.id} className="p-4 bg-slate-900 border border-slate-700 rounded-2xl space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-slate-100 text-sm">{doc.companyRefNumber}</span>
                    <span className="text-slate-400 ml-2">• {doc.templateTitle}</span>
                  </div>

                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                    {doc.status}
                  </span>
                </div>

                <div className="text-slate-300">
                  Target Employee: <strong>{doc.employeeName}</strong> ({doc.employeeNRICMasked}) | Jurisdiction: <strong>{doc.jurisdiction}</strong>
                </div>

                {doc.jurisdictionOverridden && (
                  <div className="p-3 bg-amber-950/80 border border-amber-800 text-amber-200 rounded-xl space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-300">
                      <ShieldAlert className="w-4 h-4" /> Jurisdiction Overridden
                    </div>
                    <p className="text-[11px]">Justification: {doc.overrideReason || 'No justification entered.'}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <div className="text-slate-400 text-[11px]">
                    Prepared by: <strong>{doc.approvalHistory[0]?.actor || 'HR Prep'}</strong> on {doc.createdDate}
                  </div>

                  <div className="space-x-2">
                    <button
                      onClick={() => handleApprove(doc.id)}
                      className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-1.5 rounded-xl transition"
                    >
                      Approve & Issue PDF
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
