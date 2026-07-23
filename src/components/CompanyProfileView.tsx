import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VerificationStatus, WorkLocation } from '../types';
import {
  Building2,
  CheckCircle2,
  MapPin,
  PenTool,
  Plus,
  ShieldCheck,
  Upload,
  UserCheck
} from 'lucide-react';

export const CompanyProfileView: React.FC = () => {
  const { company, updateCompany, locations, addLocation, signatories, addSignatory, language } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'verification' | 'locations' | 'signatories' | 'letterhead'>('profile');
  
  // Profile edit form
  const [profileForm, setProfileForm] = useState(company);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Location Form
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddr, setNewLocAddr] = useState('');
  const [newLocState, setNewLocState] = useState('Sarawak');
  const [newLocJuris, setNewLocJuris] = useState<'Sarawak' | 'Peninsular Malaysia'>('Sarawak');

  // New Signatory Form
  const [newSigName, setNewSigName] = useState('');
  const [newSigTitle, setNewSigTitle] = useState('');
  const [newSigEmail, setNewSigEmail] = useState('');

  // Verification Step Simulator
  const [verStep, setVerStep] = useState(1);
  const [verSuccess, setVerSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(profileForm);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName || !newLocAddr) return;
    addLocation({
      name: newLocName,
      address: newLocAddr,
      state: newLocState,
      jurisdiction: newLocJuris,
      holidayCalendarState: newLocState,
      active: true,
    });
    setNewLocName('');
    setNewLocAddr('');
  };

  const handleAddSigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSigName || !newSigTitle) return;
    addSignatory({
      name: newSigName,
      title: newSigTitle,
      email: newSigEmail,
      isDefault: signatories.length === 0,
    });
    setNewSigName('');
    setNewSigTitle('');
    setNewSigEmail('');
  };

  const handleSimulateVerification = () => {
    updateCompany({ verificationStatus: 'Company Details Verified', verificationDate: new Date().toISOString().split('T')[0] });
    setVerSuccess(true);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex border-b border-[#1F2937] space-x-2 pb-1 overflow-x-auto">
        {[
          { id: 'profile', labelEn: 'Company Profile', labelZh: '公司基本资料' },
          { id: 'verification', labelEn: 'SSM Verification', labelZh: '分级企业验证' },
          { id: 'locations', labelEn: 'Work Locations & Jurisdictions', labelZh: '工作地点与辖区' },
          { id: 'signatories', labelEn: 'Authorized Signatories', labelZh: '授权签署人' },
          { id: 'letterhead', labelEn: 'Ref Scheme & Letterhead', labelZh: '编号与信头设置' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeSubTab === tab.id
                ? 'bg-[#2ECC71] text-[#0A0D12] shadow-[0_0_12px_rgba(46,204,113,0.25)]'
                : 'text-[#9CA3AF] hover:text-white hover:bg-[#111827]'
            }`}
          >
            {language === 'zh' ? tab.labelZh : tab.labelEn}
          </button>
        ))}
      </div>

      {/* 1. Profile Tab */}
      {activeSubTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-[#1F2937]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2ECC71]" />
              {language === 'zh' ? '企业基本与注册资料' : 'Company Legal Identity'}
            </h2>
            {saveSuccess && <span className="text-xs text-[#2ECC71] font-bold">✓ Saved Successfully</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#9CA3AF] mb-1 font-medium">Legal Company Name *</label>
              <input
                type="text"
                value={profileForm.legalName}
                onChange={e => setProfileForm({ ...profileForm, legalName: e.target.value })}
                className="w-full bg-[#0D121A] border border-[#374151] rounded-xl p-3 text-white outline-none focus:border-[#2ECC71]"
                required
              />
            </div>

            <div>
              <label className="block text-[#9CA3AF] mb-1 font-medium">SSM Registration Number *</label>
              <input
                type="text"
                value={profileForm.ssmRegistrationNumber}
                onChange={e => setProfileForm({ ...profileForm, ssmRegistrationNumber: e.target.value })}
                className="w-full bg-[#0D121A] border border-[#374151] rounded-xl p-3 text-white outline-none focus:border-[#2ECC71]"
                required
              />
            </div>

            <div>
              <label className="block text-[#9CA3AF] mb-1 font-medium">Trading / Brand Name</label>
              <input
                type="text"
                value={profileForm.tradingName}
                onChange={e => setProfileForm({ ...profileForm, tradingName: e.target.value })}
                className="w-full bg-[#0D121A] border border-[#374151] rounded-xl p-3 text-white outline-none focus:border-[#2ECC71]"
              />
            </div>

            <div>
              <label className="block text-[#9CA3AF] mb-1 font-medium">Company Entity Type</label>
              <select
                value={profileForm.companyType}
                onChange={e => setProfileForm({ ...profileForm, companyType: e.target.value as any })}
                className="w-full bg-[#0D121A] border border-[#374151] rounded-xl p-3 text-white outline-none focus:border-[#2ECC71]"
              >
                <option value="Sdn Bhd">Sdn Bhd (Sendirian Berhad)</option>
                <option value="Bhd">Berhad</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="LLP">LLP (Perkongsian Liabiliti Terhad)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-[#9CA3AF] mb-1 font-medium">Registered SSM Address *</label>
              <input
                type="text"
                value={profileForm.registeredAddress}
                onChange={e => setProfileForm({ ...profileForm, registeredAddress: e.target.value })}
                className="w-full bg-[#0D121A] border border-[#374151] rounded-xl p-3 text-white outline-none focus:border-[#2ECC71]"
                required
              />
            </div>

            <div>
              <label className="block text-[#9CA3AF] mb-1 font-medium">Official Contact Email *</label>
              <input
                type="email"
                value={profileForm.officialEmail}
                onChange={e => setProfileForm({ ...profileForm, officialEmail: e.target.value })}
                className="w-full bg-[#0D121A] border border-[#374151] rounded-xl p-3 text-white outline-none focus:border-[#2ECC71]"
                required
              />
            </div>

            <div>
              <label className="block text-[#9CA3AF] mb-1 font-medium">Main Business Phone *</label>
              <input
                type="text"
                value={profileForm.mainPhone}
                onChange={e => setProfileForm({ ...profileForm, mainPhone: e.target.value })}
                className="w-full bg-[#0D121A] border border-[#374151] rounded-xl p-3 text-white outline-none focus:border-[#2ECC71]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#2ECC71] hover:bg-[#27ae60] text-[#0A0D12] font-black text-xs px-6 py-3 rounded-xl transition cursor-pointer"
          >
            {language === 'zh' ? '保存公司资料' : 'Save Company Profile'}
          </button>
        </form>
      )}

      {/* 2. SSM Verification Tab */}
      {activeSubTab === 'verification' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-[#1F2937]">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2ECC71]" />
                {language === 'zh' ? '企业 SSM 分级核验' : 'Tiered Company Verification'}
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                Unverified companies can draft documents, but MUST complete SSM verification before official PDF issuance.
              </p>
            </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              company.verificationStatus === 'Company Details Verified'
                ? 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {company.verificationStatus}
            </span>
          </div>

          {/* Verification Steps */}
          <div className="space-y-4 text-xs">
            <div className={`p-4 rounded-2xl border ${verStep >= 1 ? 'bg-[#0D121A] border-[#2ECC71]/40' : 'bg-[#0D121A]/50 border-[#1F2937] opacity-60'}`}>
              <div className="flex items-center justify-between font-bold text-white">
                <span>Step 1: Email & Mobile OTP Verification</span>
                <CheckCircle2 className="w-4 h-4 text-[#2ECC71]" />
              </div>
              <p className="text-[#9CA3AF] mt-1">Official email {company.officialEmail} verified via OTP.</p>
            </div>

            <div className={`p-4 rounded-2xl border ${verStep >= 2 ? 'bg-[#0D121A] border-[#2ECC71]/40' : 'bg-[#0D121A]/50 border-[#1F2937] opacity-60'}`}>
              <div className="flex items-center justify-between font-bold text-white">
                <span>Step 2: Upload SSM Form 9 / Certificate of Incorporation</span>
                <Upload className="w-4 h-4 text-[#2ECC71]" />
              </div>
              <p className="text-[#9CA3AF] mt-1">Upload SSM e-Info digital certificate or Registration Certificate PDF.</p>
              <div className="mt-2 bg-[#111827] p-3 rounded-xl border border-[#374151] text-[#E0E0E0]">
                Uploaded File: <code className="text-[#2ECC71] font-mono">SSM_Form9_BorneoTech.pdf</code> (Verified 15 Jan 2026)
              </div>
            </div>

            <div className={`p-4 rounded-2xl border ${verStep >= 3 ? 'bg-[#0D121A] border-[#2ECC71]/40' : 'bg-[#0D121A]/50 border-[#1F2937] opacity-60'}`}>
              <div className="flex items-center justify-between font-bold text-white">
                <span>Step 3: Company Owner Authorization Declaration</span>
                <UserCheck className="w-4 h-4 text-[#2ECC71]" />
              </div>
              <p className="text-[#9CA3AF] mt-1">
                Owner declaration completed by Datuk Abang Zulkarnain. Duplicate SSM checks clear.
              </p>
            </div>
          </div>

          {company.verificationStatus !== 'Company Details Verified' && (
            <button
              onClick={handleSimulateVerification}
              className="bg-[#2ECC71] hover:bg-[#27ae60] text-[#0A0D12] font-black text-xs px-6 py-3 rounded-xl transition cursor-pointer"
            >
              Simulate Verification Admin Approval →
            </button>
          )}

          {verSuccess && (
            <div className="p-4 bg-[#2ECC71]/10 border border-[#2ECC71]/30 text-[#2ECC71] rounded-2xl text-xs font-bold">
              ✓ Company details successfully verified! Official document PDF issuance is now UNLOCKED.
            </div>
          )}
        </div>
      )}

      {/* 3. Work Locations & Jurisdictions */}
      {activeSubTab === 'locations' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-[#1F2937]">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2ECC71]" />
                {language === 'zh' ? '工作地点与法律辖区 (西马与砂拉越分立)' : 'Work Locations & Jurisdiction Engine'}
              </h2>
              <p className="text-xs text-[#9CA3AF] mt-0.5">
                The system automatically recommends Employment Act 1955 (Peninsular) or Sarawak Labour Ordinance based on employee work location.
              </p>
            </div>
          </div>

          {/* List of locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {locations.map(loc => (
              <div key={loc.id} className="p-4 bg-[#0D121A] border border-[#1F2937] rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{loc.name}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                    loc.jurisdiction === 'Sarawak'
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20'
                  }`}>
                    {loc.jurisdiction}
                  </span>
                </div>
                <p className="text-[#9CA3AF]">{loc.address}</p>
                <div className="text-[11px] text-[#9CA3AF] border-t border-[#1F2937] pt-2">
                  Public Holiday Calendar: <strong className="text-white">{loc.holidayCalendarState}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Add Location Form */}
          <form onSubmit={handleAddLocationSubmit} className="bg-[#0D121A] border border-[#1F2937] p-5 rounded-2xl space-y-3 text-xs">
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#2ECC71]" /> Add New Work Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#9CA3AF] mb-1">Location Name</label>
                <input
                  type="text"
                  value={newLocName}
                  onChange={e => setNewLocName(e.target.value)}
                  placeholder="e.g. Bintulu Regional Branch"
                  className="w-full bg-[#111827] border border-[#374151] rounded-xl p-2.5 text-white outline-none focus:border-[#2ECC71]"
                  required
                />
              </div>

              <div>
                <label className="block text-[#9CA3AF] mb-1">Jurisdiction *</label>
                <select
                  value={newLocJuris}
                  onChange={e => setNewLocJuris(e.target.value as any)}
                  className="w-full bg-[#111827] border border-[#374151] rounded-xl p-2.5 text-white outline-none focus:border-[#2ECC71]"
                >
                  <option value="Sarawak">Sarawak (Sarawak Labour Ordinance)</option>
                  <option value="Peninsular Malaysia">Peninsular Malaysia (Employment Act 1955)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[#9CA3AF] mb-1">Full Office Address</label>
                <input
                  type="text"
                  value={newLocAddr}
                  onChange={e => setNewLocAddr(e.target.value)}
                  placeholder="e.g. Lot 40, Kidurong Industrial Estate, Bintulu"
                  className="w-full bg-[#111827] border border-[#374151] rounded-xl p-2.5 text-white outline-none focus:border-[#2ECC71]"
                  required
                />
              </div>
            </div>

            <button type="submit" className="bg-[#2ECC71] hover:bg-[#27ae60] text-[#0A0D12] font-black px-5 py-2.5 rounded-xl transition cursor-pointer">
              Add Location
            </button>
          </form>
        </div>
      )}

      {/* 4. Signatories */}
      {activeSubTab === 'signatories' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 space-y-6">
          <div className="flex justify-between items-center pb-3 border-b border-[#1F2937]">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <PenTool className="w-4 h-4 text-[#2ECC71]" />
              {language === 'zh' ? '授权签署人与章印设置' : 'Authorized Signatories'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {signatories.map(s => (
              <div key={s.id} className="p-4 bg-[#0D121A] border border-[#1F2937] rounded-2xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{s.name}</span>
                  {s.isDefault && <span className="text-[10px] bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20 px-2.5 py-0.5 rounded-full font-bold">Default Signatory</span>}
                </div>
                <div className="text-slate-300">{s.title}</div>
                <div className="text-[#9CA3AF] text-[11px]">{s.email}</div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddSigSubmit} className="bg-[#0D121A] border border-[#1F2937] p-5 rounded-2xl space-y-3 text-xs">
            <h3 className="font-bold text-white">Add Authorized Signatory</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={newSigName}
                onChange={e => setNewSigName(e.target.value)}
                placeholder="Full Name (e.g. Tan Sri Dr. ...)"
                className="bg-[#111827] border border-[#374151] rounded-xl p-2.5 text-white outline-none focus:border-[#2ECC71]"
                required
              />
              <input
                type="text"
                value={newSigTitle}
                onChange={e => setNewSigTitle(e.target.value)}
                placeholder="Job Title (e.g. HR Director)"
                className="bg-[#111827] border border-[#374151] rounded-xl p-2.5 text-white outline-none focus:border-[#2ECC71]"
                required
              />
              <input
                type="email"
                value={newSigEmail}
                onChange={e => setNewSigEmail(e.target.value)}
                placeholder="Official Email"
                className="bg-[#111827] border border-[#374151] rounded-xl p-2.5 text-white outline-none focus:border-[#2ECC71]"
                required
              />
            </div>
            <button type="submit" className="bg-[#2ECC71] hover:bg-[#27ae60] text-[#0A0D12] font-black px-5 py-2.5 rounded-xl transition cursor-pointer">
              Add Signatory
            </button>
          </form>
        </div>
      )}

      {/* 5. Ref Scheme & Letterhead */}
      {activeSubTab === 'letterhead' && (
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 space-y-6 text-xs">
          <h2 className="text-sm font-bold text-white pb-3 border-b border-[#1F2937]">
            Reference Scheme & Official Letterhead Config
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0D121A] p-5 rounded-2xl border border-[#1F2937] space-y-2">
              <h3 className="font-bold text-white">Company Reference Scheme Format</h3>
              <p className="text-[#9CA3AF]">Pattern: <code>[Prefix] / [DocCode] / [Year] / [RunningNo]</code></p>
              <div className="mt-3 p-3 bg-[#111827] rounded-xl border border-[#374151] text-[#2ECC71] font-mono font-semibold">
                Sample: BTS/HR/APPT/2026/015
              </div>
            </div>

            <div className="bg-[#0D121A] p-5 rounded-2xl border border-[#1F2937] space-y-2">
              <h3 className="font-bold text-white">Letterhead Branding</h3>
              <p className="text-[#9CA3AF]">Header Text: {company.letterheadConfig.headerText}</p>
              <p className="text-[#9CA3AF]">Primary Theme Color: <span className="inline-block w-4 h-4 rounded align-middle ml-1" style={{ backgroundColor: company.letterheadConfig.primaryColor }}></span> {company.letterheadConfig.primaryColor}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
