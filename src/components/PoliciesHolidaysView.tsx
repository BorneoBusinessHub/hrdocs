import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react';

export const PoliciesHolidaysView: React.FC = () => {
  const { company, updateCompany, locations, language } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'entitlements' | 'holidays'>('entitlements');

  // Policy Form State
  const [probationMonths, setProbationMonths] = useState(company.companyPolicyDefaults.probationMonthsDefault);
  const [annualLeaveDays, setAnnualLeaveDays] = useState(company.companyPolicyDefaults.annualLeaveDaysDefault);
  const [medicalLeaveDays, setMedicalLeaveDays] = useState(company.companyPolicyDefaults.medicalLeaveDaysDefault);
  const [hospitalizationDays, setHospitalizationDays] = useState(company.companyPolicyDefaults.hospitalizationDaysDefault);
  const [overtimeThresholdRM, setOvertimeThresholdRM] = useState(company.companyPolicyDefaults.overtimeEligibilityThresholdRM);

  const [noticeProbation, setNoticeProbation] = useState(company.companyPolicyDefaults.noticePeriodProbationDays);
  const [noticeConfirmed, setNoticeConfirmed] = useState(company.companyPolicyDefaults.noticePeriodConfirmedDays);

  const [saveMsg, setSaveMsg] = useState('');

  const handleSavePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany({
      companyPolicyDefaults: {
        probationMonthsDefault: probationMonths,
        annualLeaveDaysDefault: annualLeaveDays,
        medicalLeaveDaysDefault: medicalLeaveDays,
        hospitalizationDaysDefault: hospitalizationDays,
        overtimeEligibilityThresholdRM: overtimeThresholdRM,
        noticePeriodProbationDays: noticeProbation,
        noticePeriodConfirmedDays: noticeConfirmed,
      },
    });

    setSaveMsg('Company Policy Defaults successfully updated!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm">
        <div className="flex border-b border-slate-700 space-x-4 pb-3">
          <button
            onClick={() => setActiveSubTab('entitlements')}
            className={`text-xs font-semibold pb-2 border-b-2 transition ${
              activeSubTab === 'entitlements' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400'
            }`}
          >
            {language === 'zh' ? '三层权益模型 (Statutory vs Company Policy)' : '3-Tier Entitlement Matrix'}
          </button>
          <button
            onClick={() => setActiveSubTab('holidays')}
            className={`text-xs font-semibold pb-2 border-b-2 transition ${
              activeSubTab === 'holidays' ? 'border-teal-400 text-teal-400' : 'border-transparent text-slate-400'
            }`}
          >
            {language === 'zh' ? '年度公共假期与通告生成器' : 'Public Holidays Notice Generator'}
          </button>
        </div>

        {activeSubTab === 'entitlements' && (
          <form onSubmit={handleSavePolicy} className="mt-4 space-y-6 text-xs">
            <div className="p-3.5 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
              <div className="font-bold text-teal-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> 3-Tier Policy Hierarchy Rule Engine
              </div>
              <p className="text-slate-300 leading-relaxed">
                1. <strong>Statutory Baseline:</strong> Minimum standards under Employment Act 1955 or Sarawak Labour Ordinance.<br />
                2. <strong>Company Policy Default:</strong> Global company entitlements set below.<br />
                3. <strong>Employee-Specific Override:</strong> Customized terms recorded in individual employment episodes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-medium font-semibold">Standard Probation Period (Months)</label>
                <input
                  type="number"
                  value={probationMonths}
                  onChange={e => setProbationMonths(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium font-semibold">Company Annual Leave (Days)</label>
                <input
                  type="number"
                  value={annualLeaveDays}
                  onChange={e => setAnnualLeaveDays(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium font-semibold">Overtime Cap Threshold (RM Salary)</label>
                <input
                  type="number"
                  value={overtimeThresholdRM}
                  onChange={e => setOvertimeThresholdRM(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium font-semibold">Medical Leave Days</label>
                <input
                  type="number"
                  value={medicalLeaveDays}
                  onChange={e => setMedicalLeaveDays(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium font-semibold">Hospitalization Days</label>
                <input
                  type="number"
                  value={hospitalizationDays}
                  onChange={e => setHospitalizationDays(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium font-semibold">Confirmed Notice Period (Days)</label>
                <input
                  type="number"
                  value={noticeConfirmed}
                  onChange={e => setNoticeConfirmed(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2.5 text-slate-100"
                />
              </div>
            </div>

            <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-5 py-2.5 rounded-xl">
              Save Company Policy Defaults
            </button>

            {saveMsg && (
              <div className="p-3 bg-teal-950 border border-teal-700 text-teal-200 rounded-xl font-semibold">
                ✓ {saveMsg}
              </div>
            )}
          </form>
        )}

        {activeSubTab === 'holidays' && (
          <div className="mt-4 space-y-4 text-xs">
            <h3 className="font-bold text-slate-200 border-b border-slate-700 pb-2">State & Sarawak Public Holidays Notice Generator</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Sarawak Gazetted Holidays 2026
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                  <li>Sarawak Day (22 July)</li>
                  <li>Good Friday (3 April)</li>
                  <li>Governor of Sarawak Birthday (October)</li>
                  <li>Hari Raya Aidilfitri & Gawai Dayak</li>
                </ul>
                <button
                  onClick={() => alert("Sarawak Public Holidays Official HR Memo generated!")}
                  className="mt-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-lg"
                >
                  Generate Sarawak Holiday Memo
                </button>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl space-y-2">
                <div className="font-bold text-teal-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> Peninsular Malaysia (Kuala Lumpur & Selangor)
                </div>
                <ul className="list-disc list-inside text-slate-300 space-y-1 text-[11px]">
                  <li>Federal Territory Day (1 February)</li>
                  <li>Thaipusam (Selected States)</li>
                  <li>Agong's Birthday</li>
                  <li>National Day (31 August)</li>
                </ul>
                <button
                  onClick={() => alert("Peninsular Public Holidays HR Memo generated!")}
                  className="mt-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-3 py-1.5 rounded-lg"
                >
                  Generate Peninsular Holiday Memo
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
