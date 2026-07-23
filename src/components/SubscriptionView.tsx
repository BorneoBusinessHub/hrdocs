import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  const { subscription, redeemCourseClaimCode, episodes, language } = useApp();

  const [claimCodeInput, setClaimCodeInput] = useState('');
  const [claimStatus, setClaimStatus] = useState('');

  const activeEmployees = episodes.filter(e => e.employmentStatus === 'Active' || e.employmentStatus === 'Confirmed' || e.employmentStatus === 'Probation');

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimCodeInput) return;
    const success = redeemCourseClaimCode(claimCodeInput);
    if (success) {
      setClaimStatus(`✓ Code ${claimCodeInput.toUpperCase()} redeemed! Capacity expanded.`);
    } else {
      setClaimStatus(`✕ Invalid or expired claim code.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-slate-700">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-teal-400" />
              {language === 'zh' ? '课程学员权益兑换与 SaaS 订阅管理' : 'Course Member Membership & SaaS Plan'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Course attendees of BBH Employment Law Masterclass receive complimentary active employee capacity credits.
            </p>
          </div>

          <span className="bg-teal-950 text-teal-300 border border-teal-800 px-3 py-1 rounded-full text-xs font-bold">
            {subscription.planTier} Plan
          </span>
        </div>

        {/* Headcount Capacity Meter */}
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl space-y-3 text-xs">
          <div className="flex justify-between items-center font-bold text-slate-200">
            <span>Active Employee Headcount Usage</span>
            <span className="text-teal-400 font-mono text-sm">{activeEmployees.length} / {subscription.maxActiveEmployees} Employees</span>
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
            <div
              className="bg-teal-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min((activeEmployees.length / subscription.maxActiveEmployees) * 100, 100)}%` }}
            ></div>
          </div>

          <p className="text-slate-400 text-[11px]">
            Capacity is counted based on <strong className="text-slate-200">Active Employment Episodes</strong>. Separated or archived employees do not consume active headcount credits.
          </p>
        </div>

        {/* Course Claim Code Input */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-700 rounded-2xl space-y-3 text-xs">
          <h3 className="font-bold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" /> Redeem Course Member Voucher / Claim Code
          </h3>

          <p className="text-slate-300">
            Enter your course voucher code provided during the Sarawak/Peninsular HR Employment Law Workshop (Try code: <code className="text-teal-300">BBH-SARAWAK-PILOT</code>):
          </p>

          <form onSubmit={handleClaimSubmit} className="flex gap-2 max-w-md">
            <input
              type="text"
              value={claimCodeInput}
              onChange={e => setClaimCodeInput(e.target.value)}
              placeholder="e.g. BBH-SARAWAK-PILOT"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-slate-100 font-mono uppercase outline-none focus:border-teal-500"
            />
            <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-4 py-2.5 rounded-xl shadow">
              Redeem Code
            </button>
          </form>

          {claimStatus && (
            <div className={`p-3 rounded-xl border font-semibold text-xs ${
              claimStatus.startsWith('✓') ? 'bg-teal-950 border-teal-700 text-teal-200' : 'bg-rose-950 border-rose-800 text-rose-200'
            }`}>
              {claimStatus}
            </div>
          )}
        </div>

        {/* Plan Tier Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl space-y-2">
            <div className="font-bold text-slate-200 text-sm">Course Pilot Tier</div>
            <div className="text-2xl font-bold text-teal-400">Complimentary</div>
            <ul className="space-y-1 text-slate-300 text-[11px] pt-2 border-t border-slate-800">
              <li>✓ Up to 25 Active Employees</li>
              <li>✓ West Malaysia & Sarawak EA Rules</li>
              <li>✓ 12 Top-Level Template Families</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl space-y-2">
            <div className="font-bold text-slate-200 text-sm">Growth SME Tier</div>
            <div className="text-2xl font-bold text-slate-100">RM 199 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
            <ul className="space-y-1 text-slate-300 text-[11px] pt-2 border-t border-slate-800">
              <li>✓ Up to 100 Active Employees</li>
              <li>✓ Multi-Signatory Workflows</li>
              <li>✓ Dedicated AI Writing Credits</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-700 rounded-2xl space-y-2">
            <div className="font-bold text-slate-200 text-sm">Enterprise Tier</div>
            <div className="text-2xl font-bold text-slate-100">RM 499 <span className="text-xs font-normal text-slate-400">/ mo</span></div>
            <ul className="space-y-1 text-slate-300 text-[11px] pt-2 border-t border-slate-800">
              <li>✓ Unlimited Active Employees</li>
              <li>✓ Custom SSM Sub-Entities</li>
              <li>✓ 24/7 Priority Support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
