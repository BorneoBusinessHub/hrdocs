import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Clock,
  FileCheck,
  FilePlus,
  FileText,
  Gavel,
  Sparkles,
  Users
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    episodes,
    documents,
    cases,
    subscription,
    setActiveTab,
    language
  } = useApp();

  const activeEmployees = episodes.filter(e => e.employmentStatus === 'Active' || e.employmentStatus === 'Probation' || e.employmentStatus === 'Confirmed');
  const pendingApprovals = documents.filter(d => d.status === 'Pending Approval' || d.status === 'Compliance Check Required');
  const activeCasesList = cases.filter(c => c.stage !== 'Case Closed');
  const issuedDocsCount = documents.filter(d => d.status === 'Issued' || d.status === 'Delivered' || d.status === 'Accepted').length;

  return (
    <div className="space-y-6">
      {/* Banner / Course Claim Status */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#2ECC71]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/30 text-xs px-3 py-1 rounded-full font-bold">
                BORNEO HR INTEL
              </span>
              <span className="text-[#9CA3AF] text-xs font-semibold uppercase tracking-wider">• Peninsular EA 1955 & Sarawak Labour Ordinance</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mt-3 text-white tracking-tight">
              {language === 'zh' ? '欢迎使用 BBH 马来西亚 HR 智能文档与合同系统' : 'BBH Malaysia HR Documents & Contract Intelligence'}
            </h1>
            <p className="text-[#9CA3AF] text-xs md:text-sm mt-2 max-w-2xl leading-relaxed">
              {language === 'zh'
                ? '在 10 分钟内生成合规 HR 合同、解雇与 Show Cause 纪律文件。系统根据工作地点推荐西马与砂拉越法律辖区，自动执行确定性规则检查。'
                : 'Generate compliant HR contracts, appointment letters, and disciplinary documents with Peninsular EA 1955 and Sarawak Labour Ordinance multi-jurisdiction rule validation.'}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('subscription')}
            className="bg-[#2ECC71] hover:bg-[#27ae60] text-[#0A0D12] font-black px-6 py-3 rounded-2xl text-xs flex items-center space-x-2 shadow-[0_0_20px_rgba(46,204,113,0.3)] transition shrink-0 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>{language === 'zh' ? '查看课程权益与额度' : 'Course Membership & Plan'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row - Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#9CA3AF] text-xs uppercase tracking-widest font-bold mb-1">
                {language === 'zh' ? '在职员工人数' : 'Active Employees'}
              </p>
              <p className="text-3xl font-bold text-white tracking-tight">{activeEmployees.length}</p>
            </div>
            <div className="w-10 h-10 bg-[#2ECC71]/10 text-[#2ECC71] rounded-2xl flex items-center justify-center border border-[#2ECC71]/20">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-[#9CA3AF] font-medium mb-1.5">
              <span>Limit Usage</span>
              <span className="text-white font-bold">{activeEmployees.length} / {subscription.maxActiveEmployees}</span>
            </div>
            <div className="w-full bg-[#1F2937] h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#2ECC71] h-full rounded-full shadow-[0_0_8px_#2ECC71]"
                style={{ width: `${Math.min((activeEmployees.length / subscription.maxActiveEmployees) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#9CA3AF] text-xs uppercase tracking-widest font-bold mb-1">
                {language === 'zh' ? '已签发/送达文件' : 'Issued / Delivered'}
              </p>
              <p className="text-3xl font-bold text-white tracking-tight">{issuedDocsCount}</p>
            </div>
            <div className="w-10 h-10 bg-[#2ECC71]/10 text-[#2ECC71] rounded-2xl flex items-center justify-center border border-[#2ECC71]/20">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-[#2ECC71] font-medium mt-4 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71] inline-block"></span>
            Locked PDF + QR Verified
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#9CA3AF] text-xs uppercase tracking-widest font-bold mb-1">
                {language === 'zh' ? '待审批与合规风险' : 'Pending Approvals'}
              </p>
              <p className="text-3xl font-bold text-amber-400 tracking-tight">{pendingApprovals.length}</p>
            </div>
            <div className="w-10 h-10 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-[#9CA3AF] font-medium mt-4">
            Risk-tiered workflow active
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#9CA3AF] text-xs uppercase tracking-widest font-bold mb-1">
                {language === 'zh' ? '进行中纪律案件' : 'Active Cases'}
              </p>
              <p className="text-3xl font-bold text-rose-400 tracking-tight">{activeCasesList.length}</p>
            </div>
            <div className="w-10 h-10 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center border border-rose-500/20">
              <Gavel className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[11px] text-[#9CA3AF] font-medium mt-4">
            Show Cause to DI Notice
          </p>
        </div>
      </div>

      {/* Quick Actions Grid - Bento Box */}
      <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#1F2937]">
          <div>
            <p className="text-[#9CA3AF] text-xs uppercase tracking-widest font-bold mb-0.5">Quick Actions</p>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2ECC71]" />
              {language === 'zh' ? '快速生成 HR 文件 (12 顶层模板家族)' : 'Quick HR Document Generators'}
            </h2>
          </div>
          <button
            onClick={() => setActiveTab('generator')}
            className="text-xs text-[#2ECC71] hover:underline font-bold"
          >
            {language === 'zh' ? '进入完整生成编辑器 →' : 'Open Workspace →'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { family: 'Letter of Appointment', title: 'Letter of Appointment', risk: 'Medium' },
            { family: 'Contract of Service', title: 'Contract of Service', risk: 'Medium' },
            { family: 'Show Cause Letter', title: 'Show Cause Letter', risk: 'Medium' },
            { family: 'Confirmation & Probation Documents', title: 'Confirmation Letter', risk: 'Low' },
            { family: 'Employment Change Documents', title: 'Terms Addendum', risk: 'Medium' },
            { family: 'Performance Improvement Plan', title: 'PIP Document', risk: 'Medium' },
            { family: 'HR Memo / Employee Notice', title: 'General HR Memo', risk: 'Low' },
            { family: 'Warning Letter Family', title: 'Warning Letter', risk: 'High' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab('generator')}
              className="p-4 bg-[#0D121A] hover:bg-[#1F2937] border border-[#1F2937] hover:border-[#2ECC71]/50 rounded-2xl text-left transition group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] bg-[#2ECC71]/10 text-[#2ECC71] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {item.risk} Risk
                  </span>
                  <FilePlus className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#2ECC71] transition" />
                </div>
                <div className="text-xs font-bold text-white group-hover:text-[#2ECC71] transition">{item.title}</div>
              </div>
              <span className="text-[10px] text-[#9CA3AF] mt-3 block font-medium">{item.family}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout: Active Disciplinary Cases & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Disciplinary Cases Widget */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#1F2937]">
            <div>
              <p className="text-[#9CA3AF] text-xs uppercase tracking-widest font-bold mb-0.5">Disciplinary</p>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Gavel className="w-4 h-4 text-rose-400" />
                {language === 'zh' ? '纪律案件时间线 (Show Cause 至 DI)' : 'Active Cases Timeline'}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('cases')}
              className="text-xs text-[#2ECC71] hover:underline font-bold"
            >
              {language === 'zh' ? '管理全部案件 →' : 'View All →'}
            </button>
          </div>

          {activeCasesList.length === 0 ? (
            <div className="text-center py-8 text-[#9CA3AF] text-xs">
              No active disciplinary cases.
            </div>
          ) : (
            <div className="space-y-3">
              {activeCasesList.map((c) => (
                <div key={c.id} className="p-4 bg-[#0D121A] border border-[#1F2937] border-l-4 border-l-[#2ECC71] rounded-2xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{c.caseNumber} • {c.employeeName}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {c.stage}
                    </span>
                  </div>
                  <p className="text-[#9CA3AF] text-xs line-clamp-2 leading-relaxed">{c.allegationsSummary}</p>
                  <div className="flex justify-between items-center text-[11px] text-[#9CA3AF] pt-2 border-t border-[#1F2937]">
                    <span>Deadline: <strong className="text-rose-400">{c.replyDeadline}</strong></span>
                    <button
                      onClick={() => setActiveTab('cases')}
                      className="text-[#2ECC71] hover:underline font-bold"
                    >
                      {language === 'zh' ? '查看时间线' : 'View Timeline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Issued Documents */}
        <div className="bg-[#111827] border border-[#1F2937] rounded-3xl p-6">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#1F2937]">
            <div>
              <p className="text-[#9CA3AF] text-xs uppercase tracking-widest font-bold mb-0.5">Documents</p>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#2ECC71]" />
                {language === 'zh' ? '最新文件与送达记录' : 'Recent Issued Documents'}
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('generator')}
              className="text-xs text-[#2ECC71] hover:underline font-bold"
            >
              {language === 'zh' ? '全部文件列表 →' : 'View Records →'}
            </button>
          </div>

          <div className="space-y-3">
            {documents.slice(0, 3).map((d) => (
              <div key={d.id} className="p-4 bg-[#0D121A] border border-[#1F2937] rounded-2xl text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{d.companyRefNumber}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    d.status === 'Issued' || d.status === 'Delivered'
                      ? 'bg-[#2ECC71]/10 text-[#2ECC71] border border-[#2ECC71]/20'
                      : 'bg-[#1F2937] text-[#9CA3AF] border border-[#374151]'
                  }`}>
                    {d.status}
                  </span>
                </div>
                <div className="text-slate-200 font-semibold">{d.templateTitle} — {d.employeeName}</div>
                <div className="flex justify-between items-center text-[10px] text-[#9CA3AF] pt-2 border-t border-[#1F2937]">
                  <span>Jurisdiction: <strong className="text-white">{d.jurisdiction}</strong></span>
                  <span>System ID: <code className="text-[#2ECC71] font-mono">{d.systemDocumentId}</code></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

