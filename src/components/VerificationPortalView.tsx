import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, QrCode, Search, ShieldCheck, XCircle } from 'lucide-react';

export const VerificationPortalView: React.FC = () => {
  const { documents, company, language } = useApp();

  const [inputCode, setInputCode] = useState('BTS-VER-882194');
  const [verifyResult, setVerifyResult] = useState<any>(documents[0] || null);
  const [searched, setSearched] = useState(true);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const found = documents.find(d =>
      d.verificationCode.toLowerCase() === inputCode.trim().toLowerCase() ||
      d.systemDocumentId.toLowerCase() === inputCode.trim().toLowerCase() ||
      d.companyRefNumber.toLowerCase() === inputCode.trim().toLowerCase()
    );
    setVerifyResult(found || null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="text-center space-y-2 border-b border-slate-700 pb-4">
          <div className="inline-flex items-center justify-center p-3 bg-teal-950 border border-teal-700 rounded-2xl text-teal-400 mb-1">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-lg font-bold text-slate-100">
            {language === 'zh' ? 'BBH 马来西亚 HR 文件防伪真实性校验门户' : 'BBH HR Document Authenticity Verification Portal'}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Scan the QR code printed on the bottom footer of any official issued document or enter the verification security code below.
          </p>
        </div>

        {/* Verification Form */}
        <form onSubmit={handleVerify} className="max-w-md mx-auto space-y-3">
          <div>
            <label className="block text-slate-400 text-xs mb-1 text-center font-medium">Enter Verification Code / System ID / Ref No</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="e.g. BTS-VER-882194"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-3 text-center text-xs text-slate-100 font-mono font-bold outline-none focus:border-teal-500"
                required
              />
              <button
                type="submit"
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-3 rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Search className="w-4 h-4" /> Verify
              </button>
            </div>
          </div>
        </form>

        {/* Verification Result Card */}
        {searched && (
          <div className="max-w-lg mx-auto">
            {verifyResult ? (
              <div className="p-5 bg-slate-900 border border-teal-600/60 rounded-2xl space-y-3 text-xs shadow-lg">
                <div className="flex items-center space-x-2 text-teal-400 font-bold border-b border-slate-800 pb-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="text-sm">Official Document Verified Authentic</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-slate-400 block">Company:</span> <strong className="text-slate-100">{company.legalName}</strong></div>
                  <div><span className="text-slate-400 block">SSM Reg:</span> <strong className="text-slate-100">{company.ssmRegistrationNumber}</strong></div>
                  <div><span className="text-slate-400 block">Document Title:</span> <strong className="text-slate-100">{verifyResult.templateTitle}</strong></div>
                  <div><span className="text-slate-400 block">Company Ref No:</span> <strong className="text-slate-100">{verifyResult.companyRefNumber}</strong></div>
                  <div><span className="text-slate-400 block">System Doc ID:</span> <code className="text-teal-300 font-bold">{verifyResult.systemDocumentId}</code></div>
                  <div><span className="text-slate-400 block">Jurisdiction:</span> <strong className="text-slate-100">{verifyResult.jurisdiction}</strong></div>
                  <div><span className="text-slate-400 block">Issued Date:</span> <strong className="text-slate-100">{verifyResult.updatedDate}</strong></div>
                  <div><span className="text-slate-400 block">Status:</span> <span className="bg-teal-950 text-teal-300 px-2 py-0.5 rounded font-bold">{verifyResult.status}</span></div>
                </div>

                <div className="p-2.5 bg-slate-800 rounded-xl border border-slate-700 text-[10px] text-slate-400 font-mono">
                  SHA-256 Hash Digest: {verifyResult.hash}
                </div>
              </div>
            ) : (
              <div className="p-5 bg-rose-950/80 border border-rose-800 rounded-2xl text-center space-y-2 text-rose-200 text-xs">
                <XCircle className="w-8 h-8 text-rose-400 mx-auto" />
                <div className="font-bold text-sm">Document Verification Failed</div>
                <p className="text-[11px] text-rose-300">
                  The code <code>{inputCode}</code> was not found in the authentic BBH system registry. Please confirm the code or contact the issuing employer.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
